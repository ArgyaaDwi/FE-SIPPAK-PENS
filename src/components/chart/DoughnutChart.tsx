"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "50%",
  plugins: {
    legend: {
      position: "bottom" as const,
      display: true,
      labels: {
        padding: 10,
        boxWidth: 12,
      },
    },
    title: {
      display: true,
      text: "Persentase Status Performa Akademik",
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  },
};

type Props = {
  labels: string[];
  data: number[];
};

export default function DoughnutChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Mahasiswa",
        data,
        backgroundColor: [
          "rgba(124, 255, 0, 0.8)",
          "rgba(255, 120, 0, 0.8)",
          "rgba(255, 0, 0, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "350px" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
