import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import {
  ArrowLeft,
  Globe,
  Camera,
  Mail,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react-native';

type Contact = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  action: () => void;
};

const CONTACTS: Contact[] = [
  {
    id: 'wa',
    label: 'WhatsApp',
    value: 'wa.me/6281234567890',
    icon: MessageCircle,
    color: '#25D366',
    action: () =>
      Linking.openURL('https://wa.me/6281234567890?text=Halo%20GoKang').catch(() => null),
  },
  {
    id: 'email',
    label: 'Email',
    value: 'cs@gokang.id',
    icon: Mail,
    color: '#3B82F6',
    action: () => Linking.openURL('mailto:cs@gokang.id').catch(() => null),
  },
  {
    id: 'instagram',
    label: 'Camera',
    value: '@gokang.id',
    icon: Camera,
    color: '#E1306C',
    action: () => Linking.openURL('https://instagram.com/gokang.id').catch(() => null),
  },
  {
    id: 'website',
    label: 'Website',
    value: 'gokang.id',
    icon: Globe,
    color: '#6366F1',
    action: () => Linking.openURL('https://gokang.id').catch(() => null),
  },
];

export default function ContactScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
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
          Hubungi Kami
        </Text>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          margin: 16,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {CONTACTS.map((item, i) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={item.action}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: i < CONTACTS.length - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: item.color + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Icon size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 15,
                    color: '#111827',
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 13,
                    color: '#6B7280',
                  }}
                >
                  {item.value}
                </Text>
              </View>
              <Text style={{ color: '#9CA3AF', fontSize: 18 }}>→</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
