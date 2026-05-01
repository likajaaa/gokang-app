import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AuthButton from '../../components/auth/AuthButton';
import { authApi } from '../../services/api/auth';
import { useAuthStore } from '../../store/authStore';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120; // 2 menit
const TIMER_BLUE = '#2563EB';

function displayPhone(phone: string): string {
  if (!phone) return '';
  if (phone.startsWith('+62')) return '0' + phone.slice(3);
  return phone;
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function OtpScreen() {
  const params = useLocalSearchParams<{
    phone?: string;
    mode?: 'login' | 'register';
    name?: string;
    email?: string;
  }>();
  const phone = params.phone ?? '';
  const mode = params.mode ?? 'login';

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const login = useAuthStore((s) => s.login);

  const otpCode = digits.join('');
  const otpComplete = otpCode.length === OTP_LENGTH;

  // Focus first box on mount
  useEffect(() => {
    const t = setTimeout(() => inputsRef.current[0]?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  // Countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChangeDigit = (idx: number, text: string) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (error) setError(null);

    if (digit && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    // Auto-submit when complete
    if (digit && idx === OTP_LENGTH - 1) {
      const full = next.join('');
      if (full.length === OTP_LENGTH) {
        Keyboard.dismiss();
        handleVerify(full);
      }
    }
  };

  const handleKeyPress = (
    idx: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otp = code ?? otpCode;
    if (otp.length !== OTP_LENGTH) return;
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const resp = await authApi.verifyLoginOtp(phone, otp);
        const { user, token } = resp.data.data!;
        await login(token, user);
        router.replace('/(tabs)');
      } else {
        // Register: verify OTP then immediately complete registration
        await authApi.verifyRegisterOtp(phone, otp);
        const completeResp = await authApi.completeRegistration({
          phone,
          name: params.name ?? '',
          email: params.email || undefined,
        });
        const { user, token } = completeResp.data.data!;
        await login(token, user);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 422 || status === 400) {
        setError('Kode OTP salah atau kadaluarsa');
      } else if (status === 429) {
        setError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        setError(err.response?.data?.message ?? 'Verifikasi gagal. Coba lagi.');
      }
      setDigits(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      if (mode === 'login') {
        await authApi.sendLoginOtp(phone);
      } else {
        await authApi.sendRegisterOtp(phone);
      }
      setDigits(Array(OTP_LENGTH).fill(''));
      setSecondsLeft(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Gagal mengirim ulang OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-4"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Alarm clock illustration — TOP LEFT */}
        <View className="mt-4 px-6">
          <View
            className="items-center justify-center"
            style={{ width: 100, height: 100 }}
          >
            <Text style={{ fontSize: 64 }}>⏰</Text>
          </View>
        </View>

        {/* Heading — LEFT aligned */}
        <View className="mt-6 px-6">
          <Text
            className="font-bold text-text-primary"
            style={{ fontSize: 22, lineHeight: 28 }}
          >
            Masukkan Kode OTP
          </Text>

          <Text
            className="mt-2 text-sm text-text-secondary"
            style={{ lineHeight: 20 }}
          >
            Kami telah mengirimkan kode OTP ke nomor HP
          </Text>

          {/* Phone UNMASKED, bold, di baris baru */}
          <Text
            className="mt-1 text-sm font-bold text-text-primary"
          >
            {displayPhone(phone)}
          </Text>
        </View>

        {/* OTP boxes */}
        <View className="mt-8 flex-row px-6" style={{ gap: 10 }}>
          {digits.map((d, i) => {
            const isFocused = focusedIndex === i;
            const filled = !!d;
            const borderColor = isFocused || filled ? '#1E2D4F' : '#D1D5DB';
            return (
              <TextInput
                key={i}
                ref={(r) => {
                  inputsRef.current[i] = r;
                }}
                value={d}
                onChangeText={(t) => handleChangeDigit(i, t)}
                onKeyPress={(e) => handleKeyPress(i, e)}
                onFocus={() => setFocusedIndex(i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                className="text-center text-2xl font-bold text-text-primary"
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor,
                  backgroundColor: '#fff',
                }}
              />
            );
          })}
        </View>

        {error && (
          <Text className="mt-3 px-6 text-sm text-primary">{error}</Text>
        )}

        {/* Button "Lanjutkan" */}
        <View className="mt-8 px-6">
          <AuthButton
            title="Lanjutkan"
            onPress={() => handleVerify()}
            loading={loading}
            disabled={!otpComplete}
          />
        </View>

        {/* Resend timer — center, BLUE */}
        <View className="mt-4 items-center px-6">
          {secondsLeft > 0 ? (
            <Text className="text-sm text-text-secondary">
              Kirim ulang Kode OTP{' '}
              <Text
                className="font-bold"
                style={{ color: TIMER_BLUE }}
              >
                ({formatTime(secondsLeft)})
              </Text>
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              disabled={resending}
              activeOpacity={0.6}
            >
              <Text
                className="font-bold"
                style={{ color: TIMER_BLUE, fontSize: 14 }}
              >
                {resending ? 'Mengirim...' : 'Kirim ulang Kode OTP'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
