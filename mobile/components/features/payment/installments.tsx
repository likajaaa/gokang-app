import { Text, View } from 'react-native';

export type InstallmentId = 'kredivo' | 'indodana';

export type Installment = {
  id: InstallmentId;
  name: string;
  adminFee: number;
  hasTerms: boolean;
  Logo: React.FC;
};

const KredivoLogo: React.FC = () => (
  <View
    style={{
      width: 64,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Stylized "K" */}
    <View style={{ width: 16, height: 22, marginRight: 2 }}>
      {/* Vertical bar */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 3.5,
          height: 22,
          backgroundColor: '#0F9CDF',
          borderRadius: 1,
        }}
      />
      {/* Upper arm - blue diagonal */}
      <View
        style={{
          position: 'absolute',
          left: 3,
          top: 3,
          width: 14,
          height: 3,
          backgroundColor: '#0F9CDF',
          transform: [{ rotate: '-35deg' }],
          borderRadius: 1,
        }}
      />
      {/* Lower arm - orange diagonal */}
      <View
        style={{
          position: 'absolute',
          left: 3,
          top: 14,
          width: 14,
          height: 3,
          backgroundColor: '#F26522',
          transform: [{ rotate: '35deg' }],
          borderRadius: 1,
        }}
      />
    </View>
    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: '#0F9CDF' }}>
      redivo
    </Text>
  </View>
);

const IndodanaLogo: React.FC = () => (
  <View
    style={{
      width: 64,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* Three stacked colored bars - tapered */}
      <View style={{ marginRight: 3, width: 11, alignItems: 'flex-start' }}>
        <View
          style={{
            width: 11,
            height: 4,
            backgroundColor: '#10B981',
            borderRadius: 1,
            marginBottom: 1.5,
          }}
        />
        <View
          style={{
            width: 8,
            height: 4,
            backgroundColor: '#FACC15',
            borderRadius: 1,
            marginBottom: 1.5,
          }}
        />
        <View
          style={{
            width: 5,
            height: 4,
            backgroundColor: '#EF4444',
            borderRadius: 1,
          }}
        />
      </View>
      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 12, color: '#111827' }}>
        indodana
      </Text>
    </View>
    <Text
      style={{
        fontFamily: 'Poppins_500Medium',
        fontSize: 8,
        color: '#6B7280',
        marginTop: -1,
        alignSelf: 'flex-end',
      }}
    >
      PayLater
    </Text>
  </View>
);

export const INSTALLMENTS: Record<InstallmentId, Installment> = {
  kredivo: {
    id: 'kredivo',
    name: 'KREDIVO',
    adminFee: 2615,
    hasTerms: true,
    Logo: KredivoLogo,
  },
  indodana: {
    id: 'indodana',
    name: 'Indodana',
    adminFee: 1123,
    hasTerms: false,
    Logo: IndodanaLogo,
  },
};

export const INSTALLMENT_LIST: Installment[] = [INSTALLMENTS.kredivo, INSTALLMENTS.indodana];
