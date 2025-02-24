import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    console.log("Middleware - Cookies:", req.cookies.getAll());

    const token = req.cookies.get("jwt")?.value;
    const usersubRole = req.cookies.get("userSubRole")?.value;

    if (!token) {
        console.log("No token found, redirecting to /sign-in");
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const { pathname } = req.nextUrl;

    if (usersubRole === "Kepala_Gudang" && pathname.startsWith("/userdashboard")) {
        console.log("Redirecting Kepala_Gudang to /dashboard");
        return NextResponse.redirect(new URL("/restrictedarea", req.url));
    }

    if (usersubRole === "PIC_Gudang" && pathname.startsWith("/dashboard")) {
        console.log("Redirecting PIC_Gudang to /userdashboard");
        return NextResponse.redirect(new URL("/restrictedarea", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/userdashboard/:path*"],
};