import AcademicStudentDetailFeature from "@/components/feature/academic/AcademicStudentDetailFeature";
import Breadcrumb from "@/components/fragment/Breadcumb";

interface WaliMuridMahasiswaDetailPageProps {
  params: Promise<{
    mahasiswaId: string;
  }>;
}

export default async function WaliMuridMahasiswaDetailPage({
  params,
}: WaliMuridMahasiswaDetailPageProps) {
  const { mahasiswaId } = await params;

  return (
    <div>
      <Breadcrumb
        title="Detail Anak"
        breadcrumbItems={[
          { name: "Data Anak", url: "/wali-murid/mahasiswa" },
          {
            name: "Detail Anak",
            url: `/wali-murid/mahasiswa/${mahasiswaId}`,
          },
        ]}
      />
      <div className="mt-4">
        <AcademicStudentDetailFeature mahasiswaId={mahasiswaId} />
      </div>
    </div>
  );
}
