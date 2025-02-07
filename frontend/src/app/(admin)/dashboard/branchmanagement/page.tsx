"use client";

import Upper from "../components/Upper";
import DataTable from "../components/DataTable";
import Search from "../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";


interface Branch {
    branchId: string;
    branchName: string;
    branchEmail: string;
    branchPhone: string;
    branchLocation: string;
}

const BranchManagement = () => {
    const [branches, setbranches] = useState<Branch[]>([
        { branchId: "1", branchName: "Astra Daihatsu Motor", branchEmail: "igunnawan24@gmail.com", branchPhone: "085959913761", branchLocation: "Cimone" },
        { branchId: "2", branchName: "Astra Daihatsu Mobil", branchEmail: "igunnawan25@gmail.com", branchPhone: "085959913762", branchLocation: "Perum" }
    ]);

    const [filteredbranches, setFilteredbranches] = useState<Branch[]>(branches);

    const columns = [
        { key: "branchId", label: "No", alwaysVisible: true },
        { key: "branchName", label: "Name branch", alwaysVisible: true },
        { key: "branchEmail", label: "Email branch", alwaysVisible: true },
        { key: "branchLocation", label: "Location branch" },
        { key: "branchPhone", label: "Phone branch" },
    ];

    const handleSearch = (query: string) => {
        if (!query.trim()) {
          setFilteredbranches(branches);
          return;
        }
    
        const filtered = branches.filter((branch) =>
          branch.branchName.toLowerCase().includes(query.toLowerCase()) ||
          branch.branchEmail.toLowerCase().includes(query.toLowerCase()) ||
          branch.branchPhone.toLowerCase().includes(query.toLowerCase()) ||
          branch.branchLocation.toLowerCase().includes(query.toLowerCase())
        );
    
        setFilteredbranches(filtered);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Branch Management" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New branch</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <Search
                    placeholder="Cari Email branch / Branch branch / ..."
                    onSearch={handleSearch} 
                />
            </div>
            <div className="mt-5">
                {filteredbranches.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredbranches}
                        actions={[
                            {
                                label: "View",
                                href: (row) => `/dashboard/branchmanagement/view/${row.branchId}`,
                                className: "bg-blue-600 w-20 py-2 rounded-lg hover:bg-blue-800 text-white text-sm",
                            },
                            {
                                label: "Update",
                                href: (row) => `/dashboard/branchmanagement/update/${row.branchId}`,
                                className: "bg-yellow-400 w-20 py-2 rounded-lg hover:bg-yellow-500 text-white text-sm",
                            },
                            {
                                label: "Delete",
                                onClick: (row) => console.log("Delete branch:", row.branchId),
                                className: "bg-red-600 w-20 py-2 rounded-lg hover:bg-red-700 text-white text-sm",
                            },
                        ]}
                    />  
                ) : (
                    <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                )}
            </div>
        </div>
    );
}

export default BranchManagement;