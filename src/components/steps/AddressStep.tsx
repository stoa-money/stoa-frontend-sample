import { StepActionButton } from '@/components/StepActionButton';
import { StepProps } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { CreateUserRequest } from '@/types/apiModel';
import { useState } from 'react';
import { getCountryDisplayName } from '@/types/countries';
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';

interface AddressStepProps extends StepProps {
  userDetails: CreateUserRequest;
  setUserDetails: (userDetails: CreateUserRequest) => void;
}

export function AddressStep({ isLoading, onAction, userDetails, setUserDetails }: AddressStepProps) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const isFieldInvalid = (fieldName: string, value: string | undefined) => {
    return touchedFields[fieldName] && (!value || value.trim() === '');
  };

  const isFormValid = () => {
    return !!(
      userDetails.address?.addressLine1?.trim() &&
      userDetails.address?.addressLine2?.trim() &&
      userDetails.address?.city?.trim() &&
      userDetails.address?.postCode?.trim()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onAction();
    }
  };

  const handleAddressSelect = (address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    country: string;
  }) => {
    setUserDetails({
      ...userDetails,
      address: {
        ...userDetails.address,
        ...address
      }
    });
    setShowManualEntry(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold mb-2">Your address details</h1>
        <p className="text-lg text-gray-600">We need these details to open your Pot</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-12">
          {!showManualEntry && (
            <div>
              <label className="block text-gray-700 mb-2">
                Search for your address
              </label>
              <AddressAutocomplete
                onAddressSelect={handleAddressSelect}
                className="h-14 rounded-xl border-gray-300"
                placeholder="Start typing your address..."
              />
              <button
                type="button"
                onClick={() => setShowManualEntry(true)}
                className="mt-2 text-md text-blue-600 hover:text-blue-800 underline"
              >
                Enter address manually
              </button>
            </div>
          )}

          {showManualEntry && (
            <>
              <div>
                <label htmlFor="addressLine1" className="block text-gray-700 mb-2">
                  Building name or number
                </label>
                <Input 
                  id="addressLine1"
                  className="h-14 rounded-xl border-gray-300"
                  style={{ 
                    fontSize: '1rem',
                    ...(isFieldInvalid('addressLine1', userDetails.address?.addressLine1) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  value={userDetails.address?.addressLine1 || ''} 
                  onChange={(e)=> setUserDetails({ ...userDetails, address: { ...userDetails.address, addressLine1: e.target.value } })} 
                  onBlur={() => handleBlur('addressLine1')}
                  required 
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className="block text-gray-700 mb-2">
                  Street name
                </label>
                <Input 
                  id="addressLine2"
                  className="h-14 rounded-xl border-gray-300" 
                  style={{ 
                    fontSize: '1rem',
                    ...(isFieldInvalid('addressLine2', userDetails.address?.addressLine2) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  value={userDetails.address?.addressLine2 || ''} 
                  onChange={(e)=> setUserDetails({ ...userDetails, address: { ...userDetails.address, addressLine2: e.target.value } })} 
                  onBlur={() => handleBlur('addressLine2')}
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-gray-700 mb-2">
                  City
                </label>
                <Input 
                  id="city"
                  className="h-14 rounded-xl border-gray-300"
                  style={{ 
                    fontSize: '1rem',
                    ...(isFieldInvalid('city', userDetails.address?.city) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  value={userDetails.address?.city || ''} 
                  onChange={(e)=> setUserDetails({ ...userDetails, address: { ...userDetails.address, city: e.target.value } })} 
                  onBlur={() => handleBlur('city')}
                  required 
                />
              </div>

              <div>
                <label htmlFor="postCode" className="block text-gray-700 mb-2">
                  Post code
                </label>
                <Input 
                  id="postCode"
                  className="h-14 rounded-xl border-gray-300"
                  style={{ 
                    fontSize: '1rem',
                    ...(isFieldInvalid('postCode', userDetails.address?.postCode) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  value={userDetails.address?.postCode || ''} 
                  onChange={(e)=> setUserDetails({ ...userDetails, address: { ...userDetails.address, postCode: e.target.value } })} 
                  onBlur={() => handleBlur('postCode')}
                  required 
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-gray-700 mb-2">
                  Country
                </label>
                <Input 
                  id="country"
                  className="h-14 rounded-xl border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed" 
                  style={{ fontSize: '1rem' }}
                  value={getCountryDisplayName(userDetails.address?.country || 'GB')} 
                  readOnly
                  disabled 
                />
              </div>

              <button
                type="button"
                onClick={() => setShowManualEntry(false)}
                className="text-md text-blue-600 hover:text-blue-800 underline"
              >
                Search for address instead
              </button>
            </>
          )}
        </div>
        <div className="flex justify-center mb-12">
          <StepActionButton 
            onClick={() => {
              const form = document.querySelector('form');
              if (form) {
                form.requestSubmit();
              }
            }} 
            type="submit"
            disabled={!isFormValid()}
            isLoading={isLoading} 
            loadingText="Processing..." 
            actionText="Continue"
          />
        </div>
      </form>
      
      <FSCSDisclaimer />
    </div>
  );
} 