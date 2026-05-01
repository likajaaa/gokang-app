import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { SearchResult } from '../../constants/searchableServices';

type Props = {
  query: string;
  results: SearchResult[];
  onSelect: (item: SearchResult) => void;
};

const CATEGORY_LABEL: Record<SearchResult['category'], string> = {
  borongan: 'Borongan',
  tukang_harian: 'Tukang',
  perbaikan: 'Perbaikan',
};

const CATEGORY_BG: Record<SearchResult['category'], string> = {
  borongan: '#E5EAF2',
  tukang_harian: '#DCFCE7',
  perbaikan: '#DBEAFE',
};

const CATEGORY_FG: Record<SearchResult['category'], string> = {
  borongan: '#1E2D4F',
  tukang_harian: '#16A34A',
  perbaikan: '#2563EB',
};

export default function SearchResults({ query, results, onSelect }: Props) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        maxHeight: 400,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      {results.length === 0 ? (
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
          <Text
            style={{
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 16,
              color: '#111827',
              marginBottom: 6,
            }}
          >
            Tidak ditemukan
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
            }}
          >
            Coba kata kunci lain seperti "cat", "keramik", atau "listrik"
          </Text>
        </View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#F3F4F6',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 13,
                color: '#6B7280',
              }}
            >
              {results.length} hasil untuk "{query}"
            </Text>
          </View>

          {results.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: index < results.length - 1 ? 1 : 0,
                borderBottomColor: '#F9FAFB',
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: item.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 15,
                    color: '#111827',
                    marginBottom: 2,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 13,
                    color: '#6B7280',
                  }}
                >
                  {item.description}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: CATEGORY_BG[item.category],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 10,
                    color: CATEGORY_FG[item.category],
                  }}
                >
                  {CATEGORY_LABEL[item.category]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
