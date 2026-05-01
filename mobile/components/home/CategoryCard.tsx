import type { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  title?: string;
  /** Override default title rendering — berguna untuk mixed style text (misal "+ Material" merah). */
  titleNode?: ReactNode;
  subtitle?: string;
  colors: [string, string, ...string[]];
  emoji?: string;
  icon?: ReactNode;
  onPress: () => void;
};

export default function CategoryCard({
  title,
  titleNode,
  subtitle,
  colors,
  emoji,
  icon,
  onPress,
}: Props) {
  const handlePress = () => {
    console.log(`[CategoryCard] Tap: ${title ?? 'titleNode card'}`);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      className="flex-1 overflow-hidden rounded-2xl"
      style={{
        aspectRatio: 1.3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <LinearGradient colors={colors} style={{ flex: 1, padding: 14 }}>
        {/* Text top-left, paddingRight beri ruang untuk icon di pojok bawah-kanan */}
        <View style={{ paddingRight: 36 }}>
          {titleNode ? (
            titleNode
          ) : (
            <Text
              className="text-text-primary"
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 16,
                lineHeight: 22,
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              className="mt-0.5 text-text-primary opacity-80"
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 12,
                lineHeight: 16,
              }}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Icon di pojok bawah-kanan */}
        {(icon || emoji) && (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 12,
            }}
          >
            {icon ?? <Text style={{ fontSize: 32 }}>{emoji}</Text>}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
