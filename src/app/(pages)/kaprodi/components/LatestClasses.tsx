type ClassStat = {
  kelas: string;
  tinggi: number;
  sedang: number;
  rendah: number;
};

interface LatestClassesProps {
  classes: ClassStat[];
}

export default function LatestClasses({ classes }: LatestClassesProps) {
  return (
    <div className="overflow-x-auto border rounded-lg mt-1">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Kelas</th>
            <th className="px-4 py-3">Performa Tinggi</th>
            <th className="px-4 py-3">Performa Sedang</th>
            <th className="px-4 py-3">Performa Rendah</th>
          </tr>
        </thead>

        <tbody>
          {classes.length > 0 ? (
            classes.map((item, index) => (
              <tr key={item.kelas} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-800">
                  {item.kelas}
                </td>
                <td className="px-4 py-2">{item.tinggi}</td>
                <td className="px-4 py-2">{item.sedang}</td>
                <td className="px-4 py-2">{item.rendah}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                Belum ada data kelas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
