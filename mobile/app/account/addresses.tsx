import { useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react-native';

type Address = {
  id: number;
  label: string;
  address: string;
  city: string;
  is_default: boolean;
};

const MOCK_ADDRESSES: Address[] = [
  { id: 1, label: 'Rumah', address: 'Jl. Merdeka No. 10', city: 'Jakarta Pusat', is_default: true },
  { id: 2, label: 'Kantor', address: 'Jl. Sudirman No. 45', city: 'Jakarta Selatan', is_default: false },
];

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);

  const handleDelete = (id: number) => {
    Alert.alert('Hapus Alamat', 'Apakah kamu yakin ingin menghapus alamat ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)),
      },
    ]);
  };

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
          Daftar Alamat
        </Text>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'flex-start',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <MapPin size={20} color="#1E2D4F" style={{ marginRight: 12, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 15,
                    color: '#111827',
                    marginRight: 8,
                  }}
                >
                  {item.label}
                </Text>
                {item.is_default ? (
                  <View
                    style={{
                      backgroundColor: '#DCFCE7',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins_500Medium',
                        fontSize: 11,
                        color: '#16A34A',
                      }}
                    >
                      Default
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 14,
                  color: '#6B7280',
                }}
              >
                {item.address}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 14,
                  color: '#6B7280',
                }}
              >
                {item.city}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 4 }}>
              <Trash2 size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert('Tambah Alamat', 'Form tambah alamat akan datang segera.')
            }
            style={{
              borderWidth: 1.5,
              borderColor: '#F97316',
              borderRadius: 12,
              borderStyle: 'dashed',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={20} color="#F97316" />
            <Text
              style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 15,
                color: '#F97316',
                marginLeft: 8,
              }}
            >
              Tambah Alamat Baru
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}
