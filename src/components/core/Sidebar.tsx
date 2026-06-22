"use client";
import { LogOut, X } from "lucide-react";
import { createContext, useEffect } from "react";
import Image from "next/image";
import { formatRoleLabel } from "@/lib/utils";

interface SidebarContextType {
  expanded: boolean;
}
const SidebarContext = createContext<SidebarContextType | null>(null);

interface SidebarProps {
  title: string;
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
  } | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  title,
  children,
  user,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const expanded = true;
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        onMobileClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, onMobileClose]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout gagal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-white/50  z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`h-screen w-64 transition-transform duration-300 ease-in-out fixed md:static z-50 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center mb-5">
            <div className="flex items-center">
              <Image
                src="/assets/images/pensHD.png"
                alt="Logo"
                width={56}
                height={56}
                className="w-14"
              />
              <p className="ml-3 font-bold text-lg text-primary">{title}</p>
            </div>
            <button
              onClick={onMobileClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 md:hidden"
            >
              <X color="black" size={20} />
            </button>
          </div>
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 overflow-y-auto">{children}</ul>
          </SidebarContext.Provider>
          <div className="border-t flex p-3">
            <Image
              src="/assets/images/user_img.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-md"
            />
            <div className="flex justify-between items-center w-full ml-3">
              <div className="leading-4">
                <h4 className="font-normal text-black truncate max-w-[120px]">
                  {user?.name || "Memuat..."}
                </h4>
                <p className="text-xs text-gray-500 truncate max-w-[120px] mt-1">
                  {user?.role ? formatRoleLabel(user.role) : "Guest"}
                </p>
              </div>
              <button onClick={handleLogout}>
                <LogOut size={22} color="red" />
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export { SidebarContext };
export type { SidebarContextType };
