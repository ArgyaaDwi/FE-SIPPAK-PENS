{/* <div className="bg-white rounded-lg mt-3 py-2 shadow-sm">
  <HeaderForm title="Form Prediksi" />
  <hr className="mb-3" />
  <div className="px-4">
    <form className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Historis Akademik</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="IPS Mean Awal"
            name="ips_mean_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="IPS Std Awal"
            name="ips_std_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="IPS Trend Awal"
            name="ips_trend_awal"
            className="input"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Teori Mean Awal"
            name="teori_mean_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Teori Std Awal"
            name="teori_std_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Teori Trend Awal"
            name="teori_trend_awal"
            className="input"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Praktikum Mean Awal"
            name="prak_mean_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Praktikum Std Awal"
            name="prak_std_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Praktikum Trend Awal"
            name="prak_trend_awal"
            className="input"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Beban Studi</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="SKS Mean Awal"
            name="sks_target_mean_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="SKS Std Awal"
            name="sks_target_std_awal"
            className="input"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Proporsi MK Tidak Lulus"
            name="prop_mk_tidak_lulus_awal"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Proporsi SKS Tidak Lulus"
            name="prop_sks_tidak_lulus_awal"
            className="input"
          />
          <input
            type="number"
            placeholder="Jumlah Semester MK Tidak Lulus"
            name="count_sem_mk_tidak_lulus_awal"
            className="input"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Kehadiran</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="Kehadiran Mean"
            name="kehadiran_awal_mean"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Kehadiran Std"
            name="kehadiran_awal_std"
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Tren Kehadiran"
            name="tren_kehadiran_awal"
            className="input"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Prestasi</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select name="is_prestasi" className="input">
            <option value="">Punya Prestasi?</option>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>

          <input
            type="number"
            placeholder="Total Prestasi"
            name="total_prestasi"
            className="input"
          />
          <input
            type="number"
            placeholder="Skor Total Prestasi"
            name="skor_total"
            className="input"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Sosial Ekonomi</h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select name="ukt_awal_status" className="input">
            <option value="">Status UKT</option>
            <option value="2">Tepat Waktu</option>
            <option value="1">Telat</option>
            <option value="0">Belum Bayar</option>
          </select>

          <select name="is_kipk" className="input">
            <option value="">Penerima KIP-K?</option>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>

          <select name="is_non_kipk" className="input">
            <option value="">Non KIP-K?</option>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>

          <input
            type="number"
            step="0.01"
            placeholder="Log Penghasilan Orang Tua"
            name="penghasilan_orangtua_log"
            className="input"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Data Demografis</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="is_STR" className="input">
            <option value="">Status Jenjang (STR)</option>
            <option value="1">STR</option>
            <option value="0">Non STR</option>
          </select>

          <select name="is_laki" className="input">
            <option value="">Jenis Kelamin</option>
            <option value="1">Laki-laki</option>
            <option value="0">Perempuan</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simpan Data
        </button>
        <button
          type="button"
          className="w-full sm:w-auto bg-white border border-red-600 font-semibold px-6 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  </div>
</div>;
export default BackupPage; */}
