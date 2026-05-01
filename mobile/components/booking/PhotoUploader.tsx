import { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
};

export default function PhotoUploader({ photos, onChange, maxPhotos = 10 }: Props) {
  const [busy, setBusy] = useState(false);

  const pickFromGallery = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Maksimal Foto', `Maksimal ${maxPhotos} foto`);
      return;
    }
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxPhotos - photos.length,
      });
      if (!result.canceled) {
        const picked = result.assets.map((a) => a.uri);
        onChange([...photos, ...picked]);
      }
    } finally {
      setBusy(false);
    }
  };

  const openCamera = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Maksimal Foto', `Maksimal ${maxPhotos} foto`);
      return;
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin Diperlukan', 'Izinkan akses kamera untuk mengambil foto');
      return;
    }
    setBusy(true);
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled) {
        onChange([...photos, result.assets[0].uri]);
      }
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <View className="mt-5">
      {/* Label */}
      <View className="mb-2 flex-row items-center">
        <Camera size={18} color="#1E2D4F" />
        <Text
          className="ml-2 text-text-primary"
          style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15 }}
        >
          Masukkan Foto Masalah
          <Text className="text-primary"> *</Text>
        </Text>
      </View>
      <Text
        className="mb-3 text-xs italic text-text-secondary"
        style={{ fontFamily: 'Poppins_400Regular' }}
      >
        Maksimal foto diupload adalah {maxPhotos} foto
      </Text>

      {/* Buttons */}
      <View className="flex-row" style={{ gap: 10 }}>
        <TouchableOpacity
          onPress={pickFromGallery}
          disabled={busy}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center rounded-full"
          style={{ height: 44, borderWidth: 1.5, borderColor: '#1E2D4F', opacity: busy ? 0.5 : 1 }}
        >
          <ImageIcon size={18} color="#1E2D4F" />
          <Text
            className="ml-2 text-primary"
            style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}
          >
            Pilih dari galeri
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openCamera}
          disabled={busy}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center rounded-full"
          style={{ height: 44, borderWidth: 1.5, borderColor: '#1E2D4F', opacity: busy ? 0.5 : 1 }}
        >
          <Camera size={18} color="#1E2D4F" />
          <Text
            className="ml-2 text-primary"
            style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}
          >
            Buka kamera
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo grid */}
      {photos.length > 0 && (
        <View className="mt-4 flex-row flex-wrap" style={{ gap: 8 }}>
          {photos.map((uri, index) => (
            <View key={`${uri}-${index}`} style={{ position: 'relative' }}>
              <Image
                source={{ uri }}
                style={{ width: 92, height: 92, borderRadius: 10 }}
              />
              <TouchableOpacity
                onPress={() => removePhoto(index)}
                className="items-center justify-center rounded-full bg-orange"
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 22,
                  height: 22,
                  borderWidth: 1.5,
                  borderColor: '#FFFFFF',
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
