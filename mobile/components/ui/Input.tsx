import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, ...props }: Props) {
  return (
    <View className="w-full mb-4">
      {label ? (
        <Text className="text-text-primary font-medium text-sm mb-1">{label}</Text>
      ) : null}
      <TextInput
        className={`w-full border rounded-lg px-4 py-3 text-base text-text-primary bg-white ${
          error ? 'border-error' : 'border-border'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error ? (
        <Text className="text-error text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
