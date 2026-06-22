import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface KadepKelasMahasiswaPageProps {
  params: Promise<{
    kelasId: string;
  }>;
}

export default async function KadepKelasMahasiswaPage({
  params,
}: KadepKelasMahasiswaPageProps) {
  const { kelasId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Mahasiswa Kelas"
        breadcrumbItems={[
          { name: "Program Studi", url: "/kadep/major" },
          { name: "Mahasiswa", url: `/kadep/kelas/${kelasId}/mahasiswa` },
        ]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa mahasiswa pada kelas terpilih
      </p>
      <div className="mt-4">
        <AcademicListFeature
          kind="mahasiswa"
          basePath="/kadep"
          kelasId={kelasId}
        />
      </div>
    </div>
  );
}
