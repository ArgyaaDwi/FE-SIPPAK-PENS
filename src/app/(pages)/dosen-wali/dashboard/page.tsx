import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import Breadcrumb from "@/components/fragment/Breadcumb";
import { Users, School, ThumbsUp, ThumbsDown, ChartLine } from "lucide-react";
import LatestStudents from "../components/LatestStudents";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {
  formatPredictionStatusLabel,
  normalizePredictionOutput,
} from "@/lib/utils";

export default async function DashboardDosenWaliPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "DOSEN_WALI") {
    redirect("/unauthorized");
  }

  const kelasList = await prisma.kelas.findMany({
    where: {
      dosen_wali_id: Number(session.user_id),
      deleted: false,
    },
    orderBy: [
      {
        angkatan: "desc",
      },
      {
        nama: "asc",
      },
    ],
    include: {
      prodi: {
        select: {
          nama: true,
        },
      },
      mahasiswa: {
        where: {
          deleted: false,
        },
        orderBy: {
          created_at: "desc",
        },
        include: {
          prediksi: {
            where: {
              deleted: false,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
  });

  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];

  const statusCounts = {
    tinggi: 0,
    sedang: 0,
    rendah: 0,
  };
  const students = kelasList.flatMap((kelas) =>
    kelas.mahasiswa.map((mahasiswa) => {
      const latestPrediction = mahasiswa.prediksi[0];
      const status = latestPrediction
        ? normalizePredictionOutput(latestPrediction.output)
        : "unknown";

      if (status === "tinggi") {
        statusCounts.tinggi += 1;
      } else if (status === "sedang") {
        statusCounts.sedang += 1;
      } else if (status === "rendah") {
        statusCounts.rendah += 1;
      }

      return {
        id: mahasiswa.id,
        nama: mahasiswa.nama,
        kelas: `${kelas.angkatan} ${kelas.nama}`,
        angkatan: mahasiswa.angkatan,
        predictionStatus: formatPredictionStatusLabel(status),
      };
    }),
  );
  const totalMahasiswa = students.length;
  const barLabels = kelasList.map((kelas) => `${kelas.angkatan} ${kelas.nama}`);
  const barData = kelasList.map((kelas) => kelas.mahasiswa.length);
  const latestStudents = students.slice(0, 5);
  const doughnutLabels = [
    "Performa Tinggi",
    "Performa Sedang",
    "Performa Rendah",
  ];
  const doughnutData = [
    statusCounts.tinggi,
    statusCounts.sedang,
    statusCounts.rendah,
  ];

  return (
    <div>
      <Breadcrumb
        title="Dashboard Dosen Wali"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">Monitoring performa akademik mahasiswa</p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-2">
        <Card
          icon={<Users color="gray" />}
          text="Total Mahasiswa"
          count={totalMahasiswa}
          color="#63C2EB"
          url="/dosen-wali/mahasiswa"
          isDetail={false}
        />
        <Card
          icon={<School color="gray" />}
          text="Total Kelas Wali"
          count={kelasList.length}
          color="#81C3C7"
          url="/dosen-wali/kelas"
          isDetail={false}
        />
        <Card
          icon={<ThumbsUp color="gray" />}
          text="Total Performa Tinggi"
          count={statusCounts.tinggi}
          color="#7EF350"
          url="/dosen-wali/mahasiswa"
          isDetail={false}
        />
        <Card
          icon={<ChartLine color="gray" />}
          text="Total Performa Sedang"
          count={statusCounts.sedang}
          color="#F3C129"
          url="/dosen-wali/mahasiswa"
          isDetail={false}
        />
        <Card
          icon={<ThumbsDown color="gray" />}
          text="Total Performa Rendah"
          count={statusCounts.rendah}
          color="#f34842"
          url="/dosen-wali/mahasiswa"
          isDetail={false}
        />
      </div>
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Statistik Kelas Wali"
          subtitle="Jumlah Mahasiswa Tiap Kelas"
        >
          <BarChart labels={barLabels} data={barData} />
        </CardChart>
        <CardChart
          title="Statistik Mahasiswa"
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
          title="Mahasiswa Terbaru"
          subtitle="Top 5 Mahasiswa yang Baru Terdaftar"
        >
          <LatestStudents students={latestStudents} />
        </CardChart>
      </div>
    </div>
  );
}
