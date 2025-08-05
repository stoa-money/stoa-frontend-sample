import { useState } from "react";
import { Search, Loader2, Filter, ChevronDown } from "lucide-react";
import { PotFactoryDetails, PotFactoryOffer, OfferType } from "@/types/types";
import { AvailablePotFactory } from "@/components/AvailablePotFactory";

interface AvailablePotFactoriesProps {
  potFactories: PotFactoryDetails[];
  isLoading?: boolean;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  linkPath?: string;
  emptyMessage?: string;
  className?: string;
}

export function AvailablePotFactories({ 
  potFactories, 
  isLoading = false,
  showSearch = true, 
  showCategoryFilter = true,
  title = "Available Stoa Pots",
  description = "Browse and subscribe to available Stoa Pots",
  searchPlaceholder = "Search Stoa Pots...",
  linkPath = "/pots/create",
  emptyMessage = "No Stoa Pots available at the moment.",
  className = ""
}: AvailablePotFactoriesProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categories = Array.from(new Set(potFactories.map(potFactory => potFactory.category.name))).sort();
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  const filteredPotFactories = potFactories.filter((potFactory: PotFactoryDetails) => {
    const matchesSearch = !showSearch || !searchTerm || 
      potFactory.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      potFactory.category.name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group pot factories based on the logic:
  // - If single offer with type = 3 (yearly), put under Subscriptions
  // - Otherwise, put under its category
  const potFactoriesByCategory = filteredPotFactories.reduce<Record<string, PotFactoryDetails[]>>(
    (acc: Record<string, PotFactoryDetails[]>, potFactory: PotFactoryDetails) => {
      const offers = potFactory.offers || [];
      
      // Check if it should go under Subscriptions
      if (offers.length === 1 && offers[0].type === OfferType.Yearly) {
        const cat = "Subscriptions";
        (acc[cat] = acc[cat] || []).push(potFactory);
      } else {
        // Put under its original category
        const cat = potFactory.category.name || "Other";
        (acc[cat] = acc[cat] || []).push(potFactory);
      }
      
      return acc;
    }, 
    {}
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-stoa-purple mx-auto mb-6" />
        <p className="text-slate-600 font-semibold text-lg">Loading Stoa Pots...</p>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-24">
      <h3 className="text-xl font-bold text-slate-900 mb-3">No Stoa Pots Found</h3>
      <p className="text-slate-600 font-medium">{emptyMessage}</p>
    </div>
  );

  const renderPotFactoriesContent = () => {
    if (isLoading) return renderLoadingState();
    
    if (filteredPotFactories.length === 0) {
      return searchTerm || selectedCategory !== "all" ? (
        <div className="text-center py-24">
          <h3 className="text-xl font-bold text-slate-900 mb-3">No matches found</h3>
          <p className="text-slate-600 font-medium">
            {searchTerm && selectedCategory !== "all" 
              ? `No Stoa Pots found matching "${searchTerm}" in ${selectedCategory} category.`
              : searchTerm 
                ? `No Stoa Pots found matching "${searchTerm}".`
                : `No Stoa Pots found in ${selectedCategory} category.`
            }
          </p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="mt-4 text-stoa-purple font-semibold hover:text-stoa-purple-dark transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : renderEmptyState();
    }

    // Sort categories: Subscriptions first, then alphabetically
    const sortedCategories = Object.entries(potFactoriesByCategory).sort(([a], [b]) => {
      // Subscriptions always comes first
      if (a === 'Subscriptions') return -1;
      if (b === 'Subscriptions') return 1;
      // Everything else sorted alphabetically
      return a.localeCompare(b);
    });

    return sortedCategories.map(([category, categoryPotFactories]) => {
      // Add description for each category
      const getCategoryDescription = (cat: string) => {
        switch (cat) {
          case 'Subscriptions':
            return 'We cover the full year in one go. You enjoy the perks from day one.';
          default:
            return null;
        }
      };

      return (
        <div key={category} className="mb-16 last:mb-0">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{category}</h3>
            {getCategoryDescription(category) && (
              <p className="text-gray-600">{getCategoryDescription(category)}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryPotFactories.map((potFactory) => (
              <AvailablePotFactory 
                key={potFactory.id}
                potFactory={potFactory}
              />
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Pots,</h2>
        <p className="text-xl text-gray-600">Create a Pot and let your savings unlock benefits tailored to how you live.</p>
      </div>

      {/* Filters */}
      {(showSearch || showCategoryFilter) && (
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for available pots"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white text-base"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Category Filter */}
          {showCategoryFilter && categories.length > 0 && (
            <div className="relative min-w-[250px]">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 text-base"
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    {selectedCategory !== "all" ? selectedCategory : "Filter by Category"}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedCategory(option.value);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                        selectedCategory === option.value 
                          ? 'bg-stoa-purple-light text-stoa-purple font-semibold' 
                          : 'text-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PotFactories Content */}
      {renderPotFactoriesContent()}
    </div>
  );
} 