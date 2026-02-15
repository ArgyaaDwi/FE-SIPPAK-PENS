import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { dummyKelas } from "@/data/dummy/dummyKelas";
import Breadcrumb from "@/components/fragment/Breadcumb";
import { Users, ThumbsUp, ThumbsDown, School } from "lucide-react";
import LatestClasses from "../components/LatestClasses";
export default async function DashboardKaprodiPage() {
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
        title="Dashboard Kepala Program Studi"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">
        Monitoring siswa dan strategi akademik program studi
      </p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
        <Card
          icon={<Users color="gray" />}
          text="Total Mahasiswa"
          count="712"
          color="#63C2EB"
          url="/admin/lecturer"
        />
        <Card
          icon={<School color="gray" />}
          text="Total Kelas Kuliah"
          count="9"
          color="#81C3C7"
          url="/admin/publisher"
        />
        <Card
          icon={<ThumbsUp color="gray" />}
          text="Total Performa Tinggi"
          count="244"
          color="#7EF350"
          url="/admin/proposal"
        />
        <Card
          icon={<ThumbsDown color="gray" />}
          text="Total Performa Rendah"
          count="19"
          color="#f34842"
          url="/admin/proposal"
        />
      </div>
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Statistik Kelas Perkuliahan"
          subtitle="Jumlah Mahasiswa Tiap Kelas"
        >
          <BarChart labels={barLabels} data={barData} />
        </CardChart>
        <CardChart
          title="Statistik Program Studi"
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
          title="Kelas Kuliah Terbaru"
          subtitle="Top 5  Kelas yang Baru Terdaftar"
        >
          <LatestClasses />
        </CardChart>
      </div>
    </div>
  );
}
