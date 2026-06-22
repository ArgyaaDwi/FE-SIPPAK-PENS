import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

export default function KaprodiKelasPage() {
  return (
    <div>
      <Breadcrumb
        title="Kelas Kuliah"
        breadcrumbItems={[{ name: "Kelas", url: "/kaprodi/kelas" }]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa kelas dalam program studi Anda
      </p>
      <div className="mt-4">
        <AcademicListFeature kind="kelas" basePath="/kaprodi" />
      </div>
    </div>
  );
}
