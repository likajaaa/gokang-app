import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

// Diagnostic screen — pure RN, no NativeWind, no Poppins, no dependencies.
// Kalau screen ini muncul setelah tap TEST NAVIGATION, routing layer OK.
export default function TestSimpleScreen() {
  console.log('[TestSimple] render');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        ✅ Routing Works!
      </Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 40, textAlign: 'center' }}>
        Ini test screen sederhana tanpa NativeWind dan tanpa Poppins.
      </Text>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          backgroundColor: '#F97316',
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 25,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Kembali ke Home</Text>
      </TouchableOpacity>
    </View>
  );
}
