"use client";

import Link from 'next/link';
import Upper from '../../../components/Upper';
import { useEffect, useState } from 'react';

interface Asset {
    assetId: string;
    assetName: string;
    assetType: string;
    assetValue: string;
    assetLocation: string;
    assetQrCode: string;
}

const ViewPageNewAsset = () => {
    const [asset, setAsset] = useState<Asset | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    
    useEffect(() => {
        const pathname = window.location.pathname;
        const idFromPath = pathname.split("/").pop();
        setId(idFromPath || null);
        }, []);
    
        useEffect(() => {
            if (id) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/by-assetid/${id}`)
                .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch asset details.");
                }
                return response.json();
                })
                .then((data) => {
                setAsset(data);
                setLoading(false);
                })
                .catch((error) => {
                console.error(error);
                setError("Failed to load asset details.");
                setLoading(false);
                });
            }
        }, 
    [id]);

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Create Asset Management" />
        </div>
    );
}

export default ViewPageNewAsset;