"use client";

type StudentStat = {
  nama: string;
  nrp: number;
  jenis_kelamin: string;
  current_ipk: number;
  prediction_status: string;
};

const dummyStudents: StudentStat[] = [
  {
    nama: "Argya Dwi Ferdinand Putra",
    nrp: 3125640013,
    jenis_kelamin: "Laki-laki",
    current_ipk: 3.8,
    prediction_status: "Tinggi",
  },
  {
    nama: "Cut Ardelia Chiquita",
    nrp: 3493640007,
    jenis_kelamin: "Perempuan",
    current_ipk: 3.7,
    prediction_status: "Tinggi",
  },
  {
    nama: "Saviq Isnu Balkhi",
    nrp: 3122940001,
    jenis_kelamin: "Laki-laki",
    current_ipk: 3.5,
    prediction_status: "Sedang",
  },
  {
    nama: "Nadiva Imbi Maharani",
    nrp: 3129640001,
    jenis_kelamin: "Perempuan",
    current_ipk: 3.5,
    prediction_status: "Sedang",
  },
  {
    nama: "Yudhistira Surya Ristyanto",
    nrp: 3125640031,
    jenis_kelamin: "Laki-laki",
    current_ipk: 3.4,
    prediction_status: "Sedang",
  },
];

export default function LatestStudents() {
  return (
    <div className="overflow-x-auto border rounded-lg mt-1">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">NRP</th>
            <th className="px-4 py-3">Jenis Kelamin</th>
            <th className="px-4 py-3">IPS Saat Ini</th>
            <th className="px-4 py-3">Status Prediksi</th>
          </tr>
        </thead>

        <tbody>
          {dummyStudents.map((item, index) => (
            <tr key={item.nrp} className=" hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium text-gray-800">
                {item.nama}
              </td>
              <td className="px-4 py-2">{item.nrp}</td>
              <td className="px-4 py-2">{item.jenis_kelamin}</td>
              <td className="px-4 py-2">{item.current_ipk}</td>
              <td className="px-4 py-2">{item.prediction_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
