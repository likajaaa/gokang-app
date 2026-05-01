import { Text, View } from 'react-native';

export type BankId = 'bca' | 'mandiri' | 'bri' | 'bni' | 'permata';

export type InstructionStep = string;

export type InstructionGroup = {
  title: string;
  steps: InstructionStep[];
};

export type BankInstructions = {
  atm: InstructionGroup[];
  mobileBanking: InstructionGroup[];
  internetBanking: InstructionGroup[];
};

export type Bank = {
  id: BankId;
  name: string;
  Logo: React.FC;
  instructions: BankInstructions;
};

const BcaLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 36,
      borderRadius: 6,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontFamily: 'Poppins_800ExtraBold',
        fontStyle: 'italic',
        fontSize: 16,
        color: '#0060AF',
        letterSpacing: -0.5,
      }}
    >
      BCA
    </Text>
  </View>
);

const MandiriLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 13,
        color: '#003D79',
        letterSpacing: -0.3,
      }}
    >
      mandiri
    </Text>
    <View
      style={{
        width: 28,
        height: 3,
        backgroundColor: '#FFC726',
        marginTop: 1,
        borderRadius: 1,
      }}
    />
  </View>
);

const BriLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 36,
      borderRadius: 6,
      backgroundColor: '#003D79',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    }}
  >
    <Text
      style={{
        fontFamily: 'Poppins_800ExtraBold',
        fontSize: 10,
        color: 'white',
      }}
    >
      BANK BRI
    </Text>
  </View>
);

const BniLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 36,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: 14,
        height: 22,
        backgroundColor: '#F26522',
        marginRight: 2,
        borderRadius: 2,
      }}
    />
    <Text
      style={{
        fontFamily: 'Poppins_800ExtraBold',
        fontSize: 16,
        color: '#006B68',
      }}
    >
      BNI
    </Text>
  </View>
);

const PermataLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text style={{ fontSize: 18 }}>🔻</Text>
    <Text
      style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 9,
        color: '#1E2D4F',
        marginTop: -2,
      }}
    >
      PermataBank
    </Text>
  </View>
);

const TRANSAKSI_BERHASIL: InstructionGroup = {
  title: 'LANGKAH 3: TRANSAKSI BERHASIL',
  steps: [
    'Transaksi Anda telah selesai',
    'Setelah transaksi anda selesai, invoice ini akan diupdate secara otomatis. Proses ini mungkin memakan waktu hingga 5 menit',
  ],
};

export const BANKS: Record<BankId, Bank> = {
  bca: {
    id: 'bca',
    name: 'BCA VIRTUAL ACCOUNT',
    Logo: BcaLogo,
    instructions: {
      atm: [
        {
          title: 'LANGKAH 1: MASUK KE MENU TRANSFER',
          steps: [
            'Masukkan kartu ATM dan PIN BCA Anda',
            'Pilih menu "Transaksi Lainnya" > "Transfer" > "Ke Rek BCA Virtual Account"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan Nomor Virtual Account contoh: 700701598xxxxxxx',
            'Pilih "Benar" lalu konfirmasi pembayaran',
            'Simpan struk sebagai bukti pembayaran',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      mobileBanking: [
        {
          title: 'LANGKAH 1: MASUK KE AKUN ANDA',
          steps: [
            'Buka aplikasi BCA Mobile',
            'Pilih menu "m-BCA", kemudian masukkan kode akses m-BCA',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Pilih "Transaction" lalu pilih "m-Transfer", kemudian pilih "BCA Virtual Account"',
            'Masukkan Nomor Virtual Account anda contoh: 12248XXXXXXXXXXX, kemudian tekan "OK"',
            'Tekan tombol "Kirim" yang berada di sudut kanan atas aplikasi untuk melakukan transfer',
            'Tekan "OK" untuk melanjutkan pembayaran',
            'Masukkan PIN Anda untuk meng-otorisasi transaksi',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      internetBanking: [
        {
          title: 'LANGKAH 1: MASUK KE AKUN ANDA',
          steps: [
            'Lakukan log in pada aplikasi KlikBCA Individual https://ibank.klikbca.com',
            'Masukkan User ID dan PIN',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Pilih "Transfer Dana", kemudian pilih "Transfer ke BCA Virtual Account"',
            'Masukkan Nomor Virtual Account contoh: 700701598xxxxxxx',
            'Pilih "Lanjutkan"',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
    },
  },
  mandiri: {
    id: 'mandiri',
    name: 'MANDIRI VIRTUAL ACCOUNT',
    Logo: MandiriLogo,
    instructions: {
      atm: [
        {
          title: 'LANGKAH 1: MASUK KE MENU BAYAR/BELI',
          steps: [
            'Masukkan kartu ATM dan PIN Mandiri Anda',
            'Pilih menu "Bayar/Beli" > "Multipayment"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan kode perusahaan "88608" lalu tekan "Benar"',
            'Masukkan Nomor Virtual Account contoh: 88608xxxxxxxxx',
            'Konfirmasi data lalu pilih "Ya"',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      mobileBanking: [
        {
          title: 'LANGKAH 1: BUKA APLIKASI LIVIN\' BY MANDIRI',
          steps: [
            'Login ke aplikasi Livin\' by Mandiri',
            'Pilih menu "Bayar"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Pilih "Buat Pembayaran Baru"',
            'Cari "Midtrans" pada daftar penyedia jasa',
            'Masukkan Nomor Virtual Account contoh: 88608xxxxxxxxx',
            'Cek detail pembayaran lalu pilih "Lanjut"',
            'Masukkan MPIN Anda untuk konfirmasi',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      internetBanking: [
        {
          title: 'LANGKAH 1: MASUK KE AKUN ANDA',
          steps: [
            'Login pada https://ibank.bankmandiri.co.id',
            'Masukkan User ID dan Password',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Pilih menu "Pembayaran" > "Multi Payment"',
            'Pilih "Midtrans" sebagai penyedia jasa',
            'Masukkan Nomor Virtual Account contoh: 88608xxxxxxxxx',
            'Konfirmasi pembayaran dan masukkan token',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
    },
  },
  bri: {
    id: 'bri',
    name: 'BRI VIRTUAL ACCOUNT',
    Logo: BriLogo,
    instructions: {
      atm: [
        {
          title: 'LANGKAH 1: MASUK KE MENU TRANSAKSI',
          steps: [
            'Masukkan kartu ATM dan PIN BRI Anda',
            'Pilih "Transaksi Lain" > "Pembayaran" > "Lainnya" > "BRIVA"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan Nomor BRIVA contoh: 26215xxxxxxxxx',
            'Konfirmasi data dan pilih "Ya"',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      mobileBanking: [
        {
          title: 'LANGKAH 1: BUKA APLIKASI BRIMO',
          steps: [
            'Login ke aplikasi BRImo',
            'Pilih menu "Pembayaran" > "BRIVA"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan Nomor BRIVA contoh: 26215xxxxxxxxx',
            'Konfirmasi data pembayaran',
            'Masukkan PIN BRImo untuk meng-otorisasi transaksi',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      internetBanking: [
        {
          title: 'LANGKAH 1: MASUK KE AKUN ANDA',
          steps: [
            'Login pada https://ib.bri.co.id',
            'Masukkan User ID dan Password',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Pilih menu "Pembayaran" > "BRIVA"',
            'Masukkan Nomor BRIVA contoh: 26215xxxxxxxxx',
            'Konfirmasi pembayaran dan masukkan password mToken',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
    },
  },
  bni: {
    id: 'bni',
    name: 'BNI VIRTUAL ACCOUNT',
    Logo: BniLogo,
    instructions: {
      atm: [
        {
          title: 'LANGKAH 1: MASUK KE MENU TRANSFER',
          steps: [
            'Masukkan kartu ATM dan PIN BNI Anda',
            'Pilih "Menu Lain" > "Transfer" > "Virtual Account Billing"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan Nomor Virtual Account contoh: 9888xxxxxxxxx',
            'Konfirmasi data dan pilih "Ya"',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      mobileBanking: [
        {
          title: 'LANGKAH 1: BUKA APLIKASI BNI MOBILE',
          steps: [
            'Login ke aplikasi BNI Mobile Banking',
            'Pilih menu "Transfer" > "Virtual Account Billing"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan Nomor Virtual Account contoh: 9888xxxxxxxxx',
            'Konfirmasi data dan pilih "Lanjut"',
            'Masukkan password transaksi untuk meng-otorisasi pembayaran',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      internetBanking: [
        {
          title: 'LANGKAH 1: MASUK KE AKUN ANDA',
          steps: [
            'Login pada https://ibank.bni.co.id',
            'Masukkan User ID dan Password',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Pilih "Transfer" > "Virtual Account Billing"',
            'Masukkan Nomor Virtual Account contoh: 9888xxxxxxxxx',
            'Konfirmasi pembayaran dan masukkan kode otentikasi',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
    },
  },
  permata: {
    id: 'permata',
    name: 'PERMATA VIRTUAL ACCOUNT',
    Logo: PermataLogo,
    instructions: {
      atm: [
        {
          title: 'LANGKAH 1: MASUK KE MENU TRANSAKSI',
          steps: [
            'Masukkan kartu ATM dan PIN Permata Anda',
            'Pilih "Transaksi Lain" > "Pembayaran" > "Pembayaran Lain" > "Virtual Account"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan Nomor Virtual Account contoh: 8625xxxxxxxxx',
            'Konfirmasi data dan pilih "Benar"',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      mobileBanking: [
        {
          title: 'LANGKAH 1: BUKA APLIKASI PERMATAMOBILEX',
          steps: [
            'Login ke aplikasi PermataMobileX',
            'Pilih menu "Pembayaran Tagihan" > "Virtual Account"',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Masukkan Nomor Virtual Account contoh: 8625xxxxxxxxx',
            'Konfirmasi data dan masukkan token untuk otentikasi',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
      internetBanking: [
        {
          title: 'LANGKAH 1: MASUK KE AKUN ANDA',
          steps: [
            'Login pada https://www.permatanet.com',
            'Masukkan User ID dan Password',
          ],
        },
        {
          title: 'LANGKAH 2: DETAIL PEMBAYARAN',
          steps: [
            'Pilih "Pembayaran" > "Pembayaran Tagihan" > "Virtual Account"',
            'Masukkan Nomor Virtual Account contoh: 8625xxxxxxxxx',
            'Konfirmasi pembayaran dan masukkan kode otentikasi',
          ],
        },
        TRANSAKSI_BERHASIL,
      ],
    },
  },
};

export const BANK_LIST: Bank[] = [
  BANKS.bca,
  BANKS.mandiri,
  BANKS.bri,
  BANKS.bni,
  BANKS.permata,
];
