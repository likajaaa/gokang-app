import { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_SIZE = Math.floor((SCREEN_WIDTH - 48) / 7);

const DAYS_HEADER = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const TIME_SLOTS = ['09:00', '12:00', '15:00'];

type CalendarDay = {
  date: number | null;
  fullDate: Date | null;
  isToday: boolean;
  isPast: boolean;
  isSelected: boolean;
};

type Props = {
  onConfirm: (date: Date, time: string) => void;
  onClose: () => void;
  title?: string;
  timeLabel?: string;
  dateLabel?: string;
  buttonLabel?: string;
};

export default function DatePickerScreen({
  onConfirm,
  onClose,
  title = 'Tanggal & Waktu Survey',
  timeLabel = 'Waktu Survey',
  dateLabel = 'Tanggal Survey',
  buttonLabel = 'Pilih Tanggal & Waktu',
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const generateCalendarDays = (): CalendarDay[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days: CalendarDay[] = [];

    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    for (let i = 0; i < startDow; i++) {
      days.push({ date: null, fullDate: null, isToday: false, isPast: false, isSelected: false });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const fullDate = new Date(currentYear, currentMonth, d);
      const isToday = fullDate.toDateString() === today.toDateString();
      const isPast = fullDate < today && !isToday;
      const isSelected = selectedDate
        ? fullDate.toDateString() === selectedDate.toDateString()
        : false;

      days.push({ date: d, fullDate, isToday, isPast, isSelected });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (day: CalendarDay) => {
    if (!day.fullDate || day.isPast) return;
    setSelectedDate(day.fullDate);
  };

  const isConfirmEnabled = selectedDate !== null && selectedTime !== null;

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours, minutes, 0, 0);
    onConfirm(finalDate, selectedTime);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity onPress={onClose} style={{ padding: 4, marginRight: 8 }}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
            flex: 1,
            textAlign: 'center',
            marginRight: 36,
          }}
        >
          {title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tanggal Section */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>📅</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#111827' }}>
              {dateLabel}
            </Text>
          </View>

          {/* Month Navigation */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <TouchableOpacity onPress={prevMonth} style={{ padding: 8 }}>
              <ChevronLeft size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827' }}>
              {MONTHS[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={{ padding: 8 }}>
              <ChevronRight size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Days Header */}
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {DAYS_HEADER.map((day, i) => (
              <View key={i} style={{ width: DAY_SIZE, alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 13,
                    color: '#9CA3AF',
                  }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 12 }} />

          {/* Calendar Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {calendarDays.map((day, index) => {
              if (!day.date) {
                return (
                  <View
                    key={`empty-${index}`}
                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  />
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectDate(day)}
                  disabled={day.isPast}
                  style={{
                    width: DAY_SIZE,
                    height: DAY_SIZE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: day.isSelected ? '#1E2D4F' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily:
                          day.isSelected || day.isToday
                            ? 'Poppins_700Bold'
                            : 'Poppins_400Regular',
                        fontSize: 15,
                        color: day.isPast
                          ? '#D1D5DB'
                          : day.isSelected
                            ? 'white'
                            : '#111827',
                      }}
                    >
                      {day.date}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 8, backgroundColor: '#F3F4F6' }} />

        {/* Time Slots Section */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>⏰</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#111827' }}>
              {timeLabel}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {TIME_SLOTS.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 14,
                    borderRadius: 28,
                    backgroundColor: isSelected ? '#1E2D4F' : '#F3F4F6',
                    gap: 6,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🕐</Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins_600SemiBold',
                      fontSize: 15,
                      color: isSelected ? 'white' : '#374151',
                    }}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          paddingBottom: 24,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        }}
      >
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!isConfirmEnabled}
          style={{
            backgroundColor: isConfirmEnabled ? '#1E2D4F' : '#D1D5DB',
            borderRadius: 28,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
              color: isConfirmEnabled ? 'white' : '#9CA3AF',
            }}
          >
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
