import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

export default function KadepMajorPage() {
  return (
    <div>
      <Breadcrumb
        title="Program Studi"
        breadcrumbItems={[{ name: "Program Studi", url: "/kadep/major" }]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa akademik program studi dalam departemen Anda
      </p>
      <div className="mt-4">
        <AcademicListFeature kind="prodi" basePath="/kadep" />
      </div>
    </div>
  );
}
