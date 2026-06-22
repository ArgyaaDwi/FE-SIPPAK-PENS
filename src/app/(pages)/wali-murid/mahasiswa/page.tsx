import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

export default function WaliMuridMahasiswaPage() {
  return (
    <div>
      <Breadcrumb
        title="Data Anak"
        breadcrumbItems={[{ name: "Data Anak", url: "/wali-murid/mahasiswa" }]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa akademik mahasiswa yang terhubung dengan akun Anda
      </p>
      <div className="mt-4">
        <AcademicListFeature kind="mahasiswa" basePath="/wali-murid" />
      </div>
    </div>
  );
}
