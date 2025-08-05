import { StepActionButton } from '@/components/StepActionButton';
import { StepProps } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { CreateUserRequest } from '@/types/apiModel';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, formatISO, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';

interface PersonalDetailsStepProps extends StepProps {
  userDetails: CreateUserRequest;
  setUserDetails: (userDetails: CreateUserRequest) => void;
}

export function PersonalDetailsStep({ isLoading, onAction, userDetails, setUserDetails }: PersonalDetailsStepProps) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [dobOpen, setDobOpen] = useState(false);

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const isFieldInvalid = (fieldName: string, value: string | undefined) => {
    return touchedFields[fieldName] && (!value || value.trim() === '');
  };
  
  // Helper to parse date string for Calendar component
  const parsedDob = userDetails.dob ? parseISO(userDetails.dob) : undefined;

  const isFormValid = () => {
    return !!(
      userDetails.firstName?.trim() &&
      userDetails.lastName?.trim() &&
      userDetails.email?.trim() &&
      userDetails.phoneNumber?.trim() &&
      userDetails.dob
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onAction();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80 rounded-lg">
      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold mb-2">Tell us about yourself</h1>
        <p className="text-lg text-gray-600">We need these details to open your Pot</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-12">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 mb-2">
              First name
            </label>
            <Input 
              id="firstName"
              className="h-14 rounded-xl border-gray-300"
              style={{ 
                fontSize: '1rem',
                ...(isFieldInvalid('firstName', userDetails.firstName) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
              }}
              value={userDetails.firstName || ''} 
              onChange={(e)=> setUserDetails({...userDetails, firstName: e.target.value})} 
              onBlur={() => handleBlur('firstName')}
              required 
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-gray-700 mb-2">
              Surname
            </label>
            <Input 
              id="lastName"
              className="h-14 rounded-xl border-gray-300"
              style={{ 
                fontSize: '1rem',
                ...(isFieldInvalid('lastName', userDetails.lastName) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
              }}
              value={userDetails.lastName || ''} 
              onChange={(e)=> setUserDetails({...userDetails, lastName: e.target.value})} 
              onBlur={() => handleBlur('lastName')}
              required 
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <Input 
              id="email"
              type="email" 
              className="h-14 rounded-xl border-gray-300"
              style={{ 
                fontSize: '1rem',
                ...(isFieldInvalid('email', userDetails.email) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
              }}
              value={userDetails.email || ''} 
              onChange={(e)=> setUserDetails({...userDetails, email: e.target.value})} 
              onBlur={() => handleBlur('email')}
              required 
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
              Phone Number
            </label>
            <Input 
              id="phoneNumber"
              className="h-14 rounded-xl border-gray-300"
              style={{ 
                fontSize: '1rem',
                ...(isFieldInvalid('phoneNumber', userDetails.phoneNumber) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
              }}
              value={userDetails.phoneNumber || ''} 
              onChange={(e)=> setUserDetails({...userDetails, phoneNumber: e.target.value})} 
              onBlur={() => handleBlur('phoneNumber')}
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Date of birth
            </label>
              <Popover open={dobOpen} onOpenChange={setDobOpen}>
                <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-base h-14 rounded-xl border-gray-300 hover:bg-gray-50",
                  !userDetails.dob && "text-muted-foreground"
                )}
                style={{
                  ...(isFieldInvalid('dob', userDetails.dob) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                }}
                onBlur={() => handleBlur('dob')}
              >
                {parsedDob ? format(parsedDob, 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-white border-gray-200 shadow-lg min-w-[280px]">
                  <Calendar
                    mode="single"
                    selected={parsedDob}
                    defaultMonth={parsedDob || new Date()}
                    captionLayout='dropdown'
                    modifiers={{
                      selected: parsedDob
                    }}
                    modifiersClassNames={{
                      selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                    }}
                    onSelect={(date) => {
                      if (date) {
                        // Convert to date-only format (yyyy-MM-dd)
                        setUserDetails({...userDetails, dob: formatISO(date, { representation: 'date' })});
                        setDobOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
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