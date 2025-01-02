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

// Declare Google global types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          PlacesService: new (div: HTMLDivElement) => google.maps.places.PlacesService;
          PlacesServiceStatus: {
            OK: string;
          };
          PlaceSearchRequest: {
            location?: google.maps.LatLng | google.maps.LatLngLiteral;
            radius?: number;
            type?: string[];
          };
        };
        Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
        Marker: new (options: google.maps.MarkerOptions) => google.maps.Marker;
        LatLng: new (lat: number, lng: number) => google.maps.LatLng;
      };
    };
  }
}
interface LocationStepProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  googleMapsApiKey: string;
}

export const LocationStep: React.FC<LocationStepProps> = ({ setCurrentStep, googleMapsApiKey }) => {
  const { updateChaletData, chaletData } = useChaletContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    chaletData?.location || null,
  );
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const form = useForm<LocationFormData>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      // location: chaletData.location || {
      //   name: "",
      //   address: "",
      //   coordinates: { lat: 0, lng: 0 }
      // }
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

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
          console.log('Google Maps script loaded');
          setMapLoaded(true); // Set mapLoaded to true when the script is loaded
        };
      } else {
        setMapLoaded(true); // If Google Maps is already loaded
      }
    };
    loadGoogleMapsScript();
  }, [googleMapsApiKey]);

  // Render map for selected location
  const renderMap = () => {
    const location = form.getValues('location');
    if (!location.coordinates.lat || !mapLoaded) return null;

    return (
      <div className="w-full h-[400px] mt-4">
        <div
          id="location-map"
          className="w-full h-full rounded-lg"
          ref={(el) => {
            if (el && window.google) {
              const map = new window.google.maps.Map(el, {
                center: location.coordinates,
                zoom: 15,
              });

              new window.google.maps.Marker({
                position: location.coordinates,
                map: map,
                title: location.name,
              });
            }
          }}
        />
      </div>
    );
  };

  // Search locations using Google Places API
  const searchLocations = useCallback(async (query: string) => {
    if (!window.google?.maps?.places || !query) return;

    setIsLoading(true);
    setError(null);

    try {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));

      service.textSearch(
        { query },
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus,
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const mappedLocations: LocationData[] = results
              .filter((place): place is google.maps.places.PlaceResult => !!place.place_id)
              .map((place) => ({
                id: place.place_id || '',
                name: place.name || '',
                address: place.formatted_address || place.vicinity || '',
                coordinates: {
                  lat: place.geometry?.location?.lat() || 0,
                  lng: place.geometry?.location?.lng() || 0,
                },
              }));

            setLocations(mappedLocations);
          } else {
            setError('No locations found or search failed');
          }
          setIsLoading(false);
        },
      );
    } catch (error) {
      setError(`Error searching locations:, ${error}`);
      setIsLoading(false);
    }
  }, []);

  // Geolocation handler
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const service = new window.google.maps.places.PlacesService(
            document.createElement('div'),
          );

          const location = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          );

          service.nearbySearch(
            {
              location,
              radius: 5000,
              type: ['lodging', 'hotel'].join('|'), // Corrected type to string array
            },
            (
              results: google.maps.places.PlaceResult[] | null,
              status: google.maps.places.PlacesServiceStatus,
            ) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const nearbyLocations: LocationData[] = results
                  .filter((place): place is google.maps.places.PlaceResult => !!place.place_id)
                  .map((place) => ({
                    id: place.place_id || '',
                    name: place.name || '',
                    address: place.vicinity || place.formatted_address || '',
                    coordinates: {
                      lat: place.geometry?.location?.lat() || 0,
                      lng: place.geometry?.location?.lng() || 0,
                    },
                  }));

                setLocations(nearbyLocations);
              } else {
                setError('No nearby locations found');
              }
              setIsLoading(false);
            },
          );
        },
        (error) => {
          setError('Geolocation error: ' + error.message);
          setIsLoading(false);
        },
      );
    } else {
      setError('Geolocation not supported');
      setIsLoading(false);
    }
  };

  // Search on term change
  useEffect(() => {
    if (searchTerm.length > 2 && window.google) {
      searchLocations(searchTerm);
    }
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
              // Location search view
              <>
                <div className="flex items-center mb-4 space-x-2">
                  <input
                    placeholder="Search locations (e.g., hotels, resorts)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 border rounded"
                    disabled={!mapLoaded}
                  />
                  {!mapLoaded && (
                    <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
                  )}

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
                        key={location?.id}
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
              // Selected location view
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

                {renderMap()}
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
                    onClick={() => setSelectedLocation(null)}
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
