import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

export default function DosenWaliMahasiswaPage() {
  return (
    <div>
      <Breadcrumb
        title="Data Mahasiswa"
        breadcrumbItems={[
          { name: "Mahasiswa", url: "/dosen-wali/mahasiswa" },
        ]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring seluruh mahasiswa dalam kelas wali Anda
      </p>
      <div className="mt-4">
        <AcademicListFeature kind="mahasiswa" basePath="/dosen-wali" />
      </div>
    </div>
  );
}
