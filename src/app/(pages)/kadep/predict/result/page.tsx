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
import { TrendingUp } from "lucide-react";
import Breadcrumb from "@/components/fragment/Breadcumb";
export default function PredictionResults() {
  // Data stacking model utama
  const stackingAccuracy = 87.5;
  const stackingPrecision = 0.856;
  const stackingRecall = 0.894;
  const stackingF1 = 0.875;

  // Data baseline models untuk perbandingan
  const comparisonData = [
    {
      model: "Random Forest",
      accuracy: 82.1,
      precision: 0.815,
      recall: 0.831,
      f1: 0.823,
    },
    {
      model: "XGBoost",
      accuracy: 84.3,
      precision: 0.841,
      recall: 0.852,
      f1: 0.846,
    },
    {
      model: "SVM",
      accuracy: 79.8,
      precision: 0.792,
      recall: 0.805,
      f1: 0.798,
    },
    {
      model: "KNN",
      accuracy: 80.8,
      precision: 0.712,
      recall: 0.79,
      f1: 0.88,
    },
    {
      model: "Stacking",
      accuracy: 87.5,
      precision: 0.856,
      recall: 0.894,
      f1: 0.875,
    },
  ];
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
    <div className="p-2 sm:p-4">
      <Breadcrumb
        title="Halaman Prediksi Mahasiswa"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">
        Lihat hasil prediksi akademik Anda di sini
      </p>
      {/* Main Result Card */}
      <div className="flex justify-center my-4">
        <Card className="w-full border-2 border-blue-500 bg-blue-50">
          <CardHeader className="text-center px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-black">
              Hasil Prediksi - Argya Dwi
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              Kategori IPK: Tinggi
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Accuracy Circle - Responsive */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-200"></div>
                  <div className="relative text-center z-10">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-800">
                      {stackingAccuracy}%
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 text-gray-700">
                      Akurasi
                    </div>
                  </div>
                </div>

                {/* Metrics Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full mt-4 sm:mt-8">
                  <div className="text-center p-3 sm:p-4 bg-blue-100 border border-blue-200 rounded-lg">
                    <div className="text-xl sm:text-2xl font-semibold text-primary">
                      {(stackingPrecision * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-black">
                      Precision
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-100 border border-blue-200 rounded-lg">
                    <div className="text-xl sm:text-2xl font-semibold text-primary">
                      {(stackingRecall * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-black">
                      Recall
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-100 border border-blue-200 rounded-lg">
                    <div className="text-xl sm:text-2xl font-semibold text-primary">
                      {(stackingF1 * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm mt-1 text-black">
                      F1-Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Section */}
      <div className="space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div className="px-2 sm:px-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
            Perbandingan dengan Baseline Models
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Perbandingan performa Stacking Classifier dengan model baseline
            lainnya
          </p>
        </div>

        {/* Metrics Comparison Charts - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Precision vs Recall Chart */}
          <Card className="bg-white">
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
              <CardTitle className="text-base sm:text-lg md:text-xl text-black">
                Precision vs Recall
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-600">
                Perbandingan presisi dan recall
              </CardDescription>
            </CardHeader>
            <CardContent className="text-black px-2 sm:px-6">
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:h-[280px]"
              >
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="model"
                    tick={{ fontSize: 10 }}
                    className="sm:text-xs"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => value.toFixed(2)} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="precision"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="recall"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--destructive))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* F1-Score Chart */}
          <Card className="bg-white">
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
              <CardTitle className="text-base sm:text-lg md:text-xl text-black">
                F1-Score Comparison
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-600">
                Harmonic mean dari precision dan recall
              </CardDescription>
            </CardHeader>
            <CardContent className="text-black px-2 sm:px-6">
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:h-[280px]"
              >
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="model"
                    tick={{ fontSize: 10 }}
                    className="sm:text-xs"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
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

        {/* Detailed Comparison Table - Responsive */}
        <Card className="bg-white">
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-lg md:text-xl text-black">
              Detail Perbandingan Model
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600">
              Ringkasan lengkap metrik performa setiap model
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-xs sm:text-sm text-black min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold">
                      Model
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold">
                      Akurasi
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold">
                      Precision
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold">
                      Recall
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold">
                      F1-Score
                    </th>
                    <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr
                      key={row.model}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">
                        {row.model}
                      </td>
                      <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                        {row.accuracy.toFixed(1)}%
                      </td>
                      <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                        {(row.precision * 100).toFixed(1)}%
                      </td>
                      <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                        {(row.recall * 100).toFixed(1)}%
                      </td>
                      <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                        {(row.f1 * 100).toFixed(1)}%
                      </td>
                      <td className="text-center py-2 sm:py-3 px-2 sm:px-4">
                        {row.model === "Stacking" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium whitespace-nowrap">
                            <TrendingUp className="w-3 h-3" />
                            <span className="hidden sm:inline">Best</span>
                            <span className="sm:hidden">✓</span>
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
