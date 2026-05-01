import { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import RNDateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';

type Props = {
  value: Date | null;
  onChange: (date: Date) => void;
};

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatDateTime(d: Date): string {
  const day = DAYS_ID[d.getDay()];
  const date = d.getDate();
  const month = MONTHS_ID[d.getMonth()];
  const year = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${day}, ${date} ${month} ${year} • ${hh}:${mm} WIB`;
}

function tomorrowAt(hour = 9): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export default function CustomDateTimePicker({ value, onChange }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value ?? tomorrowAt(9));

  const minDate = tomorrowAt(0);

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type !== 'set' || !selected) return;
      setTempDate(selected);
      // On Android, chain to time picker
      setShowTimePicker(true);
    } else {
      // iOS spinner — update tempDate live
      if (selected) setTempDate(selected);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type !== 'set' || !selected) return;
      const combined = new Date(tempDate);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      onChange(combined);
    } else {
      if (selected) {
        const combined = new Date(tempDate);
        combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
        setTempDate(combined);
      }
    }
  };

  const iosConfirm = () => {
    onChange(tempDate);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  return (
    <View className="mt-5">
      <View className="mb-3 flex-row items-center">
        <Clock size={18} color="#1E2D4F" />
        <Text
          className="ml-2 text-text-primary"
          style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15 }}
        >
          Tanggal Survey
          <Text className="text-primary"> *</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.8}
        className="items-center justify-center rounded-full"
        style={{
          height: 48,
          borderWidth: 1.5,
          borderColor: value ? '#1E2D4F' : '#D1D5DB',
        }}
      >
        <Text
          className={value ? 'text-primary' : 'text-text-secondary'}
          style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}
        >
          {value ? formatDateTime(value) : 'Pilih Tanggal & Waktu'}
        </Text>
      </TouchableOpacity>

      {/* Android: sequential date→time modals */}
      {Platform.OS === 'android' && showDatePicker && (
        <RNDateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minDate}
        />
      )}
      {Platform.OS === 'android' && showTimePicker && (
        <RNDateTimePicker
          value={tempDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
          is24Hour
        />
      )}

      {/* iOS: inline spinner with confirm button */}
      {Platform.OS === 'ios' && (showDatePicker || showTimePicker) && (
        <View className="mt-3 rounded-xl border border-border p-3">
          <RNDateTimePicker
            value={tempDate}
            mode={showTimePicker ? 'time' : 'date'}
            display="spinner"
            onChange={showTimePicker ? handleTimeChange : handleDateChange}
            minimumDate={showTimePicker ? undefined : minDate}
          />
          <View className="mt-2 flex-row" style={{ gap: 8 }}>
            {!showTimePicker ? (
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(false);
                  setShowTimePicker(true);
                }}
                className="flex-1 items-center justify-center rounded-full bg-orange"
                style={{ height: 40 }}
              >
                <Text className="text-white" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Lanjut Pilih Waktu
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={iosConfirm}
                className="flex-1 items-center justify-center rounded-full bg-orange"
                style={{ height: 40 }}
              >
                <Text className="text-white" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Konfirmasi
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
