import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface KaprodiKelasMahasiswaPageProps {
  params: Promise<{
    kelasId: string;
  }>;
}

export default async function KaprodiKelasMahasiswaPage({
  params,
}: KaprodiKelasMahasiswaPageProps) {
  const { kelasId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Mahasiswa Kelas"
        breadcrumbItems={[
          { name: "Kelas", url: "/kaprodi/kelas" },
          { name: "Mahasiswa", url: `/kaprodi/kelas/${kelasId}/mahasiswa` },
        ]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa mahasiswa pada kelas terpilih
      </p>
      <div className="mt-4">
        <AcademicListFeature
          kind="mahasiswa"
          basePath="/kaprodi"
          kelasId={kelasId}
        />
      </div>
    </div>
  );
}
