"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import CardChart from "@/components/fragment/CardChart";
import { formatPredictionStatusLabel } from "@/lib/utils";

type PredictionDetail = {
  id: string;
  output: string;
  status: string;
  probability: {
    rendah: number;
    sedang: number;
    tinggi: number;
  };
  createdAt: string;
};

type StudentDetail = {
  id: string;
  nama: string;
  angkatan: number;
  kelas: {
    id: number;
    nama: string;
    angkatan: number;
    prodi: {
      id: number;
      nama: string;
    };
  };
  latestPrediction: PredictionDetail | null;
  predictions: PredictionDetail[];
};

interface AcademicStudentDetailFeatureProps {
  mahasiswaId: string;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export default function AcademicStudentDetailFeature({
  mahasiswaId,
}: AcademicStudentDetailFeatureProps) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/v1/academic/mahasiswa/${mahasiswaId}`,
          {
            credentials: "include",
          },
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Gagal memuat mahasiswa");
        }

        if (isMounted) {
          setStudent(result.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat mahasiswa",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStudent();

    return () => {
      isMounted = false;
    };
  }, [mahasiswaId]);

  if (isLoading) {
    return (
      <CardChart title="Detail Mahasiswa" subtitle="Memuat data mahasiswa">
        <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
          <Loader2 size={18} className="animate-spin" />
          Memuat data...
        </div>
      </CardChart>
    );
  }

  if (error || !student) {
    return (
      <CardChart title="Detail Mahasiswa" subtitle="Data tidak tersedia">
        <p className="py-8 text-center text-red-600">
          {error ?? "Mahasiswa tidak ditemukan"}
        </p>
      </CardChart>
    );
  }

  return (
    <div className="space-y-4">
      <CardChart
        title={student.nama}
        subtitle={`${student.id} - ${student.kelas.prodi.nama}, ${student.kelas.angkatan} ${student.kelas.nama}`}
      >
        {student.latestPrediction ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm text-gray-500">Status Terbaru</p>
              <p className="text-xl font-semibold text-black mt-2">
                {formatPredictionStatusLabel(student.latestPrediction.status)}
              </p>
            </div>
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm text-gray-500">Rendah</p>
              <p className="text-xl font-semibold text-black mt-2">
                {formatPercent(student.latestPrediction.probability.rendah)}
              </p>
            </div>
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm text-gray-500">Sedang</p>
              <p className="text-xl font-semibold text-black mt-2">
                {formatPercent(student.latestPrediction.probability.sedang)}
              </p>
            </div>
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm text-gray-500">Tinggi</p>
              <p className="text-xl font-semibold text-black mt-2">
                {formatPercent(student.latestPrediction.probability.tinggi)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Belum ada prediksi untuk mahasiswa ini.
          </p>
        )}
      </CardChart>

      <CardChart
        title="Riwayat Prediksi"
        subtitle="Semua prediksi diurutkan dari yang terbaru"
      >
        <div className="hidden md:block overflow-x-auto border rounded-lg mt-1">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Rendah</th>
                <th className="px-4 py-3">Sedang</th>
                <th className="px-4 py-3">Tinggi</th>
              </tr>
            </thead>
            <tbody>
              {student.predictions.length > 0 ? (
                student.predictions.map((prediction, index) => (
                  <tr key={prediction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {formatDate(prediction.createdAt)}
                    </td>
                    <td className="px-4 py-2">
                      {formatPredictionStatusLabel(prediction.status)}
                    </td>
                    <td className="px-4 py-2">
                      {formatPercent(prediction.probability.rendah)}
                    </td>
                    <td className="px-4 py-2">
                      {formatPercent(prediction.probability.sedang)}
                    </td>
                    <td className="px-4 py-2">
                      {formatPercent(prediction.probability.tinggi)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Belum ada riwayat prediksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {student.predictions.length > 0 ? (
            student.predictions.map((prediction, index) => (
              <div
                key={prediction.id}
                className="border rounded-md p-3 bg-white text-sm text-gray-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400">No. {index + 1}</p>
                    <p className="font-semibold text-gray-900">
                      {formatPredictionStatusLabel(prediction.status)}
                    </p>
                    <p className="text-gray-500">
                      {formatDate(prediction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <span>R: {formatPercent(prediction.probability.rendah)}</span>
                  <span>S: {formatPercent(prediction.probability.sedang)}</span>
                  <span>T: {formatPercent(prediction.probability.tinggi)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="border rounded-md px-4 py-8 text-center text-sm text-gray-500">
              Belum ada riwayat prediksi.
            </div>
          )}
        </div>
      </CardChart>
    </div>
  );
}
