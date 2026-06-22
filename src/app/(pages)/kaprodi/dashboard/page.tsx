import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import Breadcrumb from "@/components/fragment/Breadcumb";
import { Users, ThumbsUp, ThumbsDown, School } from "lucide-react";
import LatestClasses from "../components/LatestClasses";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { normalizePredictionOutput } from "@/lib/utils";

export default async function DashboardKaprodiPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }
  if (session.role !== "KAPRODI") {
    redirect("/unauthorized");
  }
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];

  const prodi = await prisma.prodi.findFirst({
    where: {
      kaprodi_id: Number(session.user_id),
      deleted: false,
    },
    include: {
      kelas: {
        where: {
          deleted: false,
        },
        orderBy: {
          created_at: "desc",
        },
        include: {
          mahasiswa: {
            where: {
              deleted: false,
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
      },
    },
  });

  const kelasList = prodi?.kelas ?? [];
  const totalMahasiswa = kelasList.reduce(
    (acc, kelas) => acc + kelas.mahasiswa.length,
    0,
  );
  const totalKelas = kelasList.length;

  const statusCounts = {
    tinggi: 0,
    sedang: 0,
    rendah: 0,
  };

  const classStats = kelasList.map((kelas) => {
    const stats = {
      kelas: `${kelas.angkatan} ${kelas.nama}`,
      tinggi: 0,
      sedang: 0,
      rendah: 0,
    };

    kelas.mahasiswa.forEach((mahasiswa) => {
      const latestPrediction = mahasiswa.prediksi[0];

      if (!latestPrediction) {
        return;
      }

      const output = normalizePredictionOutput(latestPrediction.output);

      if (output === "tinggi") {
        statusCounts.tinggi += 1;
        stats.tinggi += 1;
      } else if (output === "sedang") {
        statusCounts.sedang += 1;
        stats.sedang += 1;
      } else if (output === "rendah") {
        statusCounts.rendah += 1;
        stats.rendah += 1;
      }
    });

    return stats;
  });

  const latestClasses = classStats.slice(0, 5);
  const barLabels = classStats.map((item) => item.kelas);
  const barData = kelasList.map((item) => item.mahasiswa.length);
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
          count={totalMahasiswa}
          color="#63C2EB"
          url="/kaprodi/dashboard"
          isDetail={false}
        />
        <Card
          icon={<School color="gray" />}
          text="Total Kelas Kuliah"
          count={totalKelas}
          color="#81C3C7"
          url="/kaprodi/dashboard"
          isDetail={false}
        />
        <Card
          icon={<ThumbsUp color="gray" />}
          text="Total Performa Tinggi"
          count={statusCounts.tinggi}
          color="#7EF350"
          url="/kaprodi/dashboard"
          isDetail={false}
        />
        <Card
          icon={<ThumbsDown color="gray" />}
          text="Total Performa Rendah"
          count={statusCounts.rendah}
          color="#f34842"
          url="/kaprodi/dashboard"
          isDetail={false}
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
          <LatestClasses classes={latestClasses} />
        </CardChart>
      </div>
    </div>
  );
}
