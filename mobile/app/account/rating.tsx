import { useState } from 'react';
import { Alert, Linking, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';

export default function RatingScreen() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Rating diperlukan', 'Mohon berikan rating terlebih dahulu');
      return;
    }

    if (rating >= 4) {
      Alert.alert(
        'Terima Kasih! 🎉',
        'Yuk bantu kami dengan memberikan review di Play Store!',
        [
          { text: 'Nanti saja', style: 'cancel' },
          {
            text: 'Beri Review',
            onPress: () => {
              Linking.openURL('market://details?id=com.gokang.app').catch(() =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.gokang.app',
                ),
              );
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Terima kasih!',
        'Feedback kamu akan kami gunakan untuk meningkatkan layanan.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    }
  };

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
          Beri Rating GoKang
        </Text>
      </View>

      <View style={{ flex: 1, padding: 24, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 24,
            color: '#111827',
            textAlign: 'center',
            marginBottom: 8,
            marginTop: 32,
          }}
        >
          GoKang
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 15,
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          Seberapa puas kamu dengan aplikasi GoKang?
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Star
                size={48}
                color={star <= rating ? '#F59E0B' : '#D1D5DB'}
                fill={star <= rating ? '#F59E0B' : 'none'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          value={review}
          onChangeText={setReview}
          placeholder="Tulis review kamu (opsional)"
          placeholderTextColor="#9CA3AF"
          multiline
          style={{
            width: '100%',
            borderWidth: 1.5,
            borderColor: '#D1D5DB',
            borderRadius: 12,
            padding: 16,
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            height: 120,
            textAlignVertical: 'top',
            marginBottom: 32,
            color: '#111827',
          }}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          style={{
            width: '100%',
            backgroundColor: rating > 0 ? '#1E2D4F' : '#D1D5DB',
            borderRadius: 28,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: 'white' }}>
            Kirim Rating
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
