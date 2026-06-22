"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Pastikan path import dummy data ini sesuai dengan foldermu
import { comparisonData } from "@/data/resultDummy/comparisonData";
import {
  stackingAccuracy,
  stackingPrecision,
  stackingRecall,
  stackingF1,
} from "@/data/resultDummy/stackingMetrics";
import { TrendingUp } from "lucide-react";
import Breadcrumb from "@/components/fragment/Breadcumb";

// Tambahkan Props isDemo dan role
interface PredictResultProps {
  isDemo?: boolean;
  role?: "KADEP" | "KAPRODI" | "DOSEN_WALI" | "WALI_MURID" | "DEMO";
}

type PredictApiResponse = {
  prediksi: string;
  probabilitas: {
    rendah: number;
    sedang: number;
    tinggi: number;
  };
};

export default function PredictResult({
  isDemo = false,
  role = "DEMO",
}: PredictResultProps) {
  const [predictionResult, setPredictionResult] =
    useState<PredictApiResponse | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);
  const [predictionError, setPredictionError] = useState("");

  useEffect(() => {
    // KARENA API SUDAH DIPANGGIL DI HALAMAN CREATE, KITA CUKUP BACA HASILNYA SAJA
    const loadPredictionResult = () => {
      try {
        const storedData = sessionStorage.getItem("predictionResult");

        if (!storedData) {
          setPredictionError(
            "Data prediksi tidak ditemukan. Silakan submit ulang dari halaman input form.",
          );
          setIsLoadingPrediction(false);
          return;
        }

        const parsedData = JSON.parse(storedData);
        const { result } = parsedData; // Mengambil object result dari PredictFeature.tsx

        // Mapping ke format yang dibutuhkan UI kamu
        setPredictionResult({
          prediksi: result.output,
          probabilitas: {
            rendah: result.prob_rendah,
            sedang: result.prob_sedang,
            tinggi: result.prob_tinggi,
          },
        });
      } catch (error) {
        setPredictionError("Terjadi kesalahan saat memuat hasil prediksi.");
      } finally {
        // Beri efek loading sekilas (500ms) agar UI terasa natural
        setTimeout(() => setIsLoadingPrediction(false), 500);
      }
    };

    loadPredictionResult();
  }, []);

  const formatProbability = (value?: number) => {
    if (typeof value !== "number") {
      return "-";
    }
    // Ubah probabilitas ke persen (contoh 0.70 jadi 70.00%)
    return (value * 100).toFixed(2) + "%";
  };

  const formatChartTooltipValue = (value: number | string | undefined) => {
    if (typeof value === "number") {
      return value.toFixed(2);
    }
    return "-";
  };

  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: `/${role.toLowerCase().replace("_", "-")}/dashboard`,
    },
    {
      name: "Input Prediksi",
      url: `/${role.toLowerCase().replace("_", "-")}/predict`,
    },
    { name: "Hasil Prediksi", url: "#" },
  ];

  return (
    // <div className="p-2 sm:p-6 max-w-7xl mx-auto">
    <div>
      <Breadcrumb
        title={isDemo ? "Demo Hasil Prediksi IPK" : "Hasil Prediksi Mahasiswa"}
        breadcrumbItems={isDemo ? [] : breadcrumbItems}
      />
      <p className="text-gray-600 mb-4">
        {isDemo
          ? "Ini adalah simulasi hasil prediksi."
          : "Lihat hasil prediksi akademik mahasiswa Anda di sini."}
      </p>

      {/* Main Result Card */}
      <div className="flex justify-center my-3 sm:my-4 px-0">
        <Card className="w-full border-2 border-gray-500 bg-gray-50 shadow-sm">
          <CardHeader className="text-center px-3 py-3 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-xl md:text-2xl text-gray-700 font-bold wrap-break-word">
              Kesimpulan Hasil Prediksi
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 mt-1">
              {isLoadingPrediction
                ? "Memuat hasil..."
                : `Kategori Prediksi Kelulusan: `}
              {!isLoadingPrediction && predictionResult && (
                <span
                  className={`font-bold ${
                    predictionResult.prediksi === "Tinggi"
                      ? "text-green-600"
                      : predictionResult.prediksi === "Sedang"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {predictionResult.prediksi.toUpperCase()}
                </span>
              )}
            </CardDescription>
            {!!predictionError && (
              <CardDescription className="text-sm text-red-600 mt-1 font-semibold">
                {predictionError}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <CardDescription className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wider">
                  Detail Probabilitas Kategori
                </CardDescription>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 w-full">
                  <div className="text-center p-3 sm:p-4 bg-white border-2 border-red-500 rounded-lg">
                    <div className="text-lg sm:text-2xl font-semibold text-red-600">
                      {isLoadingPrediction
                        ? "..."
                        : formatProbability(
                            predictionResult?.probabilitas.rendah,
                          )}
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-red-700 font-medium">
                      RENDAH
                    </div>
                    <div className="text-[11px] sm:text-xs mt-1 text-rose-700">
                      IPK &lt; 2.75
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-white border-2 border-yellow-400 rounded-lg">
                    <div className="text-lg sm:text-2xl font-semibold text-yellow-600">
                      {isLoadingPrediction
                        ? "..."
                        : formatProbability(
                            predictionResult?.probabilitas.sedang,
                          )}
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-yellow-600 font-medium">
                      SEDANG
                    </div>
                    <div className="text-[11px] sm:text-xs mt-1 text-yellow-700">
                      IPK 2.75 - 3.50
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-white border-2 border-green-500 rounded-lg">
                    <div className="text-lg sm:text-2xl font-semibold text-green-600">
                      {isLoadingPrediction
                        ? "..."
                        : formatProbability(
                            predictionResult?.probabilitas.tinggi,
                          )}
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-green-600 font-medium">
                      TINGGI
                    </div>
                    <div className="text-[11px] sm:text-xs mt-1 text-green-700">
                      IPK &gt; 3.50
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrik Performa Card */}
      <div className="flex justify-center my-3 sm:my-4 px-0">
        <Card className="w-full border-2 border-sky-500 bg-sky-50 shadow-sm">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg md:text-xl text-black">
              Metrik Performa Stacking Ensemble Model
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600">
              Tingkat keandalan model prediksi yang sedang digunakan
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full">
                  <div className="text-center p-2 sm:p-4 bg-sky-100 border border-sky-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-sky-800">
                      {stackingAccuracy}%
                    </div>
                    <div className="text-xs mt-1 text-black">Accuracy</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-sky-100 border border-sky-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-sky-800">
                      {(stackingPrecision * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs mt-1 text-black">Precision</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-sky-100 border border-sky-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-sky-800">
                      {(stackingRecall * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs mt-1 text-black">Recall</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-sky-100 border border-sky-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-sky-800">
                      {(stackingF1 * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs mt-1 text-black">F1-Score</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sisa UI Comparison Chart Sama Persis dengan Milikmu */}
      <div className="space-y-3 sm:space-y-6 px-0 mt-6">
        <div className="px-0">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-black">
            Perbandingan dengan Baseline Models
          </h2>
          <p className="text-xs sm:text-base text-gray-600 mt-1">
            Perbandingan performa Stacking Classifier dengan model baseline
            lainnya
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
              <CardTitle className="text-sm sm:text-lg md:text-xl text-black">
                Precision vs Recall
              </CardTitle>
            </CardHeader>
            <CardContent className="text-black px-2 sm:px-6 pb-4 sm:pb-6">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={comparisonData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="model"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={formatChartTooltipValue} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="precision"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="recall"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--destructive))", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
              <CardTitle className="text-sm sm:text-lg md:text-xl text-black">
                F1-Score Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="text-black px-2 sm:px-6 pb-4 sm:pb-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={comparisonData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="model"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={formatChartTooltipValue} />
                  <Bar
                    dataKey="f1"
                    fill="hsl(var(--chart-2))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
            <CardTitle className="text-sm sm:text-lg md:text-xl text-black">
              Detail Perbandingan Model
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-6 pb-4 sm:pb-6">
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-black">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold">Model</th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Akurasi
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Precision
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Recall
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      F1-Score
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr
                      key={row.model}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{row.model}</td>
                      <td className="text-right py-3 px-4">
                        {row.accuracy.toFixed(1)}%
                      </td>
                      <td className="text-right py-3 px-4">
                        {(row.precision * 100).toFixed(1)}%
                      </td>
                      <td className="text-right py-3 px-4">
                        {(row.recall * 100).toFixed(1)}%
                      </td>
                      <td className="text-right py-3 px-4">
                        {(row.f1 * 100).toFixed(1)}%
                      </td>
                      <td className="text-center py-3 px-4">
                        {row.model === "Stacking" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            <TrendingUp className="w-3 h-3" /> Best
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
