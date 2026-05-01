import { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Headphones } from 'lucide-react-native';
import {
  openCSWhatsApp,
  openTukangWhatsApp,
} from '../../utils/whatsapp';

type ChatItem = {
  id: string;
  type: 'cs' | 'tukang';
  name: string;
  subName?: string;
  avatarEmoji: string;
  avatarBg: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  // Underscore = jangan ditampilkan ke user, hanya untuk WA deep link.
  _phone: string;
  _orderCode?: string;
};

// Contoh data — pakai saat mau lihat list view (lihat komentar di fetchChats).
// Security: `_phone` hanya dipakai untuk deep-link WA, tidak di-render.
const MOCK_CHATS: ChatItem[] = [
  {
    id: 'cs',
    type: 'cs',
    name: 'CS GoKang',
    avatarEmoji: '🎧',
    avatarBg: '#1E2D4F',
    lastMessage: 'Halo! Ada yang bisa kami bantu?',
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    unreadCount: 1,
    _phone: '6281234567890',
  },
  {
    id: 'tukang-1',
    type: 'tukang',
    name: 'Pak Budi',
    subName: 'Jagoan Cat',
    avatarEmoji: '🎨',
    avatarBg: '#E5EAF2',
    lastMessage: 'Saya sudah tiba di lokasi, silakan buka pintunya',
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 2,
    _phone: '6281234567891',
    _orderCode: 'KGO-2026-0001',
  },
];

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
  if (diffDay === 1) return 'Kemarin';
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  if (diffDay < 7) return days[date.getDay()];
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

function EmptyChat() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
      }}
    >
      <View
        style={{
          width: 200,
          height: 200,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 12,
            width: 110,
            height: 16,
            backgroundColor: 'rgba(0,0,0,0.08)',
            borderRadius: 60,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 22,
            width: 136,
            height: 88,
            backgroundColor: '#1E2D4F',
            borderRadius: 8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 22,
            width: 136,
            height: 40,
            backgroundColor: '#1E2D4F',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 60,
            width: 80,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 32, color: '#B91C1C', fontFamily: 'Poppins_800ExtraBold' }}>
            ✕
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 103,
            left: 28,
            width: 66,
            height: 34,
            backgroundColor: '#1E2D4F',
            borderRadius: 4,
            transform: [{ rotate: '-22deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 103,
            right: 28,
            width: 66,
            height: 34,
            backgroundColor: '#1E2D4F',
            borderRadius: 4,
            transform: [{ rotate: '22deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 18,
            right: 32,
            transform: [{ rotate: '35deg' }],
          }}
        >
          <Text style={{ fontSize: 40, color: '#3B82F6' }}>▶</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 62,
            right: 68,
            width: 36,
            height: 1,
            borderWidth: 1.5,
            borderColor: '#9CA3AF',
            borderStyle: 'dashed',
            transform: [{ rotate: '35deg' }],
          }}
        />
      </View>

      <Text
        style={{
          fontFamily: 'Poppins_700Bold',
          fontSize: 20,
          color: '#111827',
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        Tidak ada riwayat percakapan
      </Text>

      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 15,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 22,
          maxWidth: 280,
        }}
      >
        Riwayat percakapan yang kamu miliki akan muncul di sini
      </Text>
    </View>
  );
}

function ChatListItem({ item }: { item: ChatItem }) {
  const handlePress = () => {
    if (item.type === 'cs') {
      openCSWhatsApp();
      return;
    }
    openTukangWhatsApp(
      item._phone,
      item.name.replace(/^Pak\s+/, ''),
      item._orderCode ?? '',
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: item.avatarBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 24 }}>{item.avatarEmoji}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 15,
                color: '#111827',
              }}
            >
              {item.name}
            </Text>
            {item.subName ? (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 12,
                  color: '#1E2D4F',
                }}
              >
                {item.subName}
              </Text>
            ) : null}
          </View>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              color: '#9CA3AF',
              flexShrink: 0,
            }}
          >
            {formatTime(item.lastMessageAt)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily:
                item.unreadCount > 0 ? 'Poppins_500Medium' : 'Poppins_400Regular',
              fontSize: 13,
              color: item.unreadCount > 0 ? '#374151' : '#9CA3AF',
              flex: 1,
              marginRight: 8,
            }}
          >
            {item.lastMessage}
          </Text>

          {item.unreadCount > 0 ? (
            <View
              style={{
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#1E2D4F',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
                flexShrink: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 11,
                  color: 'white',
                }}
              >
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChatsScreen() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // Ganti `[]` ke `MOCK_CHATS` untuk test list view tanpa backend.
      // TODO: wire GET /api/v1/chats saat backend chat ready.
      setChats([]);
    } catch (err) {
      console.error('[Chats] fetch error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <View style={{ width: 40 }} />

        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
          }}
        >
          Chat
        </Text>

        <TouchableOpacity
          onPress={openCSWhatsApp}
          style={{
            width: 40,
            height: 40,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Headphones size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {chats.length === 0 && !refreshing ? (
        <EmptyChat />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchChats(true)}
              colors={['#1E2D4F']}
              tintColor="#1E2D4F"
            />
          }
          renderItem={({ item }) => <ChatListItem item={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

// Dev-only export biar MOCK_CHATS tidak dianggap unused saat default empty.
export const __DEV_MOCK_CHATS__ = MOCK_CHATS;
