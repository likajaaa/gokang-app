import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  MessageSquareWarning,
  Pencil,
  Phone,
  Star,
  type LucideIcon,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'addresses', label: 'Daftar Alamat', icon: MapPin, route: '/account/addresses' },
  { id: 'refund', label: 'Rekening Refund', icon: CreditCard, route: '/account/refund-account' },
  { id: 'terms', label: 'Ketentuan & Privasi', icon: FileText, route: '/account/terms' },
  { id: 'help', label: 'Pusat Bantuan', icon: HelpCircle, route: '/account/help' },
  { id: 'complaints', label: 'Pesanan Dikomplain', icon: MessageSquareWarning, route: '/account/complaints' },
  { id: 'rating', label: 'Beri Rating GoKang', icon: Star, route: '/account/rating' },
  { id: 'contact', label: 'Hubungi Kami', icon: Phone, route: '/account/contact' },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const displayName = user?.name ?? 'Pengguna';
  const emailVerified = Boolean(user?.email);
  const avatarUrl = user?.avatar ?? null;

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah kamu yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (err) {
            console.error('[Profile] logout error:', err);
          } finally {
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: 52,
          paddingBottom: 14,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827' }}>Akun</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/account/edit-profile')}
            style={{ marginRight: 16 }}
            activeOpacity={0.85}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#E5EAF2',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: '#D1D9E8',
                      marginBottom: 4,
                    }}
                  />
                  <View
                    style={{
                      width: 44,
                      height: 24,
                      borderTopLeftRadius: 22,
                      borderTopRightRadius: 22,
                      backgroundColor: '#1E2D4F',
                    }}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                color: '#111827',
                marginBottom: 6,
              }}
            >
              {displayName}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 16,
                paddingHorizontal: 10,
                paddingVertical: 4,
                alignSelf: 'flex-start',
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 12,
                  color: emailVerified ? '#16A34A' : '#9CA3AF',
                  fontStyle: 'italic',
                  marginRight: 4,
                }}
              >
                {emailVerified ? 'Email terverifikasi' : 'Email belum diisi'}
              </Text>
              <Text style={{ fontSize: 14 }}>{emailVerified ? '✅' : '❌'}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/account/edit-profile')}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Pencil size={14} color="#1E2D4F" />
              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 14,
                  color: '#1E2D4F',
                  marginLeft: 4,
                }}
              >
                Ubah Akun
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: 'white', marginBottom: 24 }}>
          {MENU_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            const isLast = index === MENU_ITEMS.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(item.route as never)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                  backgroundColor: 'white',
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#F3F4F6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <IconComponent size={20} color="#6B7280" />
                </View>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 15,
                    color: '#111827',
                  }}
                >
                  {item.label}
                </Text>

                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.85}
          style={{
            marginHorizontal: 16,
            marginBottom: 40,
            borderWidth: 1.5,
            borderColor: '#F97316',
            borderRadius: 28,
            paddingVertical: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: 'white',
          }}
        >
          <LogOut size={20} color="#F97316" />
          <Text
            style={{
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 16,
              color: '#F97316',
            }}
          >
            Keluar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
