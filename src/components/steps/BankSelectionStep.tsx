import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle, Search, ChevronDown } from "lucide-react";
import { StepActionButton } from "@/components/StepActionButton";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/types/workflow";
import { PaymentInstitution } from "@/types/types";
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';

interface BankSelectionStepProps extends StepProps {
  bankInstitutions: PaymentInstitution[];
  setSelectedBank: (bank: PaymentInstitution) => void;
}

export function BankSelectionStep({
  isLoading,
  onAction,
  bankInstitutions,
  setSelectedBank,
}: BankSelectionStepProps) {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter banks based on search term
  const filteredBanks = bankInstitutions.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the banks to display based on visible count
  const displayedBanks = filteredBanks.slice(0, visibleCount);
  const hasMoreBanks = filteredBanks.length > visibleCount;

  useEffect(() => {
    setSelectedBankId(null);
    setVisibleCount(6); // Reset visible count when searching
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-left">Connect your bank account</h1>
        <p className="text-lg text-gray-600 text-left">
          Choose your bank from the list of supported providers
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for your bank"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 w-full h-14 text-base rounded-xl border-gray-300"
          />
        </div>

        {/* Bank List */}
        <div className="space-y-3 mb-8">
          {filteredBanks.length > 0 ? (
            <>
              {displayedBanks.map((bank) => (
                <div
                  key={bank.id}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
                    selectedBankId === bank.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedBankId(bank.id);
                    setSelectedBank(bank);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-14 h-14 mr-4 relative bg-white rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {bank.media && bank.media.length > 0 ? (
                          <Image
                            src={bank.media.find(m => m.type === "icon")?.source || bank.media[0].source}
                            alt={`${bank.name} logo`}
                            className="object-contain"
                            width={40}
                            height={40}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-sm font-medium">
                          {bank.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900">
                          {bank.name}
                        </div>
                      </div>
                    </div>
                    {selectedBankId === bank.id && (
                      <div className="text-blue-600 ml-4">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              {hasMoreBanks && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                  >
                    <span>Show more banks</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base">No banks found matching &quot;{searchTerm}&quot;</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Select Button */}
        <div className="flex justify-center mb-12">
          <StepActionButton
            onClick={onAction}
            disabled={!selectedBankId}
            isLoading={isLoading}
            loadingText="Confirming Selection..."
            actionText="Select bank"
          />
        </div>
        
        {/* FSCS Protection Notice */}
        <FSCSDisclaimer />
      </div>
    </div>
  );
}
