import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

export default function KadepKelasPage() {
  return (
    <div>
      <Breadcrumb
        title="Kelas Perkuliahan"
        breadcrumbItems={[{ name: "Kelas", url: "/kadep/kelas" }]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring seluruh kelas perkuliahan dalam departemen Anda
      </p>
      <div className="mt-4">
        <AcademicListFeature kind="kelas" basePath="/kadep" />
      </div>
    </div>
  );
}
