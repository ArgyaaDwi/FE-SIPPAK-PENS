import AcademicStudentDetailFeature from "@/components/feature/academic/AcademicStudentDetailFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface KaprodiMahasiswaDetailPageProps {
  params: Promise<{
    mahasiswaId: string;
  }>;
}

export default async function KaprodiMahasiswaDetailPage({
  params,
}: KaprodiMahasiswaDetailPageProps) {
  const { mahasiswaId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Detail Mahasiswa"
        breadcrumbItems={[
          { name: "Kelas", url: "/kaprodi/kelas" },
          {
            name: "Detail Mahasiswa",
            url: `/kaprodi/mahasiswa/${mahasiswaId}`,
          },
        ]}
      />
      <div className="mt-4">
        <AcademicStudentDetailFeature mahasiswaId={mahasiswaId} />
      </div>
    </div>
  );
}
