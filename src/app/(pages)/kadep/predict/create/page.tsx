"use client";
import { Upload, FileText, X } from "lucide-react";
import { useState, useRef } from "react";
import HeaderForm from "@/components/form/HeaderForm";
import Breadcrumb from "@/components/fragment/Breadcumb";

export default function CreatePredictPage() {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const breadcrumbItems = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Input Prediksi", url: "/predict" },
  ];

  return (
    <div>
      <Breadcrumb
        title="Halaman Prediksi Mahasiswa"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">
        Masukkan data mahasiswa secara manual atau upload file .CSV
      </p>

      {/* 🔹 Card Mode Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <div
          onClick={() => setMode("manual")}
          className={`border rounded-lg p-4 cursor-pointer ${
            mode === "manual" ? "border-primary bg-blue-50" : "border-gray-400"
          }`}
        >
          <h4 className="font-semibold text-lg text-primary">Input Manual</h4>
          <p className="text-sm text-gray-600">
            Masukkan fitur mahasiswa satu per satu
          </p>
        </div>

        <div
          onClick={() => setMode("csv")}
          className={`border rounded-lg p-4 cursor-pointer ${
            mode === "csv" ? "border-primary bg-blue-50" : "border-gray-400"
          }`}
        >
          <h4 className="font-semibold text-lg text-primary">Upload CSV</h4>
          <p className="text-sm text-gray-500">
            Upload data mahasiswa dalam format CSV
          </p>
        </div>
      </div>

      {/* 🔹 Card Upload CSV (muncul hanya kalau pilih CSV) */}
      {mode === "csv" && (
        <div className="bg-white rounded-lg mt-3 py-4 px-4 shadow-sm border border-dashed border-gray-300">
          <h3 className="text-black text-xl font-bold pb-4">Upload File CSV</h3>

          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />

            {file ? (
              <div className="w-full">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Klik atau drag file baru untuk mengganti
                </p>
              </div>
            ) : (
              <>
                <Upload className="text-gray-400 mb-3" size={40} />
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-semibold text-blue-600">
                    Klik untuk memilih file
                  </span>{" "}
                  atau drag & drop file CSV di sini
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Hanya file CSV dengan ukuran maksimal 10MB
                </p>
              </>
            )}
          </div>

          {file && (
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition">
              Upload File
            </button>
          )}
        </div>
      )}

      {/* 🔹 Form Manual (muncul hanya kalau pilih manual) */}
      {mode === "manual" && (
        <div className="bg-white rounded-lg mt-3 py-2 shadow-sm">
          <HeaderForm title="Form Prediksi" />
          <hr className="mb-3" />
          <div className="px-4">
            <form className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Historis Akademik
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="IPS Mean Awal"
                    name="ips_mean_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="IPS Std Awal"
                    name="ips_std_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="IPS Trend Awal"
                    name="ips_trend_awal"
                    className="input"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Teori Mean Awal"
                    name="teori_mean_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Teori Std Awal"
                    name="teori_std_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Teori Trend Awal"
                    name="teori_trend_awal"
                    className="input"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Praktikum Mean Awal"
                    name="prak_mean_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Praktikum Std Awal"
                    name="prak_std_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Praktikum Trend Awal"
                    name="prak_trend_awal"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Beban Studi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="SKS Mean Awal"
                    name="sks_target_mean_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="SKS Std Awal"
                    name="sks_target_std_awal"
                    className="input"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Proporsi MK Tidak Lulus"
                    name="prop_mk_tidak_lulus_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Proporsi SKS Tidak Lulus"
                    name="prop_sks_tidak_lulus_awal"
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Jumlah Semester MK Tidak Lulus"
                    name="count_sem_mk_tidak_lulus_awal"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Kehadiran</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Kehadiran Mean"
                    name="kehadiran_awal_mean"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Kehadiran Std"
                    name="kehadiran_awal_std"
                    className="input"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Tren Kehadiran"
                    name="tren_kehadiran_awal"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Prestasi</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select name="is_prestasi" className="input">
                    <option value="">Punya Prestasi?</option>
                    <option value="1">Ya</option>
                    <option value="0">Tidak</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Total Prestasi"
                    name="total_prestasi"
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Skor Total Prestasi"
                    name="skor_total"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Sosial Ekonomi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <select name="ukt_awal_status" className="input">
                    <option value="">Status UKT</option>
                    <option value="2">Tepat Waktu</option>
                    <option value="1">Telat</option>
                    <option value="0">Belum Bayar</option>
                  </select>

                  <select name="is_kipk" className="input">
                    <option value="">Penerima KIP-K?</option>
                    <option value="1">Ya</option>
                    <option value="0">Tidak</option>
                  </select>

                  <select name="is_non_kipk" className="input">
                    <option value="">Non KIP-K?</option>
                    <option value="1">Ya</option>
                    <option value="0">Tidak</option>
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Log Penghasilan Orang Tua"
                    name="penghasilan_orangtua_log"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Data Demografis
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select name="is_STR" className="input">
                    <option value="">Status Jenjang (STR)</option>
                    <option value="1">STR</option>
                    <option value="0">Non STR</option>
                  </select>

                  <select name="is_laki" className="input">
                    <option value="">Jenis Kelamin</option>
                    <option value="1">Laki-laki</option>
                    <option value="0">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simpan Data
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto bg-white border border-red-600 font-semibold px-6 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
