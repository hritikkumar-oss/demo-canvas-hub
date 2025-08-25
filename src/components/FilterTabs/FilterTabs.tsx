import { Button } from "@/components/ui/button";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: { id: string; label: string; count?: number }[];
}

const FilterTabs = ({ activeFilter, onFilterChange, filters }: FilterTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className="transition-all duration-200"
        >
          {filter.label}
          {filter.count && (
            <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
              {filter.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default FilterTabs;