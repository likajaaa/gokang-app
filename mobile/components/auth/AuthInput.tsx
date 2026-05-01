import { useState } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string | null;
  required?: boolean;
  optional?: boolean;
  maxLength?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
};

export default function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  error,
  required,
  optional,
  maxLength,
  autoCapitalize = 'none',
  secureTextEntry,
}: Props) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const borderColor = hasError ? '#1E2D4F' : focused ? '#1E2D4F' : '#D1D5DB';

  return (
    <View className="w-full">
      <View className="mb-2 flex-row items-center">
        <Text className="text-sm font-medium text-text-primary">{label}</Text>
        {required && <Text className="ml-0.5 text-sm font-bold text-primary">*</Text>}
        {optional && <Text className="ml-1.5 text-xs text-text-secondary">(Optional)</Text>}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl bg-white px-4 text-base text-text-primary"
        style={{ height: 52, borderWidth: 1.5, borderColor }}
      />
      {hasError && <Text className="mt-1 text-xs text-primary">{error}</Text>}
    </View>
  );
}
