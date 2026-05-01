import { Text, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function ComplaintsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
            flex: 1,
            textAlign: 'center',
            marginRight: 36,
          }}
        >
          Pesanan Dikomplain
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 48 }}>📋</Text>
        <Text
          style={{
            marginTop: 12,
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Belum ada pesanan dikomplain
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            color: '#6B7280',
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          Pesanan yang kamu ajukan komplain akan tampil di sini.
        </Text>
      </View>
    </View>
  );
}
