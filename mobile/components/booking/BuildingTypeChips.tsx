import { Text, TouchableOpacity, View } from 'react-native';
import { Building, Building2, Home } from 'lucide-react-native';

export type BuildingType = 'apartment' | 'ruko' | 'rumah';

type Props = {
  value: BuildingType | null;
  onChange: (type: BuildingType) => void;
};

const TYPES: { id: BuildingType; label: string; Icon: typeof Home }[] = [
  { id: 'apartment', label: 'Apartment', Icon: Building },
  { id: 'ruko', label: 'Ruko', Icon: Building2 },
  { id: 'rumah', label: 'Rumah', Icon: Home },
];

export default function BuildingTypeChips({ value, onChange }: Props) {
  return (
    <View className="mt-5">
      <View className="mb-3 flex-row items-center">
        <Home size={18} color="#1E2D4F" />
        <Text
          className="ml-2 text-text-primary"
          style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15 }}
        >
          Jenis Bangunan
          <Text className="text-primary"> *</Text>
        </Text>
      </View>

      <View className="flex-row" style={{ gap: 10 }}>
        {TYPES.map(({ id, label, Icon }) => {
          const active = value === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => onChange(id)}
              activeOpacity={0.8}
              className="flex-1 items-center justify-center rounded-xl"
              style={{
                paddingVertical: 14,
                borderWidth: 1.5,
                borderColor: active ? '#1E2D4F' : '#D1D5DB',
                backgroundColor: active ? '#E5EAF2' : '#FFFFFF',
              }}
            >
              <Icon size={22} color={active ? '#1E2D4F' : '#9CA3AF'} />
              <Text
                className={active ? 'text-primary' : 'text-text-secondary'}
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 13,
                  marginTop: 6,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
