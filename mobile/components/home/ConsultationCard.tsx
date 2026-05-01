import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';

const CS_WHATSAPP_NUMBER = '6281234567890'; // TODO: ganti dengan nomor CS GoKang asli
const CS_MESSAGE = 'Halo, saya mau konsultasi tentang layanan GoKang';

export default function ConsultationCard() {
  const handleChatPress = async () => {
    const nativeUrl = `whatsapp://send?phone=${CS_WHATSAPP_NUMBER}&text=${encodeURIComponent(CS_MESSAGE)}`;
    const webUrl = `https://wa.me/${CS_WHATSAPP_NUMBER}?text=${encodeURIComponent(CS_MESSAGE)}`;

    try {
      const canOpen = await Linking.canOpenURL(nativeUrl);
      await Linking.openURL(canOpen ? nativeUrl : webUrl);
    } catch {
      Alert.alert('Error', 'Tidak bisa membuka WhatsApp');
    }
  };

  return (
    <View
      className="mx-4 mt-6 rounded-2xl border p-5"
      style={{ backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }}
    >
      <View className="mb-4 flex-row items-center">
        {/* Avatar CS + badge online */}
        <View className="relative">
          <View
            className="h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: '#60A5FA' }}
          >
            <Text style={{ fontSize: 26 }}>👤</Text>
          </View>
          <View
            className="absolute bottom-0 right-0 h-4 w-4 rounded-full"
            style={{
              backgroundColor: '#10B981',
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          />
        </View>

        <View className="ml-4 flex-1">
          <Text
            className="text-base text-text-primary"
            style={{ fontFamily: 'Poppins_700Bold' }}
          >
            Ada Pertanyaan? 💬
          </Text>
          <Text
            className="mt-0.5 text-sm text-text-secondary"
            style={{ fontFamily: 'Poppins_400Regular', lineHeight: 20 }}
          >
            Yuk, konsultasi langsung dengan kami!
          </Text>
        </View>
      </View>

      {/* Button Chat Sekarang */}
      <TouchableOpacity
        onPress={handleChatPress}
        activeOpacity={0.8}
        className="items-center justify-center rounded-full bg-white"
        style={{
          height: 44,
          borderWidth: 1.5,
          borderColor: '#F97316',
        }}
      >
        <Text className="text-orange" style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15 }}>
          Chat Sekarang
        </Text>
      </TouchableOpacity>
    </View>
  );
}
