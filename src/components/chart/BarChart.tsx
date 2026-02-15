"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  labels: string[];
  data: number[];
};

export default function BarChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Mahasiswa",
        data,
        backgroundColor: "rgba(8, 19, 133, 0.89)",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: false,
        text: "Mahasiswa Tiap Program Studi",
      },
    },
  };

  return (
    <div style={{ height: "350px" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
}
