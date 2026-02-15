"use client";

type ClassStat = {
  prodi: string;
  tinggi: number;
  sedang: number;
  rendah: number;
};

const dummyClasses: ClassStat[] = [
  {
    prodi: "1 D3 Teknik Informatika A ",
    tinggi: 42,
    sedang: 16,
    rendah: 9,
  },
  {
    prodi: "2 D3 Teknik Informatika B",
    tinggi: 131,
    sedang: 22,
    rendah: 11,
  },
  {
    prodi: "1 D4 Teknik Informatika A",
    tinggi: 198,
    sedang: 34,
    rendah: 7,
  },
  {
    prodi: "2 D4 Teknik Sains Data Terapan A",
    tinggi: 136,
    sedang: 21,
    rendah: 9,
  },
  {
    prodi: "2 D4 Teknik Informatika B",
    tinggi: 148,
    sedang: 19,
    rendah: 14,
  },
];

export default function LatestClasses() {
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
          {dummyClasses.map((item, index) => (
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
