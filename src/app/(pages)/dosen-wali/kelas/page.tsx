import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

export default function DosenWaliKelasPage() {
  return (
    <div>
      <Breadcrumb
        title="Kelas Wali"
        breadcrumbItems={[{ name: "Kelas", url: "/dosen-wali/kelas" }]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa kelas yang Anda wali
      </p>
      <div className="mt-4">
        <AcademicListFeature kind="kelas" basePath="/dosen-wali" />
      </div>
    </div>
  );
}
