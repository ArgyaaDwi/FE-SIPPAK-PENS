import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface KadepProdiKelasPageProps {
  params: Promise<{
    prodiId: string;
  }>;
}

export default async function KadepProdiKelasPage({
  params,
}: KadepProdiKelasPageProps) {
  const { prodiId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Kelas Program Studi"
        breadcrumbItems={[
          { name: "Program Studi", url: "/kadep/major" },
          { name: "Kelas", url: `/kadep/major/${prodiId}/kelas` },
        ]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa kelas pada program studi terpilih
      </p>
      <div className="mt-4">
        <AcademicListFeature
          kind="kelas"
          basePath="/kadep"
          prodiId={prodiId}
        />
      </div>
    </div>
  );
}
