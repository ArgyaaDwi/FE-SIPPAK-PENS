import AcademicStudentDetailFeature from "@/components/feature/academic/AcademicStudentDetailFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface KadepMahasiswaDetailPageProps {
  params: Promise<{
    mahasiswaId: string;
  }>;
}

export default async function KadepMahasiswaDetailPage({
  params,
}: KadepMahasiswaDetailPageProps) {
  const { mahasiswaId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Detail Mahasiswa"
        breadcrumbItems={[
          { name: "Program Studi", url: "/kadep/major" },
          { name: "Detail Mahasiswa", url: `/kadep/mahasiswa/${mahasiswaId}` },
        ]}
      />
      <div className="mt-4">
        <AcademicStudentDetailFeature mahasiswaId={mahasiswaId} />
      </div>
    </div>
  );
}
