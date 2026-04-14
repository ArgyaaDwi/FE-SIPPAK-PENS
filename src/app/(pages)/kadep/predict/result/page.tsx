"use client";
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
import { comparisonData } from "@/data/resultDummy/comparisonData";
import {
  stackingAccuracy,
  stackingPrecision,
  stackingRecall,
  stackingF1,
} from "@/data/resultDummy/stackingMetrics";
import { TrendingUp } from "lucide-react";
import Breadcrumb from "@/components/fragment/Breadcumb";
export default function PredictionResults() {
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      name: "Hasil Prediksi",
      url: "/predict",
    },
  ];
  return (
    <div className="p-2 sm:p-6 max-w-7xl mx-auto">
      <Breadcrumb
        title="Halaman Prediksi Mahasiswa"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">
        Lihat hasil prediksi akademik Anda di sini
      </p>
      {/* Main Result Card */}
      <div className="flex justify-center my-3 sm:my-4 px-0">
        <Card className="w-full border-2 border-blue-500 bg-blue-50 shadow-sm">
          <CardHeader className="text-center px-3 py-3 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-xl md:text-2xl text-sky-700 font-bold break-words">
              Hasil Prediksi - Argya Dwi
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 mt-1">
              Kategori IPK: Sedang
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                {/* Metrics Grid - Responsive */}
                <CardDescription className="text-xs sm:text-sm text-gray-600">
                  Probabilitas
                </CardDescription>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 w-full">
                  <div className="text-center p-3 sm:p-4 bg-blue-100 border border-blue-200 rounded-lg">
                    <div className="text-lg sm:text-2xl font-semibold text-primary">
                      0.30105
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-black">
                      Rendah
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-100 border border-blue-200 rounded-lg">
                    <div className="text-lg sm:text-2xl font-semibold text-primary">
                      0.66858
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-black">
                      Sedang
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-100 border border-blue-200 rounded-lg">
                    <div className="text-lg sm:text-2xl font-semibold text-primary">
                      0.03037
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-black">
                      Tinggi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center my-3 sm:my-4 px-0">
        <Card className="w-full border-2 border-green-500 bg-green-50 shadow-sm">
          <CardHeader className="px-3  sm:px-6 ">
            <CardTitle className="text-base sm:text-lg md:text-xl text-black">
              Metrik Performa Stacking Ensemble Model
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600">
              Ringkasan metrik utama untuk model stacking
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4 ">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full ">
                  <div className="text-center p-2 sm:p-4 bg-green-100 border border-green-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-green-800">
                      {stackingAccuracy}%
                    </div>
                    <div className="text-xs mt-1 text-black">Accuracy</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-green-100 border border-green-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-green-800">
                      {(stackingPrecision * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs mt-1 text-black">Precision</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-green-100 border border-green-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-green-800">
                      {(stackingRecall * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs mt-1 text-black">Recall</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-green-100 border border-green-200 rounded-lg">
                    <div className="text-base sm:text-2xl font-semibold text-green-800">
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

      {/* Comparison Section */}
      <div className="space-y-3 sm:space-y-6 px-0">
        {/* Section Header */}
        <div className="px-0">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-black">
            Perbandingan dengan Baseline Models
          </h2>
          <p className="text-xs sm:text-base text-gray-600 mt-1">
            Perbandingan performa Stacking Classifier dengan model baseline
            lainnya
          </p>
        </div>

        {/* Metrics Comparison Charts - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
          {/* Precision vs Recall Chart */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
              <CardTitle className="text-sm sm:text-lg md:text-xl text-black">
                Precision vs Recall
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                Perbandingan presisi dan recall
              </CardDescription>
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
                  <Tooltip formatter={(value) => value.toFixed(2)} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="precision"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="recall"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--destructive))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* F1-Score Chart */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
              <CardTitle className="text-sm sm:text-lg md:text-xl text-black">
                F1-Score Comparison
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                Harmonic mean dari precision dan recall
              </CardDescription>
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
                  <Tooltip formatter={(value) => value.toFixed(2)} />
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

        {/* Detailed Comparison Table - Responsive Card Layout for Mobile */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
            <CardTitle className="text-sm sm:text-lg md:text-xl text-black">
              Detail Perbandingan Model
            </CardTitle>
            <CardDescription className="text-xs text-gray-600">
              Ringkasan lengkap metrik performa setiap model
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6 pb-4 sm:pb-6">
            {/* Table for SM and above */}
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
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium whitespace-nowrap">
                            <TrendingUp className="w-3 h-3" />
                            Best
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

            {/* Card Layout for Mobile (below SM) */}
            <div className="sm:hidden space-y-3">
              {comparisonData.map((row) => (
                <div
                  key={row.model}
                  className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-black">
                      {row.model}
                    </h4>
                    {row.model === "Stacking" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Best
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Akurasi</span>
                      <p className="font-semibold text-black">
                        {row.accuracy.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Precision</span>
                      <p className="font-semibold text-black">
                        {(row.precision * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Recall</span>
                      <p className="font-semibold text-black">
                        {(row.recall * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">F1-Score</span>
                      <p className="font-semibold text-black">
                        {(row.f1 * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
