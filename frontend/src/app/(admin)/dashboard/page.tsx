"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
        </div>
    );
};

export default Dashboard;
