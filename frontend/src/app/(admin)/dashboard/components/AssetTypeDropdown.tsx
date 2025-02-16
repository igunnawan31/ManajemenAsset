import { Listbox } from "@headlessui/react";
import { useState } from "react";
import { FieldErrors } from "react-hook-form";

const assetTypes = [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Real Estate",
    "Office Equipment",
];

interface AssetTypeDropdownProps {
    setValue: (name: string, value: string, options?: any) => void;
    errors: FieldErrors<{ assetType: string }>;
}

const AssetTypeDropdown = ({ setValue, errors }: AssetTypeDropdownProps) => {
    const [selected, setSelected] = useState<string>("");

    const handleSelectChange = (value: string) => {
        setSelected(value);
        setValue("assetType", value, { shouldValidate: true });  // Ensure it updates the form state and triggers validation
    };

    return (
        <div className="relative">
            <Listbox value={selected} onChange={handleSelectChange}>
                <div className="relative mt-1">
                    <Listbox.Button
                        className="relative w-full cursor-pointer rounded-md bg-white p-3 border border-[#202BA5] text-left text-gray-700 focus:ring-2 focus:ring-[#202BA5] focus:outline-none"
                    >
                        {selected || "Select asset type"}
                        <span className="absolute inset-y-0 right-3 flex items-center">▼</span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        {assetTypes.map((type, index) => (
                            <Listbox.Option key={index} value={type}>
                                {({ active }) => (
                                    <div
                                        className={`cursor-pointer p-3 ${
                                            active ? "bg-[#202BA5] text-white" : "text-gray-900"
                                        }`}
                                    >
                                        {type}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
            {errors.assetType?.message && (
                <p className="text-red-500 text-xs mt-2">{String(errors.assetType.message)}</p>
            )}
        </div>
    );
};

export default AssetTypeDropdown;
