import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import Breadcrumb from "@/components/fragment/Breadcumb";
import { GraduationCap, School, Users } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {
  formatPredictionStatusLabel,
  normalizePredictionOutput,
} from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function DashboardWaliMuridPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "WALI_MURID") {
    redirect("/unauthorized");
  }

  const children = await prisma.mahasiswa.findMany({
    where: {
      wali_id: Number(session.user_id),
      deleted: false,
    },
    orderBy: {
      nama: "asc",
    },
    include: {
      kelas: {
        include: {
          prodi: {
            select: {
              nama: true,
            },
          },
        },
      },
      prediksi: {
        where: {
          deleted: false,
        },
        orderBy: {
          createdAt: "desc",
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

  const activeChild = children[0] ?? null;
  const latestPrediction = activeChild?.prediksi[0] ?? null;
  const latestStatus = latestPrediction
    ? normalizePredictionOutput(latestPrediction.output)
    : "unknown";
  const totalPrediksi = children.reduce(
    (total, child) => total + child.prediksi.length,
    0,
  );
  const probabilityCards = latestPrediction
    ? [
        {
          label: "Probabilitas Rendah",
          value: `${Math.round(latestPrediction.prob_rendah * 100)}%`,
        },
        {
          label: "Probabilitas Sedang",
          value: `${Math.round(latestPrediction.prob_sedang * 100)}%`,
        },
        {
          label: "Probabilitas Tinggi",
          value: `${Math.round(latestPrediction.prob_tinggi * 100)}%`,
        },
      ]
    : [];

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
              {activeChild?.nama ?? "Belum ada data anak"}
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
                {activeChild
                  ? `${activeChild.id} - ${activeChild.kelas.prodi.nama}, ${activeChild.kelas.angkatan} ${activeChild.kelas.nama}`
                  : "Hubungkan data mahasiswa dengan akun wali murid"}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center shadow-xl">
                <span className="text-white font-extrabold text-xl md:text-2xl">
                  {activeChild ? getInitials(activeChild.nama) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        <Card
          icon={<Users color="gray" />}
          text="Total Anak"
          count={children.length}
          color="#63C2EB"
          isDetail={false}
          url="/"
        />
        <Card
          icon={<School color="gray" />}
          text="Total Prediksi"
          count={totalPrediksi}
          color="#81C3C7"
          isDetail={false}
          url="/"
        />
        <Card
          icon={<GraduationCap color="gray" />}
          text="Status Prediksi Terbaru"
          count={formatPredictionStatusLabel(latestStatus)}
          color="#1448CD"
          isDetail={false}
          url="/"
        />
      </div>
      <p className="text-black font-semibold mt-4">Detail Prediksi Terbaru</p>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2">
        <CardChart
          title="Probabilitas Prediksi"
          subtitle="Probabilitas dari prediksi terakhir mahasiswa"
        >
          {probabilityCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {probabilityCards.map((item) => (
                <div
                  key={item.label}
                  className="border rounded-md p-4 bg-gray-50"
                >
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-2xl font-semibold text-black mt-2">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Belum ada prediksi untuk mahasiswa ini.
            </p>
          )}
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
