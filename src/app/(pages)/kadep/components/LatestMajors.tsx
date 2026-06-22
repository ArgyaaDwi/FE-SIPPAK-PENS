type MajorStat = {
  prodi: string;
  tinggi: number;
  sedang: number;
  rendah: number;
};

interface LatestMajorsProps {
  majors: MajorStat[];
}

export default function LatestMajors({ majors }: LatestMajorsProps) {
  return (
    <div className="overflow-x-auto border rounded-lg mt-1">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Program Studi</th>
            <th className="px-4 py-3">Performa Tinggi</th>
            <th className="px-4 py-3">Performa Sedang</th>
            <th className="px-4 py-3">Performa Rendah</th>
          </tr>
        </thead>

        <tbody>
          {majors.length > 0 ? (
            majors.map((item, index) => (
              <tr key={item.prodi} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-800">
                  {item.prodi}
                </td>
                <td className="px-4 py-2">{item.tinggi}</td>
                <td className="px-4 py-2">{item.sedang}</td>
                <td className="px-4 py-2">{item.rendah}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                Belum ada data program studi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 
