"use client";
import { Upload, FileText, X, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Breadcrumb from "@/components/fragment/Breadcumb";
import {
  calculateMean,
  calculateStd,
  calculateTrend,
} from "@/utils/mathHelper";
import HeaderSubForm from "@/components/form/HeaderSubForm";

// 🔹 Tambahkan Props isDemo dan role
interface PredictFeatureProps {
  isDemo?: boolean;
  role?: "KADEP" | "KAPRODI" | "DOSEN_WALI" | "WALI_MURID" | "DEMO";
}

type AkademikField = "ips" | "teori" | "prak" | "kehadiran";

type AkademikStats = {
  mean: number;
  std: number;
  trend: number;
};

export default function PredictFeature({
  isDemo = false,
  role = "DEMO",
}: PredictFeatureProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 STATE BARU: Untuk Data Mahasiswa
  const [mahasiswaId, setMahasiswaId] = useState("");
  const [listMahasiswa, setListMahasiswa] = useState<
    { id: string; nama: string }[]
  >([]);
  const [isLoadingMahasiswa, setIsLoadingMahasiswa] = useState(false);

  // 🔹 USE EFFECT: Fetch data mahasiswa SAAT BUKAN DEMO
  useEffect(() => {
    if (!isDemo) {
      async function fetchMahasiswa() {
        setIsLoadingMahasiswa(true);
        try {
          // Sesuaikan endpoint ini dengan rute Hono-mu nanti
          const res = await fetch("/api/v1/mahasiswa");
          const json = await res.json();
          if (json.success) {
            setListMahasiswa(json.data);
          }
        } catch (error) {
          console.error("Gagal mengambil data mahasiswa:", error);
        } finally {
          setIsLoadingMahasiswa(false);
        }
      }
      fetchMahasiswa();
    }
  }, [isDemo]);

  const [openSections, setOpenSections] = useState({
    akademik: true,
    sks: true,
    kehadiran: true,
    prestasi: true,
    sosial: true,
    demografis: true,
  });

  const [akademikData, setAkademikData] = useState([
    { semester: 1, ips: 0, teori: 0, prak: 0, kehadiran: 0 },
    { semester: 2, ips: 0, teori: 0, prak: 0, kehadiran: 0 },
    { semester: 3, ips: 0, teori: 0, prak: 0, kehadiran: 0 },
    { semester: 4, ips: 0, teori: 0, prak: 0, kehadiran: 0 },
  ]);

  const handleAkademikChange = (
    index: number,
    field: AkademikField,
    value: string,
  ) => {
    const newData = [...akademikData];
    newData[index][field] = parseFloat(value) || 0;
    setAkademikData(newData);
  };

  const [formData, setFormData] = useState({
    is_prestasi: "",
    total_prestasi: 0,
    skor_total: 0,
    ukt_awal_status: "",
    is_kipk: "",
    is_non_kipk: "",
    PENGHASILAN_AYAH: 0,
    PENGHASILAN_IBU: 0,
    is_STR: "",
    is_laki: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const buildFinalPayload = () => {
    const toNumber = (value: unknown) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const ipsArr = akademikData.map((d) => d.ips);
    const teoriArr = akademikData.map((d) => d.teori);
    const prakArr = akademikData.map((d) => d.prak);
    const hadirArr = akademikData.map((d) => d.kehadiran);

    return {
      ips_mean_awal: Number(calculateMean(ipsArr).toFixed(4)),
      ips_std_awal: Number(calculateStd(ipsArr).toFixed(4)),
      ips_trend_awal: Number(calculateTrend(ipsArr).toFixed(4)),

      teori_mean_awal: Number(calculateMean(teoriArr).toFixed(4)),
      teori_std_awal: Number(calculateStd(teoriArr).toFixed(4)),
      teori_trend_awal: Number(calculateTrend(teoriArr).toFixed(4)),

      prak_mean_awal: Number(calculateMean(prakArr).toFixed(4)),
      prak_std_awal: Number(calculateStd(prakArr).toFixed(4)),
      prak_trend_awal: Number(calculateTrend(prakArr).toFixed(4)),

      kehadiran_awal_mean: Number(calculateMean(hadirArr).toFixed(4)),
      kehadiran_awal_std: Number(calculateStd(hadirArr).toFixed(4)),
      kehadiran_trend_awal: Number(calculateTrend(hadirArr).toFixed(4)),

      sks_target_mean_awal: calculatedLoad.sks_target_mean_awal,
      sks_target_std_awal: calculatedLoad.sks_target_std_awal,
      prop_mk_tidak_lulus_awal: calculatedLoad.prop_mk_tidak_lulus_awal,
      prop_sks_tidak_lulus_awal: calculatedLoad.prop_sks_tidak_lulus_awal,
      count_sem_mk_tidak_lulus_awal:
        calculatedLoad.count_sem_mk_tidak_lulus_awal,

      ukt_awal_status: toNumber(formData.ukt_awal_status),
      is_kipk: toNumber(formData.is_kipk),
      is_non_kipk: toNumber(formData.is_non_kipk),
      is_prestasi: toNumber(formData.is_prestasi),
      total_prestasi: toNumber(formData.total_prestasi),
      skor_total: toNumber(formData.skor_total),
      is_STR: toNumber(formData.is_STR),
      is_laki: toNumber(formData.is_laki),
      PENGHASILAN_AYAH: toNumber(formData.PENGHASILAN_AYAH),
      PENGHASILAN_IBU: toNumber(formData.PENGHASILAN_IBU),
    };
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [calculatedAkademik, setCalculatedAkademik] = useState<
    Record<AkademikField, AkademikStats>
  >({
    ips: { mean: 0, std: 0, trend: 0 },
    teori: { mean: 0, std: 0, trend: 0 },
    prak: { mean: 0, std: 0, trend: 0 },
    kehadiran: { mean: 0, std: 0, trend: 0 },
  });

  const handleCalculateAkademik = (field: AkademikField) => {
    const values = akademikData.map((d) => d[field]);
    const mean = calculateMean(values);
    const std = calculateStd(values);
    const trend = calculateTrend(values);

    setCalculatedAkademik((prev) => ({
      ...prev,
      [field]: {
        mean: Number(mean.toFixed(4)),
        std: Number(std.toFixed(4)),
        trend: Number(trend.toFixed(4)),
      },
    }));
  };

  const handleFileChange = (e: any) => {
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

  const [semesterData, setSemesterData] = useState([
    {
      semester: 1,
      sks_target: 0,
      mk_lulus: 0,
      mk_tidak_lulus: 0,
      sks_tidak_lulus: 0,
    },
    {
      semester: 2,
      sks_target: 0,
      mk_lulus: 0,
      mk_tidak_lulus: 0,
      sks_tidak_lulus: 0,
    },
    {
      semester: 3,
      sks_target: 0,
      mk_lulus: 0,
      mk_tidak_lulus: 0,
      sks_tidak_lulus: 0,
    },
    {
      semester: 4,
      sks_target: 0,
      mk_lulus: 0,
      mk_tidak_lulus: 0,
      sks_tidak_lulus: 0,
    },
  ]);

  const [calculatedLoad, setCalculatedLoad] = useState({
    sks_target_mean_awal: 0,
    sks_target_std_awal: 0,
    prop_mk_tidak_lulus_awal: 0,
    prop_sks_tidak_lulus_awal: 0,
    count_sem_mk_tidak_lulus_awal: 0,
  });

  const handleDataChange = (index: number, field: string, value: string) => {
    const newData = [...semesterData];
    newData[index][field as keyof (typeof newData)[0]] = parseFloat(value) || 0;
    setSemesterData(newData);
  };

  const handleCalculateLoad = () => {
    const sksArr = semesterData.map((d) => d.sks_target);
    const meanSks = calculateMean(sksArr);
    const stdSks = calculateStd(sksArr);

    let totalMkLulus = 0;
    let totalMkTdkLulus = 0;
    let totalSksTarget = 0;
    let totalSksTdkLulus = 0;
    let countSemBermasalah = 0;

    semesterData.forEach((d) => {
      totalMkLulus += d.mk_lulus;
      totalMkTdkLulus += d.mk_tidak_lulus;
      totalSksTarget += d.sks_target;
      totalSksTdkLulus += d.sks_tidak_lulus;

      if (d.mk_tidak_lulus > 0) {
        countSemBermasalah++;
      }
    });

    const totalMk = totalMkLulus + totalMkTdkLulus;
    const propMkGagal = totalMk > 0 ? totalMkTdkLulus / totalMk : 0;
    const propSksGagal =
      totalSksTarget > 0 ? totalSksTdkLulus / totalSksTarget : 0;

    setCalculatedLoad({
      sks_target_mean_awal: Number(meanSks.toFixed(2)),
      sks_target_std_awal: Number(stdSks.toFixed(2)),
      prop_mk_tidak_lulus_awal: Number(propMkGagal.toFixed(4)),
      prop_sks_tidak_lulus_awal: Number(propSksGagal.toFixed(4)),
      count_sem_mk_tidak_lulus_awal: countSemBermasalah,
    });
  };

  // 🔹 FUNGSI SUBMIT PREDIKSI UTAMA
  // 🔹 FUNGSI SUBMIT PREDIKSI UTAMA
  const handleSubmitPrediction = async () => {
    try {
      setIsLoading(true);

      if (!isDemo && !mahasiswaId) {
        alert("Pilih Mahasiswa terlebih dahulu untuk menyimpan ke database!");
        return;
      }

      const finalPayload = buildFinalPayload();

      // ==========================================
      // 1. FETCH KE FASTAPI (ML MODEL)
      // ==========================================
      const fastApiRes = await fetch("http://43.157.228.152:8001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!fastApiRes.ok)
        throw new Error("Gagal mengambil prediksi dari server ML");

      const mlResult = await fastApiRes.json();

      // ==========================================
      // 2. SIMPAN KE DATABASE (Hanya jika BUKAN Demo)
      // ==========================================
      if (!isDemo) {
        const dbRes = await fetch("/api/v1/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mahasiswa_id: mahasiswaId,
            payload_input: finalPayload,
            output: mlResult.output,
            prob_rendah: mlResult.prob_rendah,
            prob_sedang: mlResult.prob_sedang,
            prob_tinggi: mlResult.prob_tinggi,
          }),
        });

        if (!dbRes.ok) throw new Error("Gagal menyimpan prediksi ke database");
      }

      // ==========================================
      // 3. REDIRECT KE HALAMAN RESULT
      // ==========================================
      sessionStorage.setItem(
        "predictionResult",
        JSON.stringify({ payload: finalPayload, result: mlResult }),
      );

      const redirectUrl = isDemo
        ? "/demo/result"
        : `/${role.toLowerCase().replace("_", "-")}/predict/result`;

      router.push(redirectUrl);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses prediksi.");
    } finally {
      setIsLoading(false);
    }
  };

  const mahasiswaOptions = listMahasiswa.map((mhs) => ({
    value: mhs.id,
    label: `${mhs.id} - ${mhs.nama}`,
  }));

  return (
    <div>
      <Breadcrumb
        title={isDemo ? "Demo Prediksi IPK" : "Halaman Prediksi Mahasiswa"}
        breadcrumbItems={breadcrumbItems}
      />

      {/* 🔹 RENDER DROPDOWN MAHASISWA JIKA BUKAN DEMO */}
      {!isDemo && (
        <div className="my-5 p-5 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Pilih Mahasiswa yang Akan Diprediksi{" "}
            <span className="text-red-500">*</span>
          </label>

          {isLoadingMahasiswa ? (
            <p className="text-sm text-gray-500 animate-pulse">
              Memuat daftar mahasiswa...
            </p>
          ) : (
            <Select
              instanceId="mahasiswa-select"
              options={mahasiswaOptions}
              value={
                mahasiswaOptions.find((opt) => opt.value === mahasiswaId) ||
                null
              }
              onChange={(selected) => setMahasiswaId(selected?.value ?? "")}
              placeholder="Cari NRP atau Nama Mahasiswa..."
              isClearable
              isSearchable
              noOptionsMessage={() => "Mahasiswa tidak ditemukan"}
              className="w-full"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  borderRadius: "0.375rem",
                  padding: "2px",
                  fontSize: "0.875rem",
                  "&:hover": { borderColor: "#3b82f6" },
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: "0.875rem",
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                      ? "#eff6ff"
                      : "white",
                  color: state.isSelected ? "white" : "#111827",
                }),
              }}
            />
          )}

          <p className="text-xs text-gray-500 mt-2">
            Hasil prediksi akan masuk ke data mahasiswa ini di database. 1
            Mahasiswa bisa memiliki banyak prediksi (history), tapi pastikan
            memilih mahasiswa yang benar untuk hasil yang akurat!
          </p>
        </div>
      )}

      <p className="text-gray-600 mb-4">
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

      {/* 🔹 Card Upload CSV */}
      {mode === "csv" && (
        <>
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
                  Lihat panduan lengkap untuk format file CSV yang benar dan
                  cara mengisi data dengan tepat agar prediksi akurat.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg mt-3 py-4 px-4 shadow-sm border border-dashed border-gray-300">
            <h3 className="text-black text-xl font-bold pb-4">
              Upload File CSV
            </h3>

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
              <button
                onClick={handleSubmitPrediction}
                disabled={isLoading}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
              >
                {isLoading ? "Memproses..." : "Submit File & Prediksi"}
              </button>
            )}
          </div>
        </>
      )}

      {/* 🔹 Form Manual */}
      {mode === "manual" && (
        <>
          <div className="bg-white rounded-lg mt-3 shadow-sm">
            <div className="flex justify-between items-center px-2 py-3 border-b">
              <HeaderSubForm title="Historis Akademik" />
              <button
                type="button"
                onClick={() => toggleSection("akademik")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              >
                {openSections.akademik ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            <div
              className={`transition-all duration-300 ${openSections.akademik ? "block" : "hidden"}`}
            >
              {/* IPS */}
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-700 mb-4">
                  IP (Input Per Semester)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                  {akademikData.map((_, idx) => (
                    <div key={idx}>
                      <label className="block text-xs text-gray-500 mb-1">
                        IPS Semester {idx + 1}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={akademikData[idx].ips || ""}
                        onChange={(e) =>
                          handleAkademikChange(idx, "ips", e.target.value)
                        }
                        placeholder="Contoh: 3.50"
                        className="w-full border rounded-md p-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleCalculateAkademik("ips")}
                  className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition"
                >
                  Hitung Statistik IP
                </button>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Preview Payload:
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="block text-gray-500">IPS Mean:</span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.ips.mean}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">IPS Std Dev:</span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.ips.std}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">IPS Trend:</span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.ips.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teori */}
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-700 mb-4">
                  Nilai Teori (Input Per Semester)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                  {akademikData.map((_, idx) => (
                    <div key={idx}>
                      <label className="block text-xs text-gray-500 mb-1">
                        Teori Semester {idx + 1}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={akademikData[idx].teori || ""}
                        onChange={(e) =>
                          handleAkademikChange(idx, "teori", e.target.value)
                        }
                        className="w-full border rounded-md p-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleCalculateAkademik("teori")}
                  className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition"
                >
                  Hitung Statistik Teori
                </button>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Preview Payload:
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="block text-gray-500">Teori Mean:</span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.teori.mean}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">
                        Teori Std Dev:
                      </span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.teori.std}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Teori Trend:</span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.teori.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Praktikum */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                  Nilai Praktikum (Input Per Semester)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                  {akademikData.map((_, idx) => (
                    <div key={idx}>
                      <label className="block text-xs text-gray-500 mb-1">
                        Praktikum Semester {idx + 1}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={akademikData[idx].prak || ""}
                        onChange={(e) =>
                          handleAkademikChange(idx, "prak", e.target.value)
                        }
                        className="w-full border rounded-md p-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleCalculateAkademik("prak")}
                  className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition"
                >
                  Hitung Statistik Praktikum
                </button>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Preview Payload:
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="block text-gray-500">
                        Praktikum Mean:
                      </span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.prak.mean}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">
                        Praktikum Std Dev:
                      </span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.prak.std}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">
                        Praktikum Trend:
                      </span>
                      <span className="font-mono text-black">
                        {calculatedAkademik.prak.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SKS & Beban Studi */}
          <div className="bg-white rounded-lg mt-3 shadow-sm">
            <div className="flex justify-between items-center px-2 py-3 border-b">
              <HeaderSubForm title="Beban Studi" />
              <button
                type="button"
                onClick={() => toggleSection("sks")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              >
                {openSections.sks ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            <div
              className={`bg-white rounded-lg p-6 shadow-sm ${openSections.sks ? "block" : "hidden"}`}
            >
              {semesterData.map((data, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 p-3 border rounded bg-gray-50"
                >
                  <div className="sm:col-span-4 font-semibold text-sm text-blue-600">
                    Semester {idx + 1}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      SKS Target
                    </label>
                    <input
                      type="number"
                      value={data.sks_target || ""}
                      onChange={(e) =>
                        handleDataChange(idx, "sks_target", e.target.value)
                      }
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Jml MK Lulus
                    </label>
                    <input
                      type="number"
                      value={data.mk_lulus || ""}
                      onChange={(e) =>
                        handleDataChange(idx, "mk_lulus", e.target.value)
                      }
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Jml MK Tdk Lulus
                    </label>
                    <input
                      type="number"
                      value={data.mk_tidak_lulus || ""}
                      onChange={(e) =>
                        handleDataChange(idx, "mk_tidak_lulus", e.target.value)
                      }
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      SKS Tdk Lulus
                    </label>
                    <input
                      type="number"
                      value={data.sks_tidak_lulus || ""}
                      onChange={(e) =>
                        handleDataChange(idx, "sks_tidak_lulus", e.target.value)
                      }
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleCalculateLoad}
                className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition"
              >
                Hitung Statistik SKS & Kelulusan
              </button>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Preview Payload:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500">SKS Mean:</span>
                    <span className="font-mono text-black">
                      {calculatedLoad.sks_target_mean_awal}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500">SKS Std:</span>
                    <span className="font-mono text-black">
                      {calculatedLoad.sks_target_std_awal}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500">
                      Proporsi MK Gagal:
                    </span>
                    <span className="font-mono text-black">
                      {calculatedLoad.prop_mk_tidak_lulus_awal}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500">
                      Proporsi SKS Gagal:
                    </span>
                    <span className="font-mono text-black">
                      {calculatedLoad.prop_sks_tidak_lulus_awal}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500">
                      Jml Sem Bermasalah:
                    </span>
                    <span className="font-mono text-black">
                      {calculatedLoad.count_sem_mk_tidak_lulus_awal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kehadiran */}
          <div className="bg-white rounded-lg mt-3 shadow-sm">
            <div className="flex justify-between items-center px-2 py-3 border-b">
              <HeaderSubForm title="Kehadiran" />
              <button
                type="button"
                onClick={() => toggleSection("kehadiran")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              >
                {openSections.kehadiran ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            <div
              className={`bg-white rounded-lg p-6 shadow-sm ${openSections.kehadiran ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                {akademikData.map((_, idx) => (
                  <div key={idx}>
                    <label className="block text-xs text-gray-500 mb-1">
                      Kehadiran Sem {idx + 1}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={akademikData[idx].kehadiran || ""}
                      onChange={(e) =>
                        handleAkademikChange(idx, "kehadiran", e.target.value)
                      }
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleCalculateAkademik("kehadiran")}
                className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition"
              >
                Hitung Statistik Kehadiran
              </button>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Preview Payload:
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="block text-gray-500">Kehadiran Mean:</span>
                    <span className="font-mono text-black">
                      {calculatedAkademik.kehadiran.mean}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500">
                      Kehadiran Std Dev:
                    </span>
                    <span className="font-mono text-black">
                      {calculatedAkademik.kehadiran.std}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prestasi */}
          <div className="bg-white rounded-lg mt-3 shadow-sm">
            <div className="flex justify-between items-center px-2 py-3 border-b">
              <HeaderSubForm title="Prestasi" />
              <button
                type="button"
                onClick={() => toggleSection("prestasi")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              >
                {openSections.prestasi ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            <div
              className={`bg-white rounded-lg p-6 shadow-sm ${openSections.prestasi ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Punya Prestasi?
                  </label>
                  <select
                    name="is_prestasi"
                    value={formData.is_prestasi}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="1">Ya</option>
                    <option value="0">Tidak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Total Prestasi
                  </label>
                  <input
                    type="number"
                    name="total_prestasi"
                    value={formData.total_prestasi}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Skor Prestasi
                  </label>
                  <input
                    type="number"
                    name="skor_total"
                    value={formData.skor_total}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sosial Ekonomi */}
          <div className="bg-white rounded-lg mt-3 shadow-sm">
            <div className="flex justify-between items-center px-2 py-3 border-b">
              <HeaderSubForm title="Sosial Ekonomi" />
              <button
                type="button"
                onClick={() => toggleSection("sosial")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              >
                {openSections.sosial ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            <div
              className={`bg-white rounded-lg p-6 shadow-sm ${openSections.sosial ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Status UKT
                  </label>
                  <select
                    name="ukt_awal_status"
                    value={formData.ukt_awal_status}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="2">Tepat Waktu</option>
                    <option value="1">Telat</option>
                    <option value="0">Belum Bayar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    KIPK?
                  </label>
                  <select
                    name="is_kipk"
                    value={formData.is_kipk}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="1">Ya</option>
                    <option value="0">Tidak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Non KIPK?
                  </label>
                  <select
                    name="is_non_kipk"
                    value={formData.is_non_kipk}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="1">Ya</option>
                    <option value="0">Tidak</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Gaji Ayah
                  </label>
                  <input
                    type="number"
                    name="PENGHASILAN_AYAH"
                    value={formData.PENGHASILAN_AYAH}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Gaji Ibu
                  </label>
                  <input
                    type="number"
                    name="PENGHASILAN_IBU"
                    value={formData.PENGHASILAN_IBU}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Demografis */}
          <div className="bg-white rounded-lg mt-3 shadow-sm">
            <div className="flex justify-between items-center px-2 py-3 border-b">
              <HeaderSubForm title="Data Demografis" />
              <button
                type="button"
                onClick={() => toggleSection("demografis")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              >
                {openSections.demografis ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            <div
              className={`bg-white rounded-lg p-6 shadow-sm ${openSections.demografis ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Status Jenjang
                  </label>
                  <select
                    name="is_STR"
                    value={formData.is_STR}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="1">Sarjana Terapan</option>
                    <option value="0">Diploma 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    name="is_laki"
                    value={formData.is_laki}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="1">Laki-laki</option>
                    <option value="0">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitPrediction}
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold py-3 px-8 rounded-lg shadow-md transition`}
            >
              {isLoading ? "Memproses..." : "Submit Prediksi"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
