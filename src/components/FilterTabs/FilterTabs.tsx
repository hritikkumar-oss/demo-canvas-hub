import { Button } from "@/components/ui/button";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: { id: string; label: string; count?: number }[];
}

const FilterTabs = ({ activeFilter, onFilterChange, filters }: FilterTabsProps) => {
  const handleFilterClick = (filterId: string) => {
    // Toggle behavior - if already active, deactivate it
    if (activeFilter === filterId) {
      onFilterChange('all');
    } else {
      onFilterChange(filterId);
    }
  };

  return (
    <div className="w-full">
      {/* Desktop: flex-wrap, Mobile: horizontal scroll */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory lg:flex-wrap lg:overflow-visible">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(filter.id)}
              className={`
                transition-all duration-200 snap-start flex-shrink-0 whitespace-nowrap
                ${isActive 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }
              `}
              aria-pressed={isActive}
              aria-current={isActive ? "page" : undefined}
            >
              {filter.label}
              {typeof filter.count === 'number' && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {filter.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterTabs;