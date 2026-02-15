"use client";
import { useState } from "react";
import Sidebar from "@/components/core/Sidebar";
import Header from "@/components/core/Header";
import SidebarItem from "@/components/core/SidebarItem";
import Footer from "@/components/core/Footer";
import {
  LayoutDashboard,
  Files,
  ChartLine,
  GraduationCap,
  CircleUserRound,
  KeyRound,
} from "lucide-react";

interface KadepLayoutProps {
  children: React.ReactNode;
}

export default function KadepLayout({ children }: KadepLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <main className="flex h-screen">
      <Sidebar
        title="SIPPAK PENS"
        user={null}
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileClose}
      >
        <p className="pl-1 text-gray-400 text-xs font-thin">Menu</p>

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          url="/kadep/dashboard"
        />
        <p className="pl-1 text-gray-400 text-xs font-thin">Kelola</p>
        <SidebarItem
          icon={<GraduationCap size={20} />}
          text="Program Studi"
          url="/admin/major"
        />
        <SidebarItem
          icon={<ChartLine size={20} />}
          text="Input Prediksi"
          url="/admin/lecturer"
        />

        <SidebarItem
          icon={<Files size={20} />}
          text="Hasil Prediksi"
          url="/admin/proposal"
        />
        <p className="pl-1 text-gray-400 text-xs font-thin">Setting</p>
        <SidebarItem
          icon={<CircleUserRound size={20} />}
          text="Profil Saya"
          url="/admin/profile"
        />
        <SidebarItem
          icon={<KeyRound size={20} />}
          text="Ganti Password"
          url="/admin/profile/change-password"
        />
      </Sidebar>

      <div className="flex-1 flex flex-col h-screen md:ml-0">
        <Header user={null} onMenuClick={handleMenuClick} />
        <div className="flex-1 overflow-y-auto bg-backgroundDash p-4">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  );
}
