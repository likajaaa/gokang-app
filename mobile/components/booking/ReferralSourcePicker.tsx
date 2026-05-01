import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';

const REFERRAL_OPTIONS = [
  'Rekomendasi Teman/Keluarga',
  'Instagram',
  'TikTok',
  'Iklan Online',
  'Pencarian Google',
  'Website',
] as const;

const OTHER_PREFIX = 'Lainnya: ';

type Props = {
  visible: boolean;
  selectedSources: string[];
  onClose: () => void;
  onConfirm: (sources: string[]) => void;
};

export default function ReferralSourcePicker({
  visible,
  selectedSources,
  onClose,
  onConfirm,
}: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');

  // Sync from parent when opening
  useEffect(() => {
    if (visible) {
      const fromProps = selectedSources.filter((s) => !s.startsWith(OTHER_PREFIX));
      const otherEntry = selectedSources.find((s) => s.startsWith(OTHER_PREFIX));
      setSelected(fromProps);
      setOtherText(otherEntry ? otherEntry.slice(OTHER_PREFIX.length) : '');
    }
  }, [visible, selectedSources]);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((s) => s !== option) : [...prev, option],
    );
  };

  const handleConfirm = () => {
    Keyboard.dismiss();
    const result = [...selected];
    const trimmed = otherText.trim();
    if (trimmed) result.push(OTHER_PREFIX + trimmed);
    onConfirm(result);
    sheetRef.current?.close();
  };

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={['75%']}
      enablePanDownToClose
      onChange={(i) => {
        if (i === -1) onClose();
      }}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View className="px-5 pb-3 pt-1">
          <Text
            className="text-text-primary"
            style={{ fontFamily: 'Poppins_700Bold', fontSize: 18 }}
          >
            Tahu GoKang dari mana?
          </Text>
          <Text
            className="mt-1 text-text-secondary"
            style={{ fontFamily: 'Poppins_400Regular', fontSize: 13 }}
          >
            Pilih satu atau lebih (multiple choice)
          </Text>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {REFERRAL_OPTIONS.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <TouchableOpacity
                key={option}
                onPress={() => toggle(option)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between border-b border-border py-4"
              >
                <Text
                  className="flex-1 pr-3 text-text-primary"
                  style={{ fontFamily: 'Poppins_400Regular', fontSize: 14 }}
                >
                  {option}
                </Text>
                <View
                  className="items-center justify-center rounded-md"
                  style={{
                    width: 22,
                    height: 22,
                    borderWidth: 2,
                    borderColor: isSelected ? '#1E2D4F' : '#D1D5DB',
                    backgroundColor: isSelected ? '#1E2D4F' : 'transparent',
                  }}
                >
                  {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Lainnya + text input */}
          <View className="pt-4">
            <Text
              className="mb-2 text-text-primary"
              style={{ fontFamily: 'Poppins_500Medium', fontSize: 14 }}
            >
              Lainnya
            </Text>
            <TextInput
              value={otherText}
              onChangeText={setOtherText}
              placeholder="Tuliskan sumber lainnya..."
              placeholderTextColor="#9CA3AF"
              className="rounded-xl px-4 text-text-primary"
              style={{
                height: 44,
                borderWidth: 1.5,
                borderColor: otherText ? '#1E2D4F' : '#D1D5DB',
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
              }}
            />
          </View>
        </BottomSheetScrollView>

        <View
          className="border-t border-border bg-white px-5 pt-3"
          style={{ paddingBottom: Platform.OS === 'ios' ? 24 : 16 }}
        >
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.85}
            className="items-center justify-center rounded-full bg-orange"
            style={{ height: 48 }}
          >
            <Text
              className="text-white"
              style={{ fontFamily: 'Poppins_700Bold', fontSize: 15 }}
            >
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}
