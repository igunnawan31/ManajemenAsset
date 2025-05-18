"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import { IoCaretForward } from "react-icons/io5";
import { IoCaretForward, IoCaretDown, IoMenu, IoClose } from "react-icons/io5";

const menuDashboards = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Asset Dashboard",
        href: "/dashboard/assetdashboard",
      },
    ],
  },
];

const menuInbound = [
  {
    title: "Inbound Main Menu",
    items: [
      {
        label: "Request Asset Masuk",
        href: "/dashboard/requestassetmasuk",
      },
      {
        label: "Pengecekan Asset Masuk",
        href: "/dashboard/pengecekanassetmasuk",
      },
    ],
  },
];

const menuOutbound = [
  {
    title: "Outbound Main Menu",
    items: [
      {
        label: "Request Asset Keluar",
        href: "/dashboard/requestassetkeluar",
      },
      {
        label: "Pengecekan Asset Keluar",
        href: "/dashboard/pengecekanassetkeluar",
      },
    ],
  },
];

const menuRequest = [
  {
    title: "Request Main Menu",
    items: [
      {
        label: "New Request Inbound",
        href: "/dashboard/requestinbound",
      },
      {
        label: "New Request Outbound",
        href: "/dashboard/requestoutbound",
      },
    ],
  },
];

const menuInput = [
  {
    title: "Management",
    items: [
      {
        label: "User Management",
        href: "/dashboard/usermanagement",
      },
      {
        label: "Branch Management",
        href: "/dashboard/branchmanagement",
      },
      {
        label: "New Asset Management",
        href: "/dashboard/newassetmanagement",
      },
    ],
  },
];

type UserResponseDTO = {
  userId: string;
  userName: string;
  userEmail: string;
  userBranch: string;
  userPhone: string;
  userRole: string;
  userSubRole: string;
};

interface Branch {
  branchId: string;
  branchName: string;
}


const Menu = () => {
  const [users, setUser] = useState<UserResponseDTO | null>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasParentId, setHasParentId] = useState<boolean | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndBranchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("No user ID found. Please log in.");
          setLoading(false);
          return;
        }

        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/by-id/${userId}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUser(userData);

        if (userData.userBranch) {
          const branchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/by-id/${userData.userBranch}`);
          if (!branchResponse.ok) throw new Error("Failed to fetch branch data");
          
          const branchData = await branchResponse.json();
          setHasParentId(branchData.parentId !== null && branchData.parentId !== undefined);
        }

        const branchesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`);
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          setBranches(branchesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setHasParentId(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBranchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleMenuClick = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuItemClick = () => {
    closeMobileMenu();
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="text-sm poppins">
      <div className="flex lg:hidden items-center mb-4 justify-center mr-2">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-gray-500 focus:outline-none"
        >
          {isMobileMenuOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-[4.5rem] left-0 h-[calc(100vh-4.5rem)] w-3/4 bg-gray-800 z-50 flex flex-col p-6 lg:hidden overflow-y-auto transition-all duration-500 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex flex-col gap-6 text-lg mt-4">
          {menuDashboards.map((menu) => (
            <div key={menu.title}>
              <div
                className="flex justify-between items-center cursor-pointer text-white font-bold"
                onClick={() => handleMenuClick(menu.title)}
              >
                <span>{menu.title}</span>
                <IoCaretForward
                  className={`transition-transform duration-300 ${
                    openMenus[menu.title] ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
              {openMenus[menu.title] && (
                <div className="ml-4 flex flex-col gap-2 mt-3">
                  {menu.items
                    .filter((item) => {
                      if (item.label === "Asset Dashboard" && hasParentId === false) {
                        return false;
                      }
                      return true;
                    })
                    .map((item) => (
                      <Link
                        href={item.href}
                        key={item.label}
                        className="text-white hover:bg-gray-700 p-2 rounded transition-colors duration-200"
                        onClick={handleMenuItemClick}
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}
          {menuInbound.map((menu) => (
            <div key={menu.title}>
              <div
                className="flex justify-between items-center cursor-pointer text-white font-bold"
                onClick={() => handleMenuClick(menu.title)}
              >
                <span>{menu.title}</span>
                <IoCaretForward
                  className={`transition-transform duration-300 ${
                    openMenus[menu.title] ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
              {openMenus[menu.title] && (
                <div className="ml-4 flex flex-col gap-2 mt-3">
                  {menu.items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="text-white hover:bg-gray-700 p-2 rounded transition-colors duration-200"
                      onClick={handleMenuItemClick}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {menuOutbound.map((menu) => (
            <div key={menu.title}>
              <div
                className="flex justify-between items-center cursor-pointer text-white font-bold"
                onClick={() => handleMenuClick(menu.title)}
              >
                <span>{menu.title}</span>
                <IoCaretForward
                  className={`transition-transform duration-300 ${
                    openMenus[menu.title] ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
              {openMenus[menu.title] && (
                <div className="ml-4 flex flex-col gap-2 mt-5">
                  {menu.items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="text-white hover:bg-gray-700 p-2 rounded"
                      onClick={handleMenuItemClick}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {menuRequest.map((menu) => (
            <div key={menu.title}>
              <div
                className="flex justify-between items-center cursor-pointer text-white font-bold"
                onClick={() => handleMenuClick(menu.title)}
              >
                <span>{menu.title}</span>
                <IoCaretForward
                  className={`transition-transform duration-300 ${
                    openMenus[menu.title] ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
              {openMenus[menu.title] && (
                <div className="ml-4 flex flex-col gap-2 mt-5">
                  {menu.items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="text-white hover:bg-gray-700 p-2 rounded"
                      onClick={handleMenuItemClick}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {hasParentId === false && menuInput.map((menu) => (
            <div key={menu.title}>
              <div
                className="flex justify-between items-center cursor-pointer text-white font-bold"
                onClick={() => handleMenuClick(menu.title)}
              >
                <span>{menu.title}</span>
                <IoCaretForward
                  className={`transition-transform duration-300 ${
                    openMenus[menu.title] ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
              {openMenus[menu.title] && (
                <div className="ml-4 flex flex-col gap-2 mt-5">
                  {menu.items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="text-white hover:bg-gray-700 p-2 rounded"
                      onClick={handleMenuItemClick}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:block bg-white lg:bg-transparent`}>
        {menuDashboards.map((menu) => (
          <div className="flex flex-col gap-2 bg-[#171F39]" key={menu.title}>
            <div
              className="flex justify-between items-center"
              onClick={() => handleMenuClick(menu.title)}
            >
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer poppins font-bold">
                {menu.title}
              </span>
              <span
                className={`transition-transform duration-300 cursor-pointer ${
                  openMenus[menu.title] ? "rotate-90" : "rotate-0"
                }`}
              >
                <IoCaretForward className="w-3 h-3 text-white mx-4" />
              </span>
            </div>

            {openMenus[menu.title] && (
              <div className="flex flex-col gap-2 mx-4">
                {menu.items
                  .filter((item) => {
                    if (item.label === "Asset Dashboard" && hasParentId === false) return false;
                    return true;
                  })
                  .map((item) => (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="flex items-center justify-center lg:justify-start hover:bg-gray-700 p-2 rounded text-white font-light py-4 poppins"
                    >
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        ))}
        {menuInbound.map((menu) => (
          <div className="flex flex-col gap-2 bg-[#171F39]" key={menu.title}>
            <div
              className="flex justify-between items-center"
              onClick={() => handleMenuClick(menu.title)}
            >
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer poppins font-bold">
                {menu.title}
              </span>
              <span
                className={`transition-transform duration-300 cursor-pointer ${
                  openMenus[menu.title] ? "rotate-90" : "rotate-0"
                }`}
              >
                <IoCaretForward className="w-3 h-3 text-white mx-4" />
              </span>
            </div>
            {openMenus[menu.title] && (
              <div className="flex flex-col gap-2 mx-4">
                {menu.items.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-700 p-2 rounded text-white font-light py-4 poppins"
                  >
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {menuOutbound.map((menu) => (
          <div className="flex flex-col gap-2 bg-[#171F39]" key={menu.title}>
            <div
              className="flex justify-between items-center"
              onClick={() => handleMenuClick(menu.title)}
            >
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer poppins font-bold">
                {menu.title}
              </span>
              <span
                className={`transition-transform duration-300 cursor-pointer ${
                  openMenus[menu.title] ? "rotate-90" : "rotate-0"
                }`}
              >
                <IoCaretForward className="w-3 h-3 text-white mx-4" />
              </span>
            </div>
            {openMenus[menu.title] && (
              <div className="flex flex-col gap-2 mx-4">
                {menu.items.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-700 p-2 rounded text-white font-light py-4 poppins"
                  >
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {menuRequest.map((menu) => (
          <div className="flex flex-col gap-2 bg-[#171F39]" key={menu.title}>
            <div
              className="flex justify-between items-center"
              onClick={() => handleMenuClick(menu.title)}
            >
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer poppins font-bold">
                {menu.title}
              </span>
              <span
                className={`transition-transform duration-300 cursor-pointer ${
                  openMenus[menu.title] ? "rotate-90" : "rotate-0"
                }`}
              >
                <IoCaretForward className="w-3 h-3 text-white mx-4" />
              </span>
            </div>
            {openMenus[menu.title] && (
              <div className="flex flex-col gap-2 mx-4">
                {menu.items.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-700 p-2 rounded text-white font-light py-4 poppins"
                  >
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {hasParentId === false && menuInput.map((menu) => (
          <div className="flex flex-col gap-2 bg-[#171F39]" key={menu.title}>
            <div
              className="flex justify-between items-center"
              onClick={() => handleMenuClick(menu.title)}
            >
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer poppins font-bold">
                {menu.title}
              </span>
              <span
                className={`transition-transform duration-300 cursor-pointer ${
                  openMenus[menu.title] ? "rotate-90" : "rotate-0"
                }`}
              >
                <IoCaretForward className="w-3 h-3 text-white mx-4" />
              </span>
            </div>
            {openMenus[menu.title] && (
              <div className="flex flex-col gap-2 mx-4 mb-10">
                {menu.items.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-700 p-2 rounded text-white font-light py-4 poppins"
                  >
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default Menu;
