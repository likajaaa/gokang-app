import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { ArrowLeft, CheckCircle2, LogOut, Pencil, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';

// ─── Avatar + red header combined ───────────────────────────────────

function AvatarEditor({
  avatarUri,
  onPress,
  loading,
}: {
  avatarUri: string | null;
  onPress: () => void;
  loading: boolean;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#1E2D4F',
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{ position: 'relative' }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#E5EAF2',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderWidth: 3,
            borderColor: 'white',
          }}
        >
          {loading ? (
            <ActivityIndicator color="#1E2D4F" size="large" />
          ) : avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#D1D9E8',
                  marginBottom: 6,
                }}
              />
              <View
                style={{
                  width: 64,
                  height: 34,
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  backgroundColor: '#1E2D4F',
                }}
              />
            </View>
          )}
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#F97316',
            borderWidth: 3,
            borderColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Pencil size={16} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Profile field row ───────────────────────────────────────────────

function ProfileField({
  label,
  value,
  verified,
  onEdit,
  placeholder,
}: {
  label: string;
  value: string;
  verified?: boolean;
  onEdit?: () => void;
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: 'Poppins_500Medium',
          fontSize: 14,
          color: '#374151',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor: '#D1D5DB',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: 'white',
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontFamily: 'Poppins_400Regular',
            fontSize: 15,
            color: value ? '#111827' : '#9CA3AF',
          }}
        >
          {value || placeholder}
        </Text>

        {verified !== undefined ? (
          <View style={{ marginRight: onEdit ? 12 : 0 }}>
            {verified ? (
              <CheckCircle2 size={20} color="#16A34A" fill="#16A34A" />
            ) : (
              <CheckCircle2 size={20} color="#D1D5DB" />
            )}
          </View>
        ) : null}

        {onEdit ? (
          <TouchableOpacity onPress={onEdit} style={{ padding: 4 }} hitSlop={8}>
            <Pencil size={18} color="#1E2D4F" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

// ─── Cross-platform inline edit modal (Alert.prompt is iOS-only) ─────

function EditNameModal({
  visible,
  initial,
  onClose,
  onSave,
}: {
  visible: boolean;
  initial: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError('Nama minimal 2 karakter');
      return;
    }
    setError('');
    onSave(trimmed);
  };

  const handleClose = () => {
    setValue(initial);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              width: 48,
              height: 4,
              backgroundColor: '#E5E7EB',
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827' }}
            >
              Ubah Nama
            </Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TextInput
            value={value}
            onChangeText={(t) => {
              setValue(t);
              setError('');
            }}
            placeholder="Masukkan nama"
            placeholderTextColor="#9CA3AF"
            autoFocus
            style={{
              borderWidth: 1.5,
              borderColor: error ? '#1E2D4F' : '#D1D5DB',
              borderRadius: 12,
              padding: 14,
              fontFamily: 'Poppins_400Regular',
              fontSize: 15,
              color: '#111827',
              marginBottom: 8,
            }}
          />

          {error ? (
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#1E2D4F',
                marginBottom: 12,
              }}
            >
              ⚠️ {error}
            </Text>
          ) : (
            <View style={{ height: 12 }} />
          )}

          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#F97316',
              borderRadius: 28,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: 'white' }}
            >
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────

export default function EditProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);

  const displayName = user?.name ?? '';
  const displayPhone = user?.phone ?? '';
  const displayEmail = user?.email ?? '';
  // Heuristic: if fields are present, consider them verified (store doesn't track this yet).
  const phoneVerified = Boolean(displayPhone);
  const emailVerified = Boolean(displayEmail);

  // ─── Photo picker ─────────────────────────────────────────────────

  const handlePickAvatar = () => {
    Alert.alert('Ubah Foto Profil', 'Pilih sumber foto', [
      { text: 'Batal', style: 'cancel' },
      { text: '📷 Kamera', onPress: pickFromCamera },
      { text: '🖼️ Galeri', onPress: pickFromGallery },
      ...(avatarUri
        ? [
            {
              text: '🗑️ Hapus Foto',
              style: 'destructive' as const,
              onPress: handleRemoveAvatar,
            },
          ]
        : []),
    ]);
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Izin diperlukan',
        'Izinkan akses galeri untuk mengubah foto profil.',
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin diperlukan', 'Izinkan akses kamera untuk mengambil foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    setUploadingAvatar(true);
    setAvatarUri(uri);
    try {
      // TODO: wire POST /api/v1/profile/photo (multipart/form-data) when backend is ready.
      if (user) setUser({ ...user, avatar: uri });
      console.log('[EditProfile] avatar updated (local only):', uri);
    } catch (err) {
      console.error('[EditProfile] avatar upload error:', err);
      Alert.alert('Error', 'Gagal mengupload foto. Coba lagi.');
      setAvatarUri(user?.avatar ?? null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarUri(null);
    if (user) setUser({ ...user, avatar: null });
    // TODO: wire DELETE /api/v1/profile/photo when backend is ready.
  };

  // ─── Field edits ──────────────────────────────────────────────────

  const handleSaveName = (newName: string) => {
    if (user) setUser({ ...user, name: newName });
    setShowEditNameModal(false);
    // TODO: wire PUT /api/v1/profile/name when backend is ready.
  };

  const handleEditPhone = () => {
    Alert.alert(
      'Ubah No. Handphone',
      'Mengubah nomor HP memerlukan verifikasi OTP ke nomor baru. Fitur ini akan segera tersedia.',
    );
  };

  const handleEditEmail = () => {
    Alert.alert(
      'Ubah Email',
      'Mengubah email memerlukan verifikasi ke email baru. Fitur ini akan segera tersedia.',
    );
  };

  // ─── Delete account (double confirmation) ─────────────────────────

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hapus Akun',
      'Apakah kamu yakin ingin menghapus akun ini? Semua data akan hilang permanen dan tidak dapat dipulihkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus Akun', style: 'destructive', onPress: confirmDeleteAccount },
      ],
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Konfirmasi Terakhir',
      'Tindakan ini tidak dapat dibatalkan. Ketuk "Ya, Hapus" untuk melanjutkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: async () => {
            // TODO: wire DELETE /api/v1/profile once backend endpoint exists.
            try {
              await logout();
            } catch (err) {
              console.error('[EditProfile] logout after delete error:', err);
            } finally {
              Alert.alert('Akun Dihapus', 'Akun kamu telah dihapus secara lokal.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') },
              ]);
            }
          },
        },
      ],
    );
  };

  // ─── Logout ───────────────────────────────────────────────────────

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
            console.error('[EditProfile] logout error:', err);
          } finally {
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <View
        style={{
          backgroundColor: '#1E2D4F',
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4, marginRight: 8 }}
          hitSlop={8}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: 'white',
            flex: 1,
            textAlign: 'center',
            marginRight: 36,
          }}
        >
          Ubah Akun
        </Text>
      </View>

      <AvatarEditor
        avatarUri={avatarUri}
        onPress={handlePickAvatar}
        loading={uploadingAvatar}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileField
          label="Nama"
          value={displayName}
          placeholder="Masukkan nama"
          onEdit={() => setShowEditNameModal(true)}
        />

        <ProfileField
          label="No. Handphone"
          value={displayPhone}
          placeholder="Belum diisi"
          verified={phoneVerified}
          onEdit={handleEditPhone}
        />

        <ProfileField
          label="Alamat Email"
          value={displayEmail}
          placeholder="Belum diisi"
          verified={emailVerified}
          onEdit={handleEditEmail}
        />

        <View style={{ flex: 1, minHeight: 60 }} />

        <TouchableOpacity
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
          style={{ alignItems: 'center', paddingVertical: 16, marginBottom: 12 }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              color: '#9CA3AF',
              textDecorationLine: 'underline',
            }}
          >
            Hapus Akun ini
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.85}
          style={{
            borderWidth: 1.5,
            borderColor: '#F97316',
            borderRadius: 28,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <LogOut size={20} color="#F97316" />
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
              color: '#F97316',
              marginLeft: 8,
            }}
          >
            Keluar
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <EditNameModal
        visible={showEditNameModal}
        initial={displayName}
        onClose={() => setShowEditNameModal(false)}
        onSave={handleSaveName}
      />
    </View>
  );
}
