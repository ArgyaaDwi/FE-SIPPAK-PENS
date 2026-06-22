import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import Breadcrumb from "@/components/fragment/Breadcumb";
import { Users, GraduationCap, ThumbsUp, ThumbsDown } from "lucide-react";
import LatestMajors from "../components/LatestMajors";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { normalizePredictionOutput } from "@/lib/utils";

export default async function DashboardKadepPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "KADEP") {
    redirect("/unauthorized");
  }

  const departemen = await prisma.departemen.findFirst({
    where: {
      kadep_id: Number(session.user_id),
      deleted: false,
    },
    include: {
      prodi: {
        where: {
          deleted: false,
        },
        orderBy: {
          created_at: "desc",
        },
        include: {
          kelas: {
            where: {
              deleted: false,
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
      },
    },
  });

  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];

  const prodiList = departemen?.prodi ?? [];
  const totalMahasiswa = prodiList.reduce(
    (acc, prodi) =>
      acc +
      prodi.kelas.reduce((kelasAcc, kelas) => kelasAcc + kelas.mahasiswa.length, 0),
    0,
  );
  const totalProdi = prodiList.length;

  const statusCounts = {
    tinggi: 0,
    sedang: 0,
    rendah: 0,
  };

  const majorStats = prodiList.map((prodi) => {
    const stats = {
      prodi: prodi.nama,
      tinggi: 0,
      sedang: 0,
      rendah: 0,
    };

    prodi.kelas.forEach((kelas) => {
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
    });

    return stats;
  });

  const latestMajors = majorStats.slice(0, 5);

  const barLabels = prodiList.map((item) => item.nama);
  const barData = prodiList.map((item) =>
    item.kelas.reduce((acc, kelas) => acc + kelas.mahasiswa.length, 0),
  );
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
        title="Dashboard Kepala Departemen"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">
        Monitoring performa akademik seluruh program studi
      </p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
        <Card
          icon={<Users color="gray" />}
          text="Total Mahasiswa"
          count={totalMahasiswa}
          color="#63C2EB"
          url="/kadep/dashboard"
          isDetail={false}
        />
        <Card
          icon={<GraduationCap color="gray" />}
          text="Total Program Studi"
          count={totalProdi}
          color="#81C3C7"
          url="/kadep/dashboard"
          isDetail={false}
        />
        <Card
          icon={<ThumbsUp color="gray" />}
          text="Total Performa Tinggi"
          count={statusCounts.tinggi}
          color="#7EF350"
          url="/kadep/dashboard"
          isDetail={false}
        />
        <Card
          icon={<ThumbsDown color="gray" />}
          text="Total Performa Rendah"
          count={statusCounts.rendah}
          color="#f34842"
          url="/kadep/dashboard"
          isDetail={false}
        />
      </div>
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Statistik Program Studi"
          subtitle="Jumlah Mahasiswa Tiap Program Studi"
        >
          <BarChart labels={barLabels} data={barData} />
        </CardChart>
        <CardChart
          title="Statistik Departemen"
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
          <LatestMajors majors={latestMajors} />
        </CardChart>
      </div>
    </div>
  );
}
