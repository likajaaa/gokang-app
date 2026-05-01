const DEFAULT_WARNING = 'Pastikan pekerjaan sesuai dengan keahlian tukang yang dipilih';

export const SERVICE_WARNINGS: Record<string, string> = {
  'Jagoan Cat': 'Pekerjaan ini tidak termasuk waterproofing dan kebocoran',
  'Jagoan Keramik': 'Pekerjaan ini tidak termasuk perbaikan struktur lantai',
  'Jagoan Listrik':
    'Pekerjaan ini tidak termasuk pemasangan instalasi baru atau perubahan daya listrik',
  'Jagoan Pipa': 'Pekerjaan ini tidak termasuk pembuatan sumur atau instalasi pompa besar',
  'Jagoan Batu': 'Pekerjaan ini tidak termasuk pembangunan struktur beton atau pondasi',
  'Jagoan Waterproofing': 'Pekerjaan ini khusus untuk waterproofing dan anti bocor',
  'Jagoan Genteng': 'Pekerjaan ini tidak termasuk perbaikan rangka atap atau plafon',
  'Jagoan Plafon': 'Pekerjaan ini tidak termasuk perbaikan rangka atap atau genteng',
  'Jagoan Sanitair':
    'Pekerjaan ini tidak termasuk perbaikan pipa air atau saluran pembuangan utama',
  'Jagoan Gali': 'Pekerjaan ini tidak termasuk penggunaan alat berat atau excavator',
  'Jagoan Besi (Las)':
    'Pekerjaan ini tidak termasuk pembuatan struktur baja atau konstruksi besar',
  'Jagoan Angkat': 'Pekerjaan ini tidak termasuk penggunaan crane atau alat berat',
  'Jagoan AC': 'Pekerjaan ini tidak termasuk pembelian unit AC baru atau freon',
  'Jagoan Aluminium Aksesoris': 'Pekerjaan ini tidak termasuk material aluminium dan kaca',
  'Kenek (Ast. Jagoan)':
    'Ini adalah asisten tukang untuk membantu pekerjaan, bukan tukang utama',
  'Jagoan Listrik Perapihan': 'Pekerjaan ini khusus untuk rapikan kabel, bukan instalasi baru',
  'Jagoan Pipa Perapihan': 'Pekerjaan ini khusus untuk rapikan pipa, bukan instalasi baru',
};

export function getServiceWarning(serviceName: string): string {
  return SERVICE_WARNINGS[serviceName] ?? DEFAULT_WARNING;
}
