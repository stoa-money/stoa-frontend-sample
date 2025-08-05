import { useCallback, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    country: string;
  }) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const libraries: ("places")[] = ["places"];

export function AddressAutocomplete({ 
  onAddressSelect, 
  placeholder = "Start typing your address...",
  className = "",
  required = false
}: AddressAutocompleteProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
    // Restrict to UK addresses
    autocompleteInstance.setComponentRestrictions({ country: 'gb' });
    autocompleteInstance.setFields(['address_components', 'formatted_address']);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      
      if (place.address_components) {
        const addressComponents = place.address_components;
        
        // Parse address components
        let streetNumber = '';
        let streetName = '';
        let city = '';
        let postCode = '';
        let country = 'GB';
        
        addressComponents.forEach((component) => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            streetName = component.long_name;
          }
          if (types.includes('locality') || types.includes('postal_town')) {
            city = component.long_name;
          }
          if (types.includes('postal_code')) {
            postCode = component.long_name;
          }
          if (types.includes('country')) {
            country = component.short_name;
          }
        });
        
        // Format the address
        const addressLine1 = streetNumber;
        const addressLine2 = streetName;
        
        onAddressSelect({
          addressLine1,
          addressLine2,
          city,
          postCode,
          country
        });
      }
    }
  }, [autocomplete, onAddressSelect]);

  if (!isLoaded) {
    return (
      <Input 
        className={className}
        placeholder="Loading..."
        disabled
        required={required}
      />
    );
  }

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
    >
      <Input
        ref={inputRef}
        className={className}
        placeholder={placeholder}
        required={required}
        style={{ fontSize: '1rem' }}
      />
    </Autocomplete>
  );
}