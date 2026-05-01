import { useState } from 'react';
import {
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
import { authApi } from '../../services/api/auth';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const phoneValid = /^(\+62|08)\d{8,13}$/.test(phone);

  const handleLogin = async () => {
    setError(null);
    if (!phoneValid) {
      setError('Format nomor HP tidak valid (contoh: 08123456789)');
      return;
    }
    setLoading(true);
    try {
      await authApi.sendLoginOtp(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone, mode: 'login' } });
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 404) setError('Nomor HP belum terdaftar. Silakan daftar dulu.');
      else if (status === 429) setError('Terlalu banyak percobaan. Coba lagi nanti.');
      else setError(err.response?.data?.message ?? 'Gagal mengirim OTP. Coba lagi.');
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
              <View className="mt-5 items-center">
                <Image
                  source={require('../../assets/gokang-light.png')}
                  resizeMode="contain"
                  style={{ width: 200, height: 90 }}
                />
              </View>

              {/* Title centered */}
              <View className="mt-8 px-6">
                <Text className="text-center text-xl font-bold text-text-primary">
                  Silakan Masuk Dengan Akun Kamu
                </Text>
                <Text className="mt-2 text-center text-sm text-text-secondary">
                  Masukkan nomor handphone kamu yang terdaftar
                </Text>
              </View>

              {/* Form */}
              <View className="mt-8 px-6">
                <AuthInput
                  label="Nomor HP"
                  required
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (error) setError(null);
                  }}
                  placeholder="08xx-xxxx-xxxx"
                  keyboardType="phone-pad"
                  maxLength={15}
                  error={error}
                />

                <View className="mt-6">
                  <AuthButton
                    title="Masuk"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={!phoneValid}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Sticky footer */}
            <SafeAreaView edges={['bottom']} className="bg-white">
              <View className="border-t border-border px-6 py-4">
                <Text className="text-center text-sm text-text-secondary">
                  Belum punya akun?{' '}
                  <Text
                    className="font-bold text-primary-dark"
                    onPress={() => router.push('/(auth)/register')}
                  >
                    Daftar sekarang
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
