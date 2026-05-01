import { Text, View } from 'react-native';

export type InternetBankingId = 'blu' | 'octo';

export type InternetBankingOption = {
  id: InternetBankingId;
  name: string;
  adminFee: number;
  Logo: React.FC;
};

const BluLogo: React.FC = () => (
  <View
    style={{
      width: 64,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#15B6C9',
        letterSpacing: 0.5,
        lineHeight: 26,
      }}
    >
      blu
    </Text>
  </View>
);

const OctoLogo: React.FC = () => (
  <View
    style={{
      width: 64,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text
        style={{
          fontFamily: 'Poppins_800ExtraBold',
          fontStyle: 'italic',
          fontSize: 16,
          color: '#C8102E',
          letterSpacing: -0.5,
        }}
      >
        OCTO
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins_500Medium',
          fontSize: 9,
          color: '#111827',
          marginLeft: 2,
        }}
      >
        Clicks
      </Text>
    </View>
    <Text
      style={{
        fontFamily: 'Poppins_500Medium',
        fontSize: 6,
        color: '#6B7280',
        marginTop: -1,
        letterSpacing: 0.3,
      }}
    >
      BY CIMB NIAGA
    </Text>
  </View>
);

export const INTERNET_BANKING: Record<InternetBankingId, InternetBankingOption> = {
  blu: {
    id: 'blu',
    name: 'Blu BCA',
    adminFee: 3165,
    Logo: BluLogo,
  },
  octo: {
    id: 'octo',
    name: 'Octo Clicks',
    adminFee: 4000,
    Logo: OctoLogo,
  },
};

export const INTERNET_BANKING_LIST: InternetBankingOption[] = [
  INTERNET_BANKING.blu,
  INTERNET_BANKING.octo,
];
