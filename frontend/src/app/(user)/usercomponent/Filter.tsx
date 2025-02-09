import { useState } from "react";

type FilterCategory = {
    type: string;
    label: string;
    options: { label: string; value: string }[];
};

type FilterDropdownProps = {
    filters: FilterCategory[];
    onSelect: (type: string, value: string | null) => void;
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filters, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});

    const handleSelect = (type: string, value: string | null) => {
        setSelectedFilters((prev) => ({ ...prev, [type]: value }));
        onSelect(type, value);
        setIsOpen(false);
    };

    const selectedText = Object.entries(selectedFilters)
        .filter(([_, value]) => value)
        .map(([type, value]) => {
            const filter = filters.find((f) => f.type === type);
            const option = filter?.options.find((opt) => opt.value === value);
            return option?.label;
        })
        .filter(Boolean)
        .join(", ") || "Filter";

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-36 h-14 px-4 py-2 border rounded-lg bg-[#20458A] shadow-md text-sm text-gray-700"
            >
                <span className="truncate text-white poppins_ae14c56d-module__NZbT2q__className">{selectedText}</span>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-2 z-10">
                    {filters.map((filter) => (
                        <div key={filter.type} className="mb-2">
                            <span className="text-xs font-semibold text-gray-500">{filter.label}</span>
                            {filter.options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(filter.type, option.value)}
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                        selectedFilters[filter.type] === option.value ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
