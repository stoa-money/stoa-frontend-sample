import { StepActionButton } from '@/components/StepActionButton';
import { StepProps } from '@/types/workflow';
import { CreateUserRequest } from '@/types/apiModel';
import { useStaticDataApi } from '@/hooks/apis/useStaticDataApi';
import { useEffect, useState } from 'react';
import { EmploymentStatus, Industry, Occupation, SourceOfFunds } from '@/types/types';
import { Input } from '../ui/input';
import { AlertTriangle, Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, formatCurrency } from '@/lib/utils';
import { getCountryDisplayName } from '@/types/countries';
import { useAuth } from '@clerk/nextjs';
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';

interface FinancialDetailsStepProps extends StepProps {
  userDetails: CreateUserRequest;
  setUserDetails: (details: CreateUserRequest) => void;
}

export function FinancialDetailsStep({ isLoading, onAction, userDetails, setUserDetails }: FinancialDetailsStepProps) {
  const { getEmploymentStatuses, getIndustries, getOccupations, getSourceOfFunds, isLoading: isDataLoading } = useStaticDataApi();
  const { getToken } = useAuth();
  const [employmentStatuses, setEmploymentStatuses] = useState<EmploymentStatus[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [sourceOfFunds, setSourceOfFunds] = useState<SourceOfFunds[]>([]);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [annualIncomeDisplay, setAnnualIncomeDisplay] = useState<string>('');
  
  // State for managing popover open/close states
  const [employmentStatusOpen, setEmploymentStatusOpen] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [occupationOpen, setOccupationOpen] = useState(false);
  const [sourceOfFundsOpen, setSourceOfFundsOpen] = useState(false);

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const isFieldInvalid = (fieldName: string, value: string | undefined) => {
    const invalid = touchedFields[fieldName] && (!value || value.trim() === '');
    if (fieldName === 'annualIncome') {
      return touchedFields[fieldName] && (!userDetails.annualIncome || userDetails.annualIncome === 0);
    }
    if (fieldName === 'sourceOfFunds') {
      return touchedFields[fieldName] && (!userDetails.sourceOfFunds || userDetails.sourceOfFunds.length === 0);
    }
    return invalid;
  };

  const isFormValid = () => {
    return !!(
      userDetails.annualIncome && userDetails.annualIncome > 0 &&
      userDetails.taxId?.trim() &&
      userDetails.employmentStatus?.trim() &&
      userDetails.industry?.trim() &&
      userDetails.occupation?.trim() &&
      userDetails.sourceOfFunds && userDetails.sourceOfFunds.length > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onAction();
    }
  };

  // Set default values for nationality and tax residency if not already set
  useEffect(() => {
    if (!userDetails.nationality || !userDetails.taxResidency) {
      setUserDetails({
        ...userDetails,
        nationality: userDetails.nationality || 'GB',
        taxResidency: userDetails.taxResidency || 'GB'
      });
    }
    // Initialize annual income display
    if (userDetails.annualIncome) {
      setAnnualIncomeDisplay(formatCurrency(userDetails.annualIncome, false, false));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken({ template: 'stoa-core-api-apim' });
      if (!token) return;
      setEmploymentStatuses(await getEmploymentStatuses(token));
      setIndustries(await getIndustries(token));
      setSourceOfFunds(await getSourceOfFunds(token));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userDetails.industry) {
      const fetchOccupations = async () => {
        const industry = industries.find(i => i.value === userDetails.industry);
        if (industry) {
          const token = await getToken({ template: 'stoa-core-api-apim' });
          if (!token) return;
          setOccupations(await getOccupations(industry.id, token));
        }
      };
      fetchOccupations();
    } else {
      setOccupations([]);
    }
  }, [userDetails.industry, industries]);



  const getSelectedEmploymentStatusLabel = () => {
    const selectedStatus = employmentStatuses.find(status => status.value === userDetails.employmentStatus);
    return selectedStatus ? selectedStatus.displayName : 'Select Employment Status';
  };

  const getSelectedIndustryLabel = () => {
    const selectedIndustry = industries.find(industry => industry.value === userDetails.industry);
    return selectedIndustry ? selectedIndustry.displayName : 'Select Industry';
  };

  const getSelectedOccupationLabel = () => {
    const selectedOccupation = occupations.find(occupation => occupation.value === userDetails.occupation);
    return selectedOccupation ? selectedOccupation.displayName : 'Select Occupation';
  };

  const getSelectedSourceOfFundsLabel = () => {
    const selectedSources = userDetails.sourceOfFunds || [];
    if (selectedSources.length === 0) {
      return 'Select Source of Funds';
    } else {
      const selectedNames = selectedSources
        .map(value => sourceOfFunds.find(s => s.value === value)?.displayName)
        .filter(Boolean)
        .join(', ');      
      return selectedNames || 'Select Source of Funds';
    }
  };

  const handleAnnualIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setAnnualIncomeDisplay('');
      setUserDetails({ ...userDetails, annualIncome: 0 });
      return;
    }
    const numValue = parseInt(value, 10);
    setAnnualIncomeDisplay(numValue.toLocaleString());
    setUserDetails({ ...userDetails, annualIncome: numValue });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold mb-2">Your finance details</h1>
        <p className="text-lg text-gray-600">We need these details to open your Pot</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-12">
          <div>
            <label htmlFor="nationality" className="block text-gray-700 mb-2">
              Nationality
            </label>
            <Input 
              id="nationality"
              value={getCountryDisplayName(userDetails.nationality || 'GB')}
              readOnly
              className="h-14 rounded-xl border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
              style={{ fontSize: '1rem' }}
            />
          </div>

          <div>
            <label htmlFor="taxResidency" className="block text-gray-700 mb-2">
              Tax Residency
            </label>
            <Input 
              id="taxResidency"
              value={getCountryDisplayName(userDetails.taxResidency || 'GB')}
              readOnly
              className="h-14 rounded-xl border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
              style={{ fontSize: '1rem' }}
            />
          </div>

          <div>
            <label htmlFor="taxId" className="block text-gray-700 mb-2">
              National Insurance Number
            </label>
            <Input 
              id="taxId"
              value={userDetails.taxId || ''} 
              onChange={(e) => setUserDetails({ ...userDetails, taxId: e.target.value })} 
              onBlur={() => handleBlur('taxId')}
              className="h-14 rounded-xl border-gray-300"
              placeholder="Enter your National Insurance Number"
              required
              style={{ 
                fontSize: '1rem',
                ...(isFieldInvalid('taxId', userDetails.taxId) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
              }}
            />
          </div>

          <div>
            <label htmlFor="annualIncome" className="block text-gray-700 mb-2">
              Annual Income
            </label>
            <div className="flex gap-2">
              <div className="flex items-center h-14 px-4 rounded-xl border border-gray-300 bg-gray-50">
                <span className="text-gray-600">£</span>
              </div>
              <Input 
                id="annualIncome"
                value={annualIncomeDisplay} 
                onChange={handleAnnualIncomeChange}
                onBlur={() => handleBlur('annualIncome')}
                className="h-14 rounded-xl border-gray-300 flex-1"
                placeholder="0"
                required
                style={{ 
                  fontSize: '1rem',
                  ...(isFieldInvalid('annualIncome', userDetails.annualIncome?.toString()) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                }}
              />
            </div>
          </div>

          {/* Employment Status Command */}
          <div>
            <label className="block text-gray-700 mb-2">
              Employment status
            </label>
            <Popover open={employmentStatusOpen} onOpenChange={setEmploymentStatusOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={employmentStatusOpen}
                  className={cn(
                    "w-full justify-between text-base h-14 rounded-xl border-gray-300 hover:bg-gray-50",
                    !userDetails.employmentStatus && "text-muted-foreground"
                  )}
                  style={{
                    ...(isFieldInvalid('employmentStatus', userDetails.employmentStatus) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  disabled={isDataLoading}
                  onBlur={() => handleBlur('employmentStatus')}
                >
                  <span className="truncate text-left flex-1">
                    {getSelectedEmploymentStatusLabel()}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border-gray-200 shadow-lg">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No employment status found.</CommandEmpty>
                      <CommandGroup>
                        {employmentStatuses.map((status) => (
                          <CommandItem
                            key={status.id}
                            value={status.displayName}
                            onSelect={() => {
                              setUserDetails({ ...userDetails, employmentStatus: status.value });
                              setEmploymentStatusOpen(false);
                            }}
                          >
                            {status.displayName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
            </Popover>
          </div>

          {/* Industry Command */}
          <div>
            <label className="block text-gray-700 mb-2">
              Employment Industry
            </label>
            <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={industryOpen}
                  className={cn(
                    "w-full justify-between text-base h-14 rounded-xl border-gray-300 hover:bg-gray-50",
                    !userDetails.industry && "text-muted-foreground"
                  )}
                  style={{
                    ...(isFieldInvalid('industry', userDetails.industry) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  disabled={isDataLoading}
                  onBlur={() => handleBlur('industry')}
                >
                  <span className="truncate text-left flex-1">
                    {getSelectedIndustryLabel()}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border-gray-200 shadow-lg">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No industry found.</CommandEmpty>
                      <CommandGroup>
                        {industries.map((industry) => (
                          <CommandItem
                            key={industry.id}
                            value={industry.displayName}
                            onSelect={() => {
                              setUserDetails({ ...userDetails, industry: industry.value, occupation: '' });
                              setIndustryOpen(false);
                            }}
                          >
                            <span className="truncate max-w-[400px]">{industry.displayName}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
            </Popover>
          </div>

          {/* Occupation Command */}
          <div>
            <label className="block text-gray-700 mb-2">
              Occupation
            </label>
            <Popover open={occupationOpen} onOpenChange={setOccupationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={occupationOpen}
                  className={cn(
                    "w-full justify-between text-base h-14 rounded-xl border-gray-300 hover:bg-gray-50",
                    !userDetails.occupation && "text-muted-foreground"
                  )}
                  style={{
                    ...(isFieldInvalid('occupation', userDetails.occupation) ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  disabled={!userDetails.industry || isDataLoading || occupations.length === 0}
                  onBlur={() => handleBlur('occupation')}
                >
                  <span className="truncate text-left flex-1">
                    {getSelectedOccupationLabel()}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border-gray-200 shadow-lg">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No occupation found.</CommandEmpty>
                      <CommandGroup>
                        {occupations.map((occupation) => (
                          <CommandItem
                            key={occupation.id}
                            value={occupation.displayName}
                            onSelect={() => {
                              setUserDetails({ ...userDetails, occupation: occupation.value });
                              setOccupationOpen(false);
                            }}
                          >
                            {occupation.displayName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Source of funds</label>
            <Popover open={sourceOfFundsOpen} onOpenChange={setSourceOfFundsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={sourceOfFundsOpen}
                  className={cn(
                    "w-full justify-between text-base h-14 rounded-xl border-gray-300 hover:bg-gray-50",
                    (!userDetails.sourceOfFunds || userDetails.sourceOfFunds.length === 0) && "text-muted-foreground"
                  )}
                  style={{
                    ...(isFieldInvalid('sourceOfFunds', '') ? { borderColor: '#ef4444', outlineColor: '#ef4444' } : {})
                  }}
                  disabled={isDataLoading}
                  onBlur={() => handleBlur('sourceOfFunds')}
                >
                  <span className="truncate text-left flex-1">
                    {getSelectedSourceOfFundsLabel()}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white border-gray-200 shadow-lg">
                <Command>
                  <CommandList>
                    <CommandEmpty>No source of funds found.</CommandEmpty>
                    <CommandGroup>
                      {sourceOfFunds.map((source) => (
                                                  <CommandItem
                            key={source.id}
                            value={source.displayName}
                            onSelect={() => {
                              const currentSources = userDetails.sourceOfFunds || [];
                              let newSources;
                              if (currentSources.includes(source.value)) {
                                newSources = currentSources.filter(s => s !== source.value);
                              } else {
                                newSources = [...currentSources, source.value];
                              }
                              setUserDetails({ ...userDetails, sourceOfFunds: newSources });
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={(userDetails.sourceOfFunds || []).includes(source.value)}
                                onCheckedChange={() => {}} // Handled by onSelect
                                className="pointer-events-none"
                              />
                              {source.displayName}
                            </div>
                          </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
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
            isLoading={isLoading || isDataLoading} 
            loadingText="Creating..." 
            actionText="Create Profile"
          />
        </div>
      </form>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Eligibility Notice</p>
            <p className="mt-1">Stoa accounts are currently available exclusively to UK residents and UK taxpayers.</p>
          </div>
        </div>
      </div>
      
      <FSCSDisclaimer />
    </div>
  );
} 