import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { dummyKelas } from "@/data/dummy/dummyKelas";
import Breadcrumb from "@/components/fragment/Breadcumb";
import {
  Users,
  ThumbsUp,
  ThumbsDown,
  School,
  ChartNoAxesColumn,
  ChartNoAxesCombined,
  GraduationCap,
} from "lucide-react";
import IPKProgressList from "../components/IPTrend";
// import LatestClasses from "../components/LatestClasses";
export default async function DashboardWaliMuridPage() {
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  const barLabels = dummyKelas.map((item) => item.kelas);
  const barData = dummyKelas.map((item) => item.jumlah);
  const doughnutLabels = [
    "Performa Tinggi",
    "Performa Sedang",
    "Performa Rendah",
  ];
  const doughnutData = [128, 74, 32];
  return (
    <div>
      <Breadcrumb
        title="Dashboard Wali Murid"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">Monitoring performa akademik anak Anda</p>
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl mt-3 p-5 md:p-6 border border-blue-400 hover:border-blue-600 transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Zefanya Atthaya Ferdinand
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <p className="text-sm md:text-base font-medium">
                NRP. 9876543219
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center shadow-xl">
                <span className="text-white font-extrabold text-xl md:text-2xl">
                  ZA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        <Card
          icon={<ChartNoAxesCombined color="gray" />}
          text="IPS Saat Ini"
          count="3.9"
          color="#63C2EB"
          isDetail={false}
          url="/"
        />
        <Card
          icon={<School color="gray" />}
          text="Semester Saat Ini"
          count="5"
          color="#81C3C7"
          isDetail={false}
          url="/"
        />
        <Card
          icon={<GraduationCap color="gray" />}
          text="Status Prediksi Performa IPK"
          count="Tinggi"
          color="#1448CD"
          isDetail={false}
          url="/"
        />
      </div>
      <p className="text-black font-semibold mt-4">Tren Perkembangan IP</p>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2">
        <CardChart
          title="Perkembangan IP Semester"
          subtitle="Perkembangan IP mahasiswa dari semester ke semester"
        >
          <IPKProgressList />
        </CardChart>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mt-3 p-4 md:p-6 border-l-4 border-blue-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Panduan Bantuan
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Hubungi Dosen Wali jika Anda memiliki pertanyaan atau keluhan
              tentang akademik anak Anda.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
            <a
              href="https://wa.me/6281226513164?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20penerbitan%20buku."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm md:text-base"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              Hubungi Dosen Wali
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
