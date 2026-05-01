import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function InfoBanner() {
  const hour = new Date().getHours();
  const message =
    hour < 15
      ? 'Untuk kedatangan besok, pesan sebelum jam 3 sore'
      : 'Pesan sekarang untuk kedatangan lusa';

  return (
    <View
      className="mx-4 mt-4 flex-row items-center rounded-xl border p-3"
      style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
    >
      <Clock size={18} color="#3B82F6" />
      <Text
        className="ml-3 flex-1 text-sm text-text-primary"
        style={{ fontFamily: 'Poppins_500Medium', lineHeight: 20 }}
      >
        {message}
      </Text>
    </View>
  );
}
