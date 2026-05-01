import { Text, View } from 'react-native';

export type EwalletId = 'ovo' | 'dana' | 'gopay' | 'qris' | 'shopeepay';

export type Ewallet = {
  id: EwalletId;
  name: string;
  adminFee: number;
  Logo: React.FC;
};

const OvoLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 40,
      backgroundColor: '#4C2A85',
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontFamily: 'Poppins_800ExtraBold',
        fontStyle: 'italic',
        fontSize: 14,
        color: 'white',
      }}
    >
      OVO
    </Text>
  </View>
);

const DanaLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#118EEA',
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 5,
          height: 9,
          borderLeftWidth: 2.5,
          borderTopWidth: 2.5,
          borderBottomWidth: 2.5,
          borderColor: 'white',
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      />
    </View>
    <Text
      style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 13,
        color: '#118EEA',
        letterSpacing: 0.5,
      }}
    >
      DANA
    </Text>
  </View>
);

const GoPayLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2.5,
        borderColor: '#0F9CDF',
        marginRight: 3,
      }}
    />
    <Text
      style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 13,
        color: '#0F9CDF',
      }}
    >
      gopay
    </Text>
  </View>
);

const QrisLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontFamily: 'Poppins_800ExtraBold',
        fontSize: 15,
        color: '#111827',
        letterSpacing: 1,
      }}
    >
      QRIS
    </Text>
  </View>
);

const ShopeePayLogo: React.FC = () => (
  <View
    style={{
      width: 56,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: 14,
        height: 14,
        backgroundColor: '#EE4D2D',
        borderRadius: 3,
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 9, color: 'white' }}>S</Text>
    </View>
    <Text
      style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 10,
        color: '#EE4D2D',
      }}
    >
      ShopeePay
    </Text>
  </View>
);

export const EWALLETS: Record<EwalletId, Ewallet> = {
  ovo: { id: 'ovo', name: 'OVO', adminFee: 1678, Logo: OvoLogo },
  dana: { id: 'dana', name: 'DANA', adminFee: 1178, Logo: DanaLogo },
  gopay: { id: 'gopay', name: 'GoPay', adminFee: 2041, Logo: GoPayLogo },
  qris: { id: 'qris', name: 'QRIS', adminFee: 705, Logo: QrisLogo },
  shopeepay: { id: 'shopeepay', name: 'Shopeepay', adminFee: 2041, Logo: ShopeePayLogo },
};

export const EWALLET_LIST: Ewallet[] = [
  EWALLETS.ovo,
  EWALLETS.dana,
  EWALLETS.gopay,
  EWALLETS.qris,
  EWALLETS.shopeepay,
];
