export type Role = "KADEP" | "KAPRODI" | "DOSEN_WALI" | "WALI_MURID";

export interface User {
  id: number;
  nama: string;
  email: string;
  role: Role;
  created_at: Date | string;
  deleted: boolean;

  // Relasi (Opsional)
  departemenDipimpin?: Departemen | null;
  prodiDipimpin?: Prodi | null;
  kelasWali?: Kelas[];
  anak?: Mahasiswa[];
  prediksiDibuat?: Prediksi[];
}

export interface Departemen {
  id: number;
  nama: string;
  kadep_id?: number | null;
  created_at: Date | string;
  deleted: boolean;

  // Relasi (Opsional)
  kadep?: User | null;
  prodi?: Prodi[];
}

export interface Prodi {
  id: number;
  nama: string;
  departemen_id: number;
  kaprodi_id?: number | null;
  created_at: Date | string;
  deleted: boolean;

  // Relasi (Opsional)
  departemen?: Departemen;
  kaprodi?: User | null;
  kelas?: Kelas[];
}

export interface Kelas {
  id: number;
  nama: string;
  angkatan: number;
  prodi_id: number;
  dosen_wali_id?: number | null;
  created_at: Date | string;
  deleted: boolean;

  // Relasi (Opsional)
  prodi?: Prodi;
  dosen_wali?: User | null;
  mahasiswa?: Mahasiswa[];
}

export interface Mahasiswa {
  id: string;
  nama: string;
  angkatan: number;
  actual_ipk?: number | null;
  actual_category_ipk?: string | null;
  kelas_id: number;
  wali_id?: number | null;
  created_at: Date | string;
  deleted: boolean;

  // Relasi (Opsional)
  kelas?: Kelas;
  wali_murid?: User | null;
  prediksi?: Prediksi[];
}

export interface Prediksi {
  id: string;
  mahasiswa_id: string;
  created_by: number;
  payload_input: Record<string, any>; // Menggunakan Record untuk tipe Json
  output: string;
  prob_rendah: number;
  prob_sedang: number;
  prob_tinggi: number;
  createdAt: Date | string; // Mengikuti nama 'createdAt' (camelCase) pada skema Anda
  deleted: boolean;

  // Relasi (Opsional)
  mahasiswa?: Mahasiswa;
  created_by_user?: User;
}
