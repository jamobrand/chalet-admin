import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MapPin, Locate } from 'lucide-react';
import { LocationData } from '@/context/types';
import { useChaletContext } from '@/context/use-chalet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { LocationFormData, LocationSchema } from '../types/chalet-schema';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Nominatim API response type
interface NominatimPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

interface LocationStepProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const LocationStep: React.FC<LocationStepProps> = ({ setCurrentStep }) => {
  const { updateChaletData, chaletData } = useChaletContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    chaletData?.location || null,
  );
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  const form = useForm<LocationFormData>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      location: {
        name: chaletData.location?.name || '',
        address: chaletData?.location?.address || '',
        coordinates: {
          lat: chaletData?.location?.coordinates?.lat || 0,
          lng: chaletData?.location?.coordinates?.lng || 0,
        },
      },
    },
  });


  // Initialize map when component mounts
  useEffect(() => {
    if (!map && selectedLocation) {
      const mapInstance = L.map('location-map').setView(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      const markerInstance = L.marker([
        selectedLocation.coordinates.lat,
        selectedLocation.coordinates.lng
      ]).addTo(mapInstance);

      setMap(mapInstance);
      setMarker(markerInstance);

      return () => {
        mapInstance.remove();
      };
    }
  }, [map, selectedLocation]);

    // Update marker position when location changes
    useEffect(() => {
      if (map && marker && selectedLocation) {
        const newLatLng = [
          selectedLocation.coordinates.lat,
          selectedLocation.coordinates.lng
        ] as L.LatLngExpression;
        
        marker.setLatLng(newLatLng);
        map.setView(newLatLng, 15);
      }
    }, [map, marker, selectedLocation]);

  // Render map for selected location
  // const renderMap = () => {
  //   const location = form.getValues('location');
  //   if (!location.coordinates.lat || !mapLoaded) return null;

  //   return (
  //     <div className="w-full h-[400px] mt-4">
  //       <div
  //         id="location-map"
  //         className="w-full h-full rounded-lg"
  //         ref={(el) => {
  //           if (el && window.google) {
  //             const map = new window.google.maps.Map(el, {
  //               center: location.coordinates,
  //               zoom: 15,
  //             });

  //             new window.google.maps.Marker({
  //               position: location.coordinates,
  //               map: map,
  //               title: location.name,
  //             });
  //           }
  //         }}
  //       />
  //     </div>
  //   );
  // };

  // Search locations using Google Places API
 // Search locations using OpenStreetMap Nominatim API
 const searchLocations = useCallback(async (query: string) => {
  if (!query) return;

  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data = await response.json();
    
    const mappedLocations: LocationData[] = data.map((place: NominatimPlace) => ({
      id: place.place_id.toString(),
      name: place.display_name.split(',')[0],
      address: place.display_name,
      coordinates: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      },
    }));

    setLocations(mappedLocations);
    setIsLoading(false);
  } catch (error) {
    setError(`Error searching locations: ${error}`);
    setIsLoading(false);
  }
}, []);


  // Geolocation handler// Get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch location details');
            }

            const data = await response.json();
            
            const nearbyLocation: LocationData = {
              id: data.place_id.toString(),
              name: data.display_name.split(',')[0],
              address: data.display_name,
              coordinates: {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lon),
              },
            };

            setLocations([nearbyLocation]);
            setIsLoading(false);
          } catch (error) {
            setError(`Error getting location details: ${error}`);
            setIsLoading(false);
          }
        },
        (error) => {
          setError('Geolocation error: ' + error.message);
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setIsLoading(false);
    }
  };

  // Search on term change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) {
        searchLocations(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchLocations]);

  const handleLocationSelect = (location: LocationData) => {
    form.setValue('location', {
      name: location.name,
      address: location.address,
      coordinates: location.coordinates,
    });
    setSelectedLocation(location);
  };

  const onSubmit = (data: LocationFormData) => {
    updateChaletData('location', data.location);
    setCurrentStep(6);
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Select Chalet Location</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {!selectedLocation ? (
              <>
                <div className="flex items-center mb-4 space-x-2">
                  <input
                    placeholder="Search locations (e.g., hotels, resorts)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 border rounded"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={getCurrentLocation}
                    title="Find Nearby Locations"
                    type="button"
                  >
                    <Locate className="size-5" />
                  </Button>
                </div>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                {isLoading ? (
                  <div className="text-center">Searching locations...</div>
                ) : (
                  <div className="grid gap-4">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="border p-4 rounded-lg cursor-pointer hover:bg-secondary/20"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="flex items-center space-x-4">
                          <MapPin className="size-8 text-primary" />
                          <div>
                            <h3 className="font-semibold">{location.name}</h3>
                            <p className="text-muted-foreground">{location.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="border p-4 rounded-lg bg-primary/10">
                          <div className="flex items-center space-x-4">
                            <MapPin className="size-8 text-primary" />
                            <div>
                              <h3 className="font-semibold text-xl">{field.value.name}</h3>
                              <p className="text-muted-foreground">{field.value.address}</p>
                              <p className="text-sm">
                                Coordinates: {field.value.coordinates.lat},{' '}
                                {field.value.coordinates.lng}
                              </p>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div id="location-map" className="w-full h-[400px] rounded-lg" />
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentStep(4)} type="button">
                <ChevronLeft className="mr-2" /> Back
              </Button>
              {selectedLocation && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedLocation(null);
                      if (map) {
                        map.remove();
                        setMap(null);
                        setMarker(null);
                      }
                    }}
                    type="button"
                  >
                    Change Location
                  </Button>
                  <Button type="submit">
                    Next <ChevronRight className="ml-2" />
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
