import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, CheckCheck } from 'lucide-react-native';
import {
  notificationsApi,
  type AppNotification,
} from '../services/api/notifications';

const getTypeIcon = (type: string): string => {
  const t = type.toLowerCase();
  if (t.includes('payment')) return '💳';
  if (t.includes('order')) return '📦';
  if (t.includes('chat') || t.includes('message')) return '💬';
  if (t.includes('promo') || t.includes('voucher')) return '🎟️';
  if (t.includes('survey')) return '📋';
  if (t.includes('tukang')) return '👷';
  return '🔔';
};

const formatRelativeTime = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = Date.now();
  const diffSec = Math.floor((now - d.getTime()) / 1000);
  if (diffSec < 60) return 'Baru saja';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  if (diffSec < 7 * 86400) return `${Math.floor(diffSec / 86400)} hari lalu`;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

function NotificationItem({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: () => void;
}) {
  const icon = getTypeIcon(item.type);
  const isUnread = !item.is_read;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        backgroundColor: isUnread ? '#EEF1F7' : 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#E5EAF2',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: isUnread ? 'Poppins_700Bold' : 'Poppins_600SemiBold',
              fontSize: 14,
              color: '#111827',
              paddingRight: 8,
            }}
          >
            {item.title}
          </Text>
          {isUnread ? (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#1E2D4F',
              }}
            />
          ) : null}
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 13,
            color: '#6B7280',
            lineHeight: 18,
            marginBottom: 6,
          }}
        >
          {item.message}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins_500Medium',
            fontSize: 11,
            color: '#9CA3AF',
          }}
        >
          {formatRelativeTime(item.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyNotifications() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: 40,
      }}
    >
      <Text style={{ fontSize: 56, marginBottom: 16 }}>🔔</Text>
      <Text
        style={{
          fontFamily: 'Poppins_700Bold',
          fontSize: 18,
          color: '#111827',
          marginBottom: 8,
        }}
      >
        Belum Ada Notifikasi
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 14,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        Notifikasi tentang pesanan, promo, dan update lainnya akan muncul di sini
      </Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await notificationsApi.list();
      setItems(res.data.data ?? []);
      setUnreadCount(res.data.meta?.unread_count ?? 0);
    } catch (err: any) {
      console.error('[Notifications] fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto mark-all-read on mount supaya dot di home hilang saat user balik
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await notificationsApi.markAllRead();
      } catch (err: any) {
        console.warn('[Notifications] mark-all-read error:', err?.message);
      }
      if (!cancelled) {
        await fetchData();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  const handlePressItem = (item: AppNotification) => {
    router.push({
      pathname: '/notification/[id]',
      params: {
        id: item.id.toString(),
        payload: JSON.stringify(item),
      },
    });
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      console.warn('[Notifications] mark-all-read error:', err?.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            marginLeft: 4,
            fontFamily: 'Poppins_700Bold',
            fontSize: 17,
            color: '#111827',
          }}
        >
          Notifikasi
        </Text>
        {unreadCount > 0 ? (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              gap: 4,
            }}
          >
            <CheckCheck size={16} color="#1E2D4F" />
            <Text
              style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 12,
                color: '#1E2D4F',
              }}
            >
              Tandai Semua
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#1E2D4F" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={() => handlePressItem(item)} />
          )}
          ListEmptyComponent={<EmptyNotifications />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData(true)}
              colors={['#1E2D4F']}
              tintColor="#1E2D4F"
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
          }}
        />
      )}
    </SafeAreaView>
  );
}
