"use client";

import { useState } from "react";
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
      {
        label: "Pengelolaan Asset",
        href: "/dashboard/pengelolaanaset",
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
        href: "/dashboard/requestbarangmasuk",
      },
      {
        label: "Pengecekan Asset Masuk",
        href: "/dashboard/pengecekanbarangmasuk",
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
        label: "Request Inbound",
        href: "/dashboard/requestinbound",
      },
      {
        label: "Request Outbound",
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
    ],
  },
];


const Menu = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="text-sm">
      <div className="flex lg:hidden items-center mb-4 justify-center mr-2">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-500 focus:outline-none">
          <IoMenu className="w-6 h-6" />
        </button>
      </div>

      {/* {isMobileMenuOpen && (
        <div className="fixed bg-gray-800 rounded-lg bg-opacity-95 text-white z-50 flex flex-col items-center justify-center p-10 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-white focus:outline-none">
            <IoClose className="w-8 h-8" />
          </button>
          <div className="flex flex-col gap-6 text-lg">
            {menuDashboards.map((menu) => (
              <Link
                href={menu.href}
                key={menu.title}
                className="hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {menu.title}
              </Link>
            ))}
          </div>
        </div>
      )} */}
      
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:block bg-white lg:bg-transparent`}>
        {menuDashboards.map((menu) => (
          <div className="flex flex-col gap-2 bg-[#171F39]" key={menu.title}>
            <div
              className="flex justify-between items-center"
              onClick={() => handleMenuClick(menu.title)}
            >
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer font-sans font-bold">
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
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-200 text-white font-light py-4 font-sans "
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
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer font-sans font-bold">
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
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-200 text-white font-light py-4 font-sans "
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
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer font-sans font-bold">
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
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-200 text-white font-light py-4 font-sans "
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
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer font-sans font-bold">
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
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-200 text-white font-light py-4 font-sans "
                  >
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {menuInput.map((menu) => (
          <div className="flex flex-col gap-2 bg-[#171F39]" key={menu.title}>
            <div
              className="flex justify-between items-center"
              onClick={() => handleMenuClick(menu.title)}
            >
              <span className="hidden lg:block text-white my-4 mx-4 cursor-pointer font-sans font-bold">
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
                    className="flex items-center justify-center lg:justify-start hover:bg-gray-200 text-white font-light py-4 font-sans "
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
