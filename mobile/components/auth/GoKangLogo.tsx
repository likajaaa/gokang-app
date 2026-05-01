import { Text, View } from 'react-native';

type Size = 'small' | 'medium' | 'large';

const SIZE_MAP = {
  small: { icon: 32, title: 20, subtitle: 11, iconText: 14 },
  medium: { icon: 48, title: 28, subtitle: 14, iconText: 22 },
  large: { icon: 64, title: 36, subtitle: 16, iconText: 28 },
} as const;

type Props = { size?: Size };

export default function GoKangLogo({ size = 'medium' }: Props) {
  const s = SIZE_MAP[size];

  return (
    <View className="items-center">
      <View
        className="items-center justify-center rounded-xl bg-orange"
        style={{
          width: s.icon,
          height: s.icon,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text className="font-extrabold text-white" style={{ fontSize: s.iconText }}>
          K
        </Text>
      </View>
      <Text
        className="mt-2 font-extrabold tracking-tight text-primary"
        style={{ fontSize: s.title }}
      >
        GoKang
      </Text>
      <Text className="font-medium text-primary" style={{ fontSize: s.subtitle }}>
        Tukang Jagoan
      </Text>
    </View>
  );
}
