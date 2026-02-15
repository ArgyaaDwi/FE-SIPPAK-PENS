"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      display: true,
      labels: {
        padding: 10,
        boxWidth: 12,
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: true,
      text: "Distribusi Gender Mahasiswa",
      font: {
        size: 16,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.raw || 0;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0,
          );
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

type Props = {
  maleCount: number;
  femaleCount: number;
};

export default function GenderPieChart({ maleCount, femaleCount }: Props) {
  const chartData = {
    labels: ["Laki-laki", "Perempuan"],
    datasets: [
      {
        label: "Jumlah Mahasiswa",
        data: [maleCount, femaleCount],
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full h-[350px]">
      <Pie data={chartData} options={options} />
    </div>
  );
}
