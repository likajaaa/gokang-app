const DEFAULT_WARNING =
  'Pastikan pekerjaan sesuai ruang lingkup layanan. Material khusus akan dihitung setelah survey jika diperlukan.';

export const SOLUTION_WARNINGS: Record<string, string> = {
  Kebocoran: 'Layanan untuk perbaikan titik bocor ringan. Perbaikan struktur besar butuh survey khusus.',
  'Cuci Toren': 'Khusus pembersihan toren. Ganti toren baru tidak termasuk.',
  Cat: 'Meliputi cat dinding, plafon, kusen. Tidak termasuk waterproofing dan perbaikan struktur.',
  Keramik: 'Bongkar pasang keramik lantai/dinding. Perbaikan struktur lantai tidak termasuk.',
  Listrik: 'Perbaikan instalasi ringan. Perubahan daya atau instalasi baru butuh survey.',
  Pipa: 'Perbaikan pipa bocor/tersumbat. Instalasi pompa besar atau sumur tidak termasuk.',
  Toilet: 'Pasang/ganti kloset, keran, shower. Renovasi kamar mandi total butuh survey.',
  'Dinding/Tembok': 'Plester, aci, cat dinding. Bongkar tembok struktural butuh survey.',
  Plafon: 'Perbaikan plafon rusak/bocor. Ganti rangka atap tidak termasuk.',
  'Atap/Dak Beton': 'Perbaikan bocor atap/dak. Cor dak baru butuh survey khusus.',
  'Pintu/Jendela': 'Aksesoris pintu/jendela. Ganti unit baru butuh survey material.',
  'Jasa Angkat': 'Pindah barang dalam satu lokasi. Pindahan antarkota tidak termasuk.',
  Dapur: 'Perbaikan kabinet, meja dapur. Pasang kitchen set baru butuh survey.',
  'Aluminium Aksesoris': 'Pasang aksesoris. Ganti kusen aluminium besar butuh survey material.',
  Conblock: 'Pasang/perbaiki conblock pekarangan. Cor total pekarangan butuh survey.',
  'Kipas Angin': 'Pasang/perbaiki kipas. Pembelian unit baru tidak termasuk.',
  'Exhaust Fan': 'Pasang/perbaiki exhaust fan. Pembelian unit baru tidak termasuk.',
  Lemari: 'Pasang/perbaiki lemari. Pembuatan lemari custom butuh survey.',
  'Batu Alam': 'Pasang batu alam dinding. Material bisa ditambahkan setelah survey.',
  'Tangki Air (Bawah Tanah)':
    'Perbaikan tangki bawah tanah. Pembuatan tangki baru butuh survey struktural.',
  'Tangki Air': 'Pasang tangki atas. Pembelian unit baru tidak termasuk.',
  Kanopi: 'Pasang/perbaiki kanopi. Pembuatan kanopi custom butuh survey material.',
  'Water Heater': 'Pasang/perbaiki water heater. Pembelian unit baru tidak termasuk.',
  Lantai: 'Perbaikan/ganti lantai. Bongkar total lantai butuh survey.',
};

export function getSolutionWarning(name: string): string {
  return SOLUTION_WARNINGS[name] ?? DEFAULT_WARNING;
}
