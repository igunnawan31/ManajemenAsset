"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Search from "./Search";
import FilterDropdown from "@/app/(user)/usercomponent/Filter";

interface Asset {
  no: string;
  assetId: string;
  assetName: string;
  assetType: string;
  assetStock: string;
  assetLocation: string;
  assetStatusPengelolaan: string;
}

interface AssetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assets: Asset[]) => void; // New confirm function
  assets: Asset[];
}

const AssetSelector: React.FC<AssetSelectorProps> = ({ isOpen, onClose, onConfirm, assets }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [tempSelectedAssets, setTempSelectedAssets] = useState<Asset[]>([]);

  // Handle search input change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter selection
  const handleFilterSelect = (type: string, value: string | null) => {
    setSelectedFilter(value);
  };

  // Add asset to temporary selection
  const handleSelectAsset = (asset: Asset) => {
    if (!tempSelectedAssets.some((a) => a.assetId === asset.assetId)) {
      setTempSelectedAssets([...tempSelectedAssets, asset]);
    }
  };

  // Remove asset from temporary selection
  const handleRemoveAsset = (assetId: string) => {
    setTempSelectedAssets(tempSelectedAssets.filter((asset) => asset.assetId !== assetId));
  };

  // Confirm selection and close the popup
  const handleConfirm = () => {
    onConfirm(tempSelectedAssets);
    onClose();
  };

  // Filter available assets (exclude those in tempSelectedAssets)
  const filteredAssets = assets.filter(
    (asset) =>
      !tempSelectedAssets.some((selected) => selected.assetId === asset.assetId) &&
      asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedFilter ? asset.assetType === selectedFilter : true)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Assets</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {tempSelectedAssets.length > 0 && (
          <div className="mb-4 border p-3 rounded-lg bg-gray-50">
            <h3 className="text-sm font-semibold mb-2">Selected Assets</h3>
            <div className="grid gap-2 max-h-32 overflow-y-auto">
              {tempSelectedAssets.map((asset) => (
                <div key={asset.assetId} className="flex justify-between items-center p-2 bg-white border rounded-lg">
                  <span className="text-sm">{asset.assetName}</span>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => handleRemoveAsset(asset.assetId)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 justify-between">
            <div className="w-full">
                <Search placeholder="Search asset..." onSearch={handleSearch}  />
            </div>
            <FilterDropdown
                filters={[
                    {
                        type: "assetType",
                        label: "Asset Type",
                        options: [
                        { label: "All", value: "" },
                        { label: "Elektronik", value: "Elektronik" },
                        { label: "Barang", value: "Barang" },
                        ],
                    },
                ]}
                onSelect={handleFilterSelect}
            />
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <div key={asset.assetId} className="p-3 border rounded-lg flex justify-between hover:bg-gray-100">
                <div>
                  <h3 className="font-semibold">{asset.assetName}</h3>
                  <p className="text-sm text-gray-500">{asset.assetType}</p>
                </div>
                <button
                  className="bg-[#20458A] text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                  onClick={() => handleSelectAsset(asset)}
                >
                  Select
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No assets available.</p>
          )}
        </div>

        <button
        className="w-full mt-4 bg-[#20458A] text-white py-2 rounded-lg hover:opacity-90"
        onClick={handleConfirm}
        >
        Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default AssetSelector;
