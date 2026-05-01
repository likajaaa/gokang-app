export type SearchCategory = 'borongan' | 'tukang_harian' | 'perbaikan';

export type SearchResult = {
  id: string;
  name: string;
  description: string;
  category: SearchCategory;
  icon: string;
  color: string;
};

export const SEARCHABLE_SERVICES: SearchResult[] = [
  // Borongan
  {
    id: 'b1',
    name: 'Borongan Rumah',
    description: 'Survey + Jasa + Material + Pengawasan untuk rumah',
    category: 'borongan',
    icon: '🏡',
    color: '#FEE2E2',
  },
  {
    id: 'b2',
    name: 'Borongan Bisnis',
    description: 'Survey + Jasa + Material + Pengawasan untuk bisnis',
    category: 'borongan',
    icon: '🏢',
    color: '#DBEAFE',
  },

  // Tukang Harian
  {
    id: 't1',
    name: 'Jagoan Cat',
    description: 'Bantu membuang cat lama, melakukan cat dasar dan finishing',
    category: 'tukang_harian',
    icon: '🎨',
    color: '#FEE2E2',
  },
  {
    id: 't2',
    name: 'Jagoan Keramik',
    description: 'Ahli bongkar pasang keramik dan porselen lantai maupun dinding',
    category: 'tukang_harian',
    icon: '🔶',
    color: '#FEF3C7',
  },
  {
    id: 't3',
    name: 'Jagoan Listrik',
    description: 'Siap bantu instalasi listrik, stop kontak, fitting lampu',
    category: 'tukang_harian',
    icon: '⚡',
    color: '#DCFCE7',
  },
  {
    id: 't4',
    name: 'Jagoan Pipa',
    description: 'Perbaiki pipa bocor, saluran pipa macet, air bersih dan kotor',
    category: 'tukang_harian',
    icon: '💧',
    color: '#DBEAFE',
  },
  {
    id: 't5',
    name: 'Jagoan Batu',
    description: 'Selesaikan pekerjaan dinding, tembok, batu alam dan conblock',
    category: 'tukang_harian',
    icon: '🔨',
    color: '#FEE2E2',
  },
  {
    id: 't6',
    name: 'Jagoan Waterproofing',
    description: 'Ahli atasi bocor dan waterproofing rumah',
    category: 'tukang_harian',
    icon: '🛡️',
    color: '#DBEAFE',
  },
  {
    id: 't7',
    name: 'Jagoan Genteng',
    description: 'Tukang ahli masalah genteng dan atap rumah',
    category: 'tukang_harian',
    icon: '🏠',
    color: '#FEF3C7',
  },
  {
    id: 't8',
    name: 'Jagoan Plafon',
    description: 'Selesaikan masalah plafon rusak, berlumut dan roboh',
    category: 'tukang_harian',
    icon: '📐',
    color: '#DBEAFE',
  },
  {
    id: 't9',
    name: 'Jagoan Sanitair',
    description: 'Pasang wastafel, kloset, keran air, shower dan sanitair lain',
    category: 'tukang_harian',
    icon: '🚽',
    color: '#DCFCE7',
  },
  {
    id: 't10',
    name: 'Jagoan AC',
    description: 'Service AC, perbaikan dan perawatan unit AC',
    category: 'tukang_harian',
    icon: '❄️',
    color: '#DBEAFE',
  },
  {
    id: 't11',
    name: 'Jagoan Besi (Las)',
    description: 'Ahlinya permasalahan ngelas besi untuk rumah',
    category: 'tukang_harian',
    icon: '🔩',
    color: '#F3F4F6',
  },
  {
    id: 't12',
    name: 'Jagoan Aluminium',
    description: 'Tenaga ahli untuk pekerjaan aksesoris pintu dan jendela',
    category: 'tukang_harian',
    icon: '🪟',
    color: '#EDE9FE',
  },
  {
    id: 't13',
    name: 'Kenek (Asisten Jagoan)',
    description: 'Asisten tukang agar pekerjaan lebih cepat selesai',
    category: 'tukang_harian',
    icon: '👷',
    color: '#FEF3C7',
  },

  // Perbaikan + Material
  {
    id: 'p1',
    name: 'Kebocoran',
    description: 'Jaga rumah bebas bocor dari atap maupun dinding',
    category: 'perbaikan',
    icon: '💧',
    color: '#DBEAFE',
  },
  {
    id: 'p2',
    name: 'Cuci Toren',
    description: 'Toren kotor jadi bersih, air jadi mengalir lancar',
    category: 'perbaikan',
    icon: '🪣',
    color: '#FEF3C7',
  },
  {
    id: 'p3',
    name: 'Cat Rumah',
    description: 'Warnai rumahmu dengan cat pilihan terbaik',
    category: 'perbaikan',
    icon: '🎨',
    color: '#FEE2E2',
  },
  {
    id: 'p4',
    name: 'Pasang Keramik',
    description: 'Percantik lantai dan dinding rumahmu',
    category: 'perbaikan',
    icon: '🔶',
    color: '#FEF3C7',
  },
  {
    id: 'p5',
    name: 'Perbaikan Listrik',
    description: 'Rumah terang, hati senang dengan listrik beres',
    category: 'perbaikan',
    icon: '⚡',
    color: '#DCFCE7',
  },
  {
    id: 'p6',
    name: 'Perbaikan Pipa',
    description: 'Air mengalir lancar tanpa hambatan',
    category: 'perbaikan',
    icon: '🔧',
    color: '#DBEAFE',
  },
  {
    id: 'p7',
    name: 'Perbaikan Toilet',
    description: 'Kamar mandi bersih dan nyaman kembali',
    category: 'perbaikan',
    icon: '🚽',
    color: '#DCFCE7',
  },
  {
    id: 'p8',
    name: 'Perbaikan Plafon',
    description: 'Kebutuhan langit-langit rumahmu beres',
    category: 'perbaikan',
    icon: '📐',
    color: '#DBEAFE',
  },
  {
    id: 'p9',
    name: 'Perbaikan Atap',
    description: 'Atap pelindung rumahmu kuat kembali',
    category: 'perbaikan',
    icon: '🏠',
    color: '#FEF3C7',
  },
  {
    id: 'p10',
    name: 'Pintu dan Jendela',
    description: 'Kreasi aksesoris pintu dan jendela rumahmu',
    category: 'perbaikan',
    icon: '🚪',
    color: '#EDE9FE',
  },
];
