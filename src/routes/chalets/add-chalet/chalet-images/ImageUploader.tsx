import React, { useRef, useState } from 'react';
import { ImagePlus, X, Loader2, Edit2, GripVertical, Check } from 'lucide-react';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } from '@/config';
import { ChaletImage } from '@/context/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  images: ChaletImage[];
  onImagesChange: (images: ChaletImage[]) => void;
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

// Sortable Image Component
const SortableImage = ({
  image,
  index,
  onRemove,
  onLabelEdit,
}: {
  image: ChaletImage;
  index: number;
  onRemove: () => void;
  onLabelEdit: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.key || `img-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const handleLabelEdit = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    onLabelEdit();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    onRemove();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-lg shadow-md overflow-hidden
        ${isDragging ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
    >
      <div className="relative">
        <img src={image.url} alt={image.alt} className="w-full h-48 object-cover" />
        {image.isMain && <Badge className="absolute top-2 left-2 bg-blue-500">Main Image</Badge>}
        <div className="absolute top-2 right-2 flex gap-2">
        <button
            onClick={handleRemove}
            type="button" // Explicitly set button type
            className="bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
          <div
            {...attributes}
            {...listeners}
            className="bg-black/50 p-1 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="text-white" size={16} />
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{image.label || 'Add label'}</span>
          <button
            onClick={handleLabelEdit}
            type="button" // Explicitly set button type
            className="text-gray-400 hover:text-gray-600"
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<ChaletImage | null>(null);
  const [customLabel, setCustomLabel] = useState('');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (images.length >= 8) {
      toast({
        variant: 'destructive',
        title: 'Maximum image limit reached',
        description: 'You can upload a maximum of 8 images.',
      });
      return;
    }

    setIsUploading(true);

    const newImages: ChaletImage[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, 8 - images.length); i++) {
        const file = files[i];
        const objectKey = `great-rift-lodge/chalet/image-${Date.now()}-${file.name}`;

        const params = {
          Bucket: AWS_S3_BUCKET,
          Key: objectKey,
          Body: file,
          ContentType: file.type,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const imageUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`;

        newImages.push({
          file,
          url: imageUrl,
          alt: file.name,
          key: objectKey,
          label: customLabel, // Default label
          isMain: images.length === 0 && i === 0, // First image is main by default
        });
      }

      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);

      // Success toast
      if (newImages.length > 0) {
        toast({
          variant: 'success',
          title: 'Images uploaded successfully',
          description: `${newImages.length} image(s) added`,
        });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your images.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];

    if (imageToRemove.key) {
      try {
        const deleteParams = {
          Bucket: AWS_S3_BUCKET,
          Key: imageToRemove.key,
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3Client.send(deleteCommand);

        const updatedImages = images
          .filter((_, index) => index !== indexToRemove)
          .map((img, idx) => ({
            ...img,
            isMain: idx === 0, // Update main image status after removal
          }));
        onImagesChange(updatedImages);

        toast({
          variant: 'destructive',
          title: 'Image removed',
          description: 'The image has been removed from your uploads.',
        });
      } catch (error) {
        console.error('Image deletion error:', error);
        toast({
          variant: 'destructive',
          title: 'Image deletion failed',
          description: 'Could not remove the image from storage.',
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(
        (img) => img.key === active.id || `img-${images.indexOf(img)}` === active.id,
      );
      const newIndex = images.findIndex(
        (img) => img.key === over.id || `img-${images.indexOf(img)}` === over.id,
      );

      const newImages = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({
        ...img,
        isMain: idx === 0, // Update main image status
      }));

      onImagesChange(newImages);
    }
  };

  const updateImageLabel = (newLabel: string) => {
    if (!editingImage || !newLabel.trim()) return;

    const updatedImages = images.map((img) =>
      img === editingImage ? { ...img, label: newLabel.trim() } : img,
    );

    onImagesChange(updatedImages);
    setEditingImage(null);
    setCustomLabel('');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !isUploading && images.length < 8) {
      fileInputRef.current.click();
    } else if (images.length >= 8) {
      toast({
        variant: 'destructive',
        title: 'Maximum image limit reached',
        description: 'You can upload a maximum of 8 images.',
      });
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={isUploading || images.length >= 8}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SortableContext
            items={images.map((img, idx) => img.key || `img-${idx}`)}
            strategy={horizontalListSortingStrategy}
          >
            {images.map((img, idx) => (
              <SortableImage
                key={img.key || `img-${idx}`}
                image={img}
                index={idx}
                onRemove={() => removeImage(idx)}
                onLabelEdit={() => {
                  setEditingImage(img);
                  setCustomLabel(img.label);
                }}
              />
            ))}
          </SortableContext>

          {images.length < 8 && (
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              {isUploading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <ImagePlus className="text-gray-400" size={24} />
                  <span className="text-sm text-gray-500 mt-2">Add Photo</span>
                </>
              )}
            </button>
          )}
        </div>
      </DndContext>

      {/* Label editing modal/overlay */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center gap-2">
              <Input
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Enter room label"
                className="text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateImageLabel(customLabel);
                  } else if (e.key === 'Escape') {
                    setEditingImage(null);
                    setCustomLabel('');
                  }
                }}
              />
              <Button size="sm" onClick={() => updateImageLabel(customLabel)} className="px-2">
                <Check size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-1">
        {images.length === 0
          ? 'Upload 5-8 images to showcase your chalet'
          : `${8 - images.length} more image${8 - images.length !== 1 ? 's' : ''} can be added`}
      </p>
    </div>
  );
};
