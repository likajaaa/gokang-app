import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

type Variant = 'primary' | 'outline';
type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
};

export default function AuthButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: Props) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={`w-full flex-row items-center justify-center rounded-full ${
        isPrimary ? 'bg-orange' : 'border-[1.5px] border-orange bg-white'
      }`}
      style={{ height: 52, opacity: isDisabled ? 0.5 : 1 }}
    >
      {loading ? (
        <>
          <ActivityIndicator
            color={isPrimary ? '#fff' : '#F97316'}
            style={{ marginRight: 8 }}
          />
          <Text
            className={`text-base font-bold ${isPrimary ? 'text-white' : 'text-orange'}`}
          >
            Memproses...
          </Text>
        </>
      ) : (
        <Text
          className={`text-base font-bold ${isPrimary ? 'text-white' : 'text-orange'}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
