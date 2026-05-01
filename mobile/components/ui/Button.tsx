import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-orange rounded-lg items-center justify-center py-3 px-6',
    text: 'text-white font-semibold text-base',
  },
  outline: {
    container: 'border border-primary rounded-lg items-center justify-center py-3 px-6',
    text: 'text-primary font-semibold text-base',
  },
  ghost: {
    container: 'items-center justify-center py-3 px-6',
    text: 'text-primary font-semibold text-base',
  },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}: Props) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${styles.container} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1E2D4F'} />
      ) : (
        <Text className={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
