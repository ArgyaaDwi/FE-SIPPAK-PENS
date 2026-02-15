"use client";

type MajorStat = {
  prodi: string;
  tinggi: number;
  sedang: number;
  rendah: number;
};

const dummyMajors: MajorStat[] = [
  {
    prodi: "D3 Teknik Informatika",
    tinggi: 42,
    sedang: 61,
    rendah: 29,
  },
  {
    prodi: "D3 Teknik Elektronika",
    tinggi: 31,
    sedang: 45,
    rendah: 18,
  },
  {
    prodi: "D4 Teknik Informatika",
    tinggi: 28,
    sedang: 34,
    rendah: 12,
  },
  {
    prodi: "D4 Teknik Telekomunikasi",
    tinggi: 36,
    sedang: 41,
    rendah: 9,
  },
  {
    prodi: "D4 Teknik Komputer",
    tinggi: 48,
    sedang: 39,
    rendah: 14,
  },
];

export default function LatestMajors() {
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
          {dummyMajors.map((item, index) => (
            <tr key={item.prodi} className=" hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium text-gray-800">
                {item.prodi}
              </td>
              <td className="px-4 py-2">{item.tinggi}</td>
              <td className="px-4 py-2">{item.sedang}</td>
              <td className="px-4 py-2">{item.rendah}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
