import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { dummyProdi } from "@/data/dummy/dummyProdi";
import Breadcrumb from "@/components/fragment/Breadcumb";
import GenderPieChart from "../components/GenderPieChart";
import {
  Users,
  GraduationCap,
  ThumbsUp,
  ThumbsDown,
  ChartLine,
} from "lucide-react";
import LatestStudents from "../components/LatestStudents";
export default async function DashboardDosenWaliPage() {
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  const barLabels = dummyProdi.map((item) => item.prodi);
  const barData = dummyProdi.map((item) => item.jumlah);
  const doughnutLabels = [
    "Performa Tinggi",
    "Performa Sedang",
    "Performa Rendah",
  ];
  const doughnutData = [21, 6, 3];
  const genderData = {
    maleCount: 21,
    femaleCount: 9,
  };
  return (
    <div>
      <Breadcrumb
        title="Dashboard Dosen Wali"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">Monitoring performa akademik mahasiswa</p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
        <Card
          icon={<Users color="gray" />}
          text="Total Mahasiswa"
          count="30"
          color="#63C2EB"
          url="/admin/lecturer"
        />
        <Card
          icon={<ThumbsUp color="gray" />}
          text="Total Performa Tinggi"
          count="21"
          color="#7EF350"
          url="/admin/proposal"
        />
        <Card
          icon={<ChartLine color="gray" />}
          text="Total Performa Sedang"
          count="6"
          color="#F3C129"
          url="/admin/proposal"
        />
        <Card
          icon={<ThumbsDown color="gray" />}
          text="Total Performa Rendah"
          count="3"
          color="#f34842"
          url="/admin/proposal"
        />
      </div>
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Statistik Jenis Kelamin"
          subtitle="Jumlah Mahasiswa Berdasarkan Jenis Kelamin"
        >
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
              />
            </svg>
            <p>
              {" "}
              Klik label di bawah chart untuk menyembunyikan/menampilkan
              presentase sesuai jenis kelamin.{" "}
            </p>
          </div>
          <GenderPieChart
            maleCount={genderData.maleCount}
            femaleCount={genderData.femaleCount}
          />{" "}
        </CardChart>
        <CardChart
          title="Statistik Kelas"
          subtitle="Jumlah Mahasiswa Berdasarkan Status"
        >
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
              />
            </svg>
            <p>
              {" "}
              Klik label di bawah chart untuk menyembunyikan/menampilkan
              presentase sesuai status.{" "}
            </p>
          </div>
          <DoughnutChart labels={doughnutLabels} data={doughnutData} />
        </CardChart>
      </div>
      <p className="text-black font-semibold mt-4">Informasi Umum</p>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2">
        <CardChart
          title="Program Studi Terbaru"
          subtitle="Top 5 Program Studi yang Baru Terdaftar"
        >
          <LatestStudents />
        </CardChart>
      </div>
    </div>
  );
}
