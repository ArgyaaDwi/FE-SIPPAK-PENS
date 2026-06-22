"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/core/Sidebar";
import Header from "@/components/core/Header";
import SidebarItem from "@/components/core/SidebarItem";
import Footer from "@/components/core/Footer";
import { getClientSession } from "@/lib/auth/clientSession";
import {
  LayoutDashboard,
  ChartLine,
  CircleUserRound,
  Users,
} from "lucide-react";

interface DosenWaliLayoutProps {
  children: React.ReactNode;
}

interface LayoutUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export default function DosenWaliLayout({ children }: DosenWaliLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<LayoutUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const session = await getClientSession();

      if (!isMounted || !session) {
        return;
      }

      setUser({
        id: String(session.user_id),
        name: session.nama,
        email: session.email,
        avatarUrl: "/assets/images/user_img.png",
        role: String(session.role),
      });
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

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
        user={user}
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileClose}
      >
        <p className="pl-1 text-gray-400 text-xs font-thin">Menu</p>

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          url="/dosen-wali/dashboard"
        />
        <p className="pl-1 text-gray-400 text-xs font-thin">Kelola</p>
        <SidebarItem
          icon={<Users size={20} />}
          text="Data Mahasiswa"
          url="/dosen-wali/mahasiswa"
        />
        <SidebarItem
          icon={<ChartLine size={20} />}
          text="Buat Prediksi"
          url="/dosen-wali/predict"
        />
        <p className="pl-1 text-gray-400 text-xs font-thin">Setting</p>
        <SidebarItem
          icon={<CircleUserRound size={20} />}
          text="Profil Saya"
          url="/dosen-wali/profile"
        />
      </Sidebar>
      <div className="flex-1 flex flex-col h-screen md:ml-0">
        <Header user={user} onMenuClick={handleMenuClick} />
        <div className="flex-1 overflow-y-auto bg-backgroundDash p-4">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  );
}
