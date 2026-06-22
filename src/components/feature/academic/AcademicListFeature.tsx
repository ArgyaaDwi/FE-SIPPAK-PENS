"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import CardChart from "@/components/fragment/CardChart";
import { formatPredictionStatusLabel } from "@/lib/utils";

type AcademicListKind = "prodi" | "kelas" | "mahasiswa";
type StatusFilter = "all" | "tinggi" | "sedang" | "rendah" | "unknown";

type Performance = {
  tinggi: number;
  sedang: number;
  rendah: number;
  unknown: number;
};

type ProdiItem = {
  id: number;
  nama: string;
  departemen?: {
    id: number;
    nama: string;
  };
  totalKelas: number;
  totalMahasiswa: number;
  performance: Performance;
};

type KelasItem = {
  id: number;
  nama: string;
  angkatan: number;
  prodi?: {
    id: number;
    nama: string;
  };
  totalMahasiswa: number;
  performance: Performance;
};

type MahasiswaItem = {
  id: string;
  nama: string;
  angkatan: number;
  kelas?: {
    id: number;
    nama: string;
    angkatan: number;
    prodi?: {
      id: number;
      nama: string;
    };
  };
  latestPrediction?: {
    status: string;
    output: string;
    createdAt: string;
  } | null;
};

type AcademicItem = ProdiItem | KelasItem | MahasiswaItem;

const pageSizeOptions = [5, 10, 25, 50];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "tinggi", label: "Tinggi" },
  { value: "sedang", label: "Sedang" },
  { value: "rendah", label: "Rendah" },
  { value: "unknown", label: "Belum Ada" },
];

interface AcademicListFeatureProps {
  kind: AcademicListKind;
  basePath: string;
  prodiId?: string;
  kelasId?: string;
  title?: string;
  subtitle?: string;
}

function buildEndpoint({
  kind,
  prodiId,
  kelasId,
}: Pick<AcademicListFeatureProps, "kind" | "prodiId" | "kelasId">) {
  if (kind === "prodi") {
    return "/api/v1/academic/prodi";
  }

  if (kind === "kelas") {
    const query = prodiId ? `?prodi_id=${prodiId}` : "";
    return `/api/v1/academic/kelas${query}`;
  }

  const query = kelasId ? `?kelas_id=${kelasId}` : "";
  return `/api/v1/academic/mahasiswa${query}`;
}

// function getDefaultSubtitle(kind: AcademicListKind) {
//   if (kind === "prodi") return "Monitoring performa akademik per program studi";
//   if (kind === "kelas") return "Monitoring performa akademik per kelas";
//   return "Monitoring performa akademik per mahasiswa";
// }

function getDetailHref(
  item: AcademicItem,
  { kind, basePath }: Pick<AcademicListFeatureProps, "kind" | "basePath">,
) {
  if (kind === "prodi") {
    return `${basePath}/major/${item.id}/kelas`;
  }

  if (kind === "kelas") {
    return `${basePath}/kelas/${item.id}/mahasiswa`;
  }

  return `${basePath}/mahasiswa/${item.id}`;
}

function hasPerformance(item: AcademicItem): item is ProdiItem | KelasItem {
  return "performance" in item;
}

function getItemStatusValue(item: AcademicItem, filter: StatusFilter) {
  if (filter === "all") return true;

  if (hasPerformance(item)) {
    return item.performance[filter] > 0;
  }

  return (item.latestPrediction?.status ?? "unknown") === filter;
}

function getSearchText(item: AcademicItem, kind: AcademicListKind) {
  if (kind === "prodi") {
    const prodi = item as ProdiItem;
    return [prodi.nama, prodi.departemen?.nama].filter(Boolean).join(" ");
  }

  if (kind === "kelas") {
    const kelas = item as KelasItem;
    return [kelas.nama, kelas.angkatan, kelas.prodi?.nama]
      .filter(Boolean)
      .join(" ");
  }

  const mahasiswa = item as MahasiswaItem;
  return [
    mahasiswa.id,
    mahasiswa.nama,
    mahasiswa.angkatan,
    mahasiswa.kelas?.nama,
    mahasiswa.kelas?.angkatan,
    mahasiswa.kelas?.prodi?.nama,
    formatPredictionStatusLabel(mahasiswa.latestPrediction?.status),
  ]
    .filter(Boolean)
    .join(" ");
}

function getFilterPlaceholder(kind: AcademicListKind) {
  if (kind === "prodi") return "Cari program studi ...";
  if (kind === "kelas") return "Cari kelas, angkatan, atau program studi...";
  return "Cari nama, NRP, kelas, atau status...";
}

function formatClassName(item: KelasItem | MahasiswaItem) {
  if ("kelas" in item) {
    return item.kelas ? `${item.kelas.angkatan} ${item.kelas.nama}` : "-";
  }

  return `${item.angkatan} ${item.nama}`;
}

function PerformanceCells({ performance }: { performance: Performance }) {
  return (
    <>
      <td className="px-4 py-2">{performance.tinggi}</td>
      <td className="px-4 py-2">{performance.sedang}</td>
      <td className="px-4 py-2">{performance.rendah}</td>
      <td className="px-4 py-2">{performance.unknown}</td>
    </>
  );
}

function PerformanceSummary({ performance }: { performance: Performance }) {
  return (
    <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
      <span>T: {performance.tinggi}</span>
      <span>S: {performance.sedang}</span>
      <span>R: {performance.rendah}</span>
      <span>BA: {performance.unknown}</span>
    </div>
  );
}

function ProdiRows({
  items,
  basePath,
  startIndex,
}: {
  items: ProdiItem[];
  basePath: string;
  startIndex: number;
}) {
  return items.map((item, index) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="px-4 py-2">{startIndex + index + 1}</td>
      <td className="px-4 py-2 font-medium text-gray-800">{item.nama}</td>
      <td className="px-4 py-2">{item.departemen?.nama ?? "-"}</td>
      <td className="px-4 py-2">{item.totalKelas}</td>
      <td className="px-4 py-2">{item.totalMahasiswa}</td>
      <PerformanceCells performance={item.performance} />
      <td className="px-4 py-2">
        <Link
          href={getDetailHref(item, { kind: "prodi", basePath })}
          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
        >
          Detail <ChevronRight size={14} />
        </Link>
      </td>
    </tr>
  ));
}

function KelasRows({
  items,
  basePath,
  startIndex,
}: {
  items: KelasItem[];
  basePath: string;
  startIndex: number;
}) {
  return items.map((item, index) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="px-4 py-2">{startIndex + index + 1}</td>
      <td className="px-4 py-2 font-medium text-gray-800">
        {formatClassName(item)}
      </td>
      <td className="px-4 py-2">{item.prodi?.nama ?? "-"}</td>
      <td className="px-4 py-2">{item.totalMahasiswa}</td>
      <PerformanceCells performance={item.performance} />
      <td className="px-4 py-2">
        <Link
          href={getDetailHref(item, { kind: "kelas", basePath })}
          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
        >
          Detail <ChevronRight size={14} />
        </Link>
      </td>
    </tr>
  ));
}

function MahasiswaRows({
  items,
  basePath,
  startIndex,
}: {
  items: MahasiswaItem[];
  basePath: string;
  startIndex: number;
}) {
  return items.map((item, index) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="px-4 py-2">{startIndex + index + 1}</td>
      <td className="px-4 py-2 font-medium text-gray-800">{item.nama}</td>
      <td className="px-4 py-2">{item.id}</td>
      <td className="px-4 py-2">{formatClassName(item)}</td>
      <td className="px-4 py-2">{item.kelas?.prodi?.nama ?? "-"}</td>
      <td className="px-4 py-2">
        {formatPredictionStatusLabel(item.latestPrediction?.status)}
      </td>
      <td className="px-4 py-2">
        <Link
          href={getDetailHref(item, { kind: "mahasiswa", basePath })}
          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
        >
          Detail <ChevronRight size={14} />
        </Link>
      </td>
    </tr>
  ));
}

function MobileItemList({
  items,
  kind,
  basePath,
  startIndex,
}: {
  items: AcademicItem[];
  kind: AcademicListKind;
  basePath: string;
  startIndex: number;
}) {
  return (
    <div className="md:hidden space-y-3">
      {items.map((item, index) => {
        if (kind === "prodi") {
          const prodi = item as ProdiItem;

          return (
            <div key={prodi.id} className="border rounded-md p-3 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    No. {startIndex + index + 1}
                  </p>
                  <p className="font-semibold text-gray-900 truncate">
                    {prodi.nama}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {prodi.departemen?.nama ?? "-"}
                  </p>
                </div>
                <Link
                  href={getDetailHref(prodi, { kind, basePath })}
                  className="shrink-0 text-blue-700"
                  aria-label={`Detail ${prodi.nama}`}
                >
                  <ChevronRight size={20} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                <span>Kelas: {prodi.totalKelas}</span>
                <span>Mahasiswa: {prodi.totalMahasiswa}</span>
              </div>
              <div className="mt-3">
                <PerformanceSummary performance={prodi.performance} />
              </div>
            </div>
          );
        }

        if (kind === "kelas") {
          const kelas = item as KelasItem;

          return (
            <div key={kelas.id} className="border rounded-md p-3 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    No. {startIndex + index + 1}
                  </p>
                  <p className="font-semibold text-gray-900 truncate">
                    {formatClassName(kelas)}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {kelas.prodi?.nama ?? "-"}
                  </p>
                </div>
                <Link
                  href={getDetailHref(kelas, { kind, basePath })}
                  className="shrink-0 text-blue-700"
                  aria-label={`Detail ${kelas.nama}`}
                >
                  <ChevronRight size={20} />
                </Link>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Mahasiswa: {kelas.totalMahasiswa}
              </p>
              <div className="mt-3">
                <PerformanceSummary performance={kelas.performance} />
              </div>
            </div>
          );
        }

        const mahasiswa = item as MahasiswaItem;

        return (
          <div key={mahasiswa.id} className="border rounded-md p-3 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  No. {startIndex + index + 1}
                </p>
                <p className="font-semibold text-gray-900 truncate">
                  {mahasiswa.nama}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {mahasiswa.id} - {formatClassName(mahasiswa)}
                </p>
              </div>
              <Link
                href={getDetailHref(mahasiswa, { kind, basePath })}
                className="shrink-0 text-blue-700"
                aria-label={`Detail ${mahasiswa.nama}`}
              >
                <ChevronRight size={20} />
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-gray-600">
              <span>{mahasiswa.kelas?.prodi?.nama ?? "-"}</span>
              <span>
                Prediksi:{" "}
                {formatPredictionStatusLabel(
                  mahasiswa.latestPrediction?.status,
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AcademicListFeature({
  kind,
  basePath,
  prodiId,
  kelasId,
  title,
  subtitle,
}: AcademicListFeatureProps) {
  const [items, setItems] = useState<AcademicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          buildEndpoint({ kind, prodiId, kelasId }),
          {
            credentials: "include",
          },
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Gagal memuat data");
        }

        if (isMounted) {
          setItems(result.data);
          setCurrentPage(1);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Gagal memuat data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [kind, prodiId, kelasId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        getSearchText(item, kind).toLowerCase().includes(normalizedQuery);
      const matchesStatus = getItemStatusValue(item, statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [items, kind, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredItems.length);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const columnCount = kind === "prodi" ? 10 : kind === "kelas" ? 9 : 7;

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <CardChart title={title} subtitle={subtitle}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Show
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            data
          </label>
          <div className="relative w-full max-w-lg ml-auto">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={getFilterPlaceholder(kind)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const isActive = statusFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`rounded-md border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              {kind === "prodi" && (
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Program Studi</th>
                  <th className="px-4 py-3">Departemen</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Mahasiswa</th>
                  <th className="px-4 py-3">Tinggi</th>
                  <th className="px-4 py-3">Sedang</th>
                  <th className="px-4 py-3">Rendah</th>
                  <th className="px-4 py-3">Belum Ada</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              )}
              {kind === "kelas" && (
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Program Studi</th>
                  <th className="px-4 py-3">Mahasiswa</th>
                  <th className="px-4 py-3">Tinggi</th>
                  <th className="px-4 py-3">Sedang</th>
                  <th className="px-4 py-3">Rendah</th>
                  <th className="px-4 py-3">Belum Ada</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              )}
              {kind === "mahasiswa" && (
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">NRP</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Program Studi</th>
                  <th className="px-4 py-3">Prediksi Terakhir</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              )}
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={columnCount} className="px-4 py-8 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <Loader2 size={16} className="animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && error && (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-4 py-8 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!isLoading && !error && filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada data yang cocok.
                  </td>
                </tr>
              )}
              {!isLoading && !error && kind === "prodi" && (
                <ProdiRows
                  items={paginatedItems as ProdiItem[]}
                  basePath={basePath}
                  startIndex={startIndex}
                />
              )}
              {!isLoading && !error && kind === "kelas" && (
                <KelasRows
                  items={paginatedItems as KelasItem[]}
                  basePath={basePath}
                  startIndex={startIndex}
                />
              )}
              {!isLoading && !error && kind === "mahasiswa" && (
                <MahasiswaRows
                  items={paginatedItems as MahasiswaItem[]}
                  basePath={basePath}
                  startIndex={startIndex}
                />
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && !error && filteredItems.length > 0 && (
          <MobileItemList
            items={paginatedItems}
            kind={kind}
            basePath={basePath}
            startIndex={startIndex}
          />
        )}

        {!isLoading && !error && filteredItems.length === 0 && (
          <div className="md:hidden border rounded-md px-4 py-8 text-center text-sm text-gray-500">
            Tidak ada data yang cocok.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan {filteredItems.length === 0 ? 0 : startIndex + 1}-
            {endIndex} dari {filteredItems.length} data
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <span className="text-sm text-gray-600">
              {safeCurrentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </CardChart>
  );
}
