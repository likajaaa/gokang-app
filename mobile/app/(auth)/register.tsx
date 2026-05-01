import { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AuthButton from '../../components/auth/AuthButton';
import AuthInput from '../../components/auth/AuthInput';
import { sendRegisterOtp } from '../../services/api/auth';

function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('0')) return '+62' + digits.substring(1);
  if (digits.startsWith('62')) return '+' + digits;
  return '+62' + digits;
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDaftar = async () => {
    // Validasi
    if (!name || name.trim().length < 3) {
      Alert.alert('Error', 'Nama minimal 3 karakter');
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      Alert.alert('Error', 'Nomor HP tidak valid (minimal 10 digit)');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    const normalizedPhone = normalizePhone(phone);

    setLoading(true);
    try {
      console.log('[Register] Sending OTP to:', normalizedPhone);
      const response = await sendRegisterOtp(normalizedPhone);
      console.log('[Register] OTP sent response:', response.data);

      router.push({
        pathname: '/(auth)/otp',
        params: {
          phone: normalizedPhone,
          mode: 'register',
          name: name.trim(),
          email: email || '',
        },
      });
    } catch (err: any) {
      console.error('[Register] Error:', err.response?.data || err.message);

      const status = err.response?.status;
      const message = err.response?.data?.message || 'Terjadi kesalahan';

      if (status === 409) {
        Alert.alert('Gagal Daftar', 'Nomor HP sudah terdaftar. Silakan masuk.');
      } else if (status === 422) {
        Alert.alert('Gagal Daftar', message);
      } else if (status === 429) {
        Alert.alert('Gagal Daftar', 'Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        Alert.alert('Gagal Daftar', `${message} (${err.message})`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1">
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Back button */}
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-4"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#111827" />
              </TouchableOpacity>

              {/* Logo centered */}
              <View className="mt-4 items-center">
                <Image
                  source={require('../../assets/gokang-light.png')}
                  resizeMode="contain"
                  style={{ width: 200, height: 90 }}
                />
              </View>

              {/* Heading LEFT-aligned */}
              <View className="mt-4 px-6">
                <Text className="text-2xl font-bold text-text-primary">
                  Gabung Dengan GoKang
                </Text>
                <Text className="mt-2 text-sm text-text-secondary">
                  Isi nama dan nomor HP kamu dulu yaa...
                </Text>
              </View>

              {/* Form — 3 fields */}
              <View className="mt-8 px-6" style={{ gap: 20 }}>
                <AuthInput
                  label="Nama"
                  required
                  value={name}
                  onChangeText={setName}
                  placeholder="Masukkan nama"
                  autoCapitalize="words"
                  maxLength={100}
                />

                <AuthInput
                  label="Nomor HP"
                  required
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="08xx-xxxx-xxxx"
                  keyboardType="phone-pad"
                  maxLength={16}
                />

                <AuthInput
                  label="Email"
                  optional
                  value={email}
                  onChangeText={setEmail}
                  placeholder="contoh@email.co.id"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View className="mt-2">
                  <AuthButton
                    title="Daftar"
                    onPress={handleDaftar}
                    loading={loading}
                    disabled={loading}
                  />
                </View>

                {/* Terms text */}
                <Text
                  className="text-center text-text-secondary"
                  style={{ fontSize: 13, lineHeight: 19 }}
                >
                  Dengan membuat akun kamu menyetujui{' '}
                  <Text className="font-bold text-primary-dark" onPress={() => {}}>
                    Syarat & Ketentuan
                  </Text>{' '}
                  dan{' '}
                  <Text className="font-bold text-primary-dark" onPress={() => {}}>
                    Kebijakan Privasi
                  </Text>{' '}
                  GoKang.
                </Text>
              </View>
            </ScrollView>

            {/* Sticky footer */}
            <SafeAreaView edges={['bottom']} className="bg-white">
              <View className="border-t border-border px-6 py-4">
                <Text className="text-center text-sm text-text-secondary">
                  Udah punya akun?{' '}
                  <Text
                    className="font-bold text-primary-dark"
                    onPress={() => router.replace('/(auth)/login')}
                  >
                    Masuk Sekarang
                  </Text>
                </Text>
              </View>
            </SafeAreaView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
