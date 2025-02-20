"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
