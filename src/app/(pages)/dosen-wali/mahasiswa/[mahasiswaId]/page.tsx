import AcademicStudentDetailFeature from "@/components/feature/academic/AcademicStudentDetailFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface DosenWaliMahasiswaDetailPageProps {
  params: Promise<{
    mahasiswaId: string;
  }>;
}

export default async function DosenWaliMahasiswaDetailPage({
  params,
}: DosenWaliMahasiswaDetailPageProps) {
  const { mahasiswaId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Detail Mahasiswa"
        breadcrumbItems={[
          { name: "Mahasiswa", url: "/dosen-wali/mahasiswa" },
          {
            name: "Detail Mahasiswa",
            url: `/dosen-wali/mahasiswa/${mahasiswaId}`,
          },
        ]}
      />
      <div className="mt-4">
        <AcademicStudentDetailFeature mahasiswaId={mahasiswaId} />
      </div>
    </div>
  );
}
