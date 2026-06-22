import AcademicListFeature from "@/components/feature/academic/AcademicListFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface DosenWaliKelasMahasiswaPageProps {
  params: Promise<{
    kelasId: string;
  }>;
}

export default async function DosenWaliKelasMahasiswaPage({
  params,
}: DosenWaliKelasMahasiswaPageProps) {
  const { kelasId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Mahasiswa Kelas"
        breadcrumbItems={[
          { name: "Kelas", url: "/dosen-wali/kelas" },
          {
            name: "Mahasiswa",
            url: `/dosen-wali/kelas/${kelasId}/mahasiswa`,
          },
        ]}
      />
      <p className="text-gray-600 mt-1">
        Monitoring performa mahasiswa pada kelas terpilih
      </p>
      <div className="mt-4">
        <AcademicListFeature
          kind="mahasiswa"
          basePath="/dosen-wali"
          kelasId={kelasId}
        />
      </div>
    </div>
  );
}
