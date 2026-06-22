type StudentStat = {
  id: string;
  nama: string;
  kelas: string;
  angkatan: number;
  predictionStatus: string;
};

interface LatestStudentsProps {
  students: StudentStat[];
}

export default function LatestStudents({ students }: LatestStudentsProps) {
  return (
    <div className="overflow-x-auto border rounded-lg mt-1">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">NRP</th>
            <th className="px-4 py-3">Kelas</th>
            <th className="px-4 py-3">Angkatan</th>
            <th className="px-4 py-3">Status Prediksi</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-800">
                  {item.nama}
                </td>
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.kelas}</td>
                <td className="px-4 py-2">{item.angkatan}</td>
                <td className="px-4 py-2">{item.predictionStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                Belum ada data mahasiswa.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
