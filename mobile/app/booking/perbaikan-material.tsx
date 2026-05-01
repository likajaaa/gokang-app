import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Megaphone,
  Package,
  Ticket,
  Timer,
  Wrench,
} from 'lucide-react-native';
import { ordersApi } from '../../services/api/orders';

const REFERRAL_OPTIONS = [
  'Rekomendasi Teman/Keluarga',
  'Instagram',
  'TikTok',
  'Iklan Online',
  'Pencarian Google',
  'Website',
];

const DURATION_PRESETS: { label: string; hours: number }[] = [
  { label: '4 jam (½ hari)', hours: 4 },
  { label: '8 jam (1 hari)', hours: 8 },
];

const tomorrow = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
})();

export default function BookingPerbaikanMaterialScreen() {
  const params = useLocalSearchParams<{
    service_id?: string;
    service_name?: string;
    service_icon?: string;
    price_full_day?: string;
  }>();

  const serviceId = Number(params.service_id ?? 0);
  const serviceName = params.service_name ?? 'Layanan';
  const serviceIcon = params.service_icon || '';
  const pricePerFullDay = Number(params.price_full_day ?? 0);

  const [referralSources, setReferralSources] = useState<string[]>([]);
  const [materialIncluded, setMaterialIncluded] = useState<boolean>(false);
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [workDate, setWorkDate] = useState<Date | null>(null);
  const [durationHours, setDurationHours] = useState<number>(8);
  const [description, setDescription] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(tomorrow);
  const [tempAddress, setTempAddress] = useState('');
  const [tempAddressDetail, setTempAddressDetail] = useState('');
  const [tempReferral, setTempReferral] = useState<string[]>([]);
  const [tempReferralOther, setTempReferralOther] = useState('');
  const [tempCustomHours, setTempCustomHours] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type !== 'set' || !selected) return;
      setTempDate(selected);
      setShowTimePicker(true);
    } else if (selected) {
      setTempDate(selected);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type !== 'set' || !selected) return;
      const combined = new Date(tempDate);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setWorkDate(combined);
    } else if (selected) {
      const combined = new Date(tempDate);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setTempDate(combined);
    }
  };

  const iosConfirmDateTime = () => {
    setWorkDate(tempDate);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const formatDateTime = (d: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} • ${hh}:${mm} WIB`;
  };

  const openReferralModal = () => {
    const cleanOptions = referralSources.filter((s) => !s.startsWith('Lainnya: '));
    const other = referralSources.find((s) => s.startsWith('Lainnya: '));
    setTempReferral(cleanOptions);
    setTempReferralOther(other ? other.slice('Lainnya: '.length) : '');
    setShowReferralModal(true);
  };

  const toggleReferral = (option: string) => {
    setTempReferral((prev) =>
      prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option],
    );
  };

  const saveReferral = () => {
    const final = [...tempReferral];
    const trimmed = tempReferralOther.trim();
    if (trimmed) final.push(`Lainnya: ${trimmed}`);
    setReferralSources(final);
    setShowReferralModal(false);
  };

  const openAddressModal = () => {
    setTempAddress(address);
    setTempAddressDetail(addressDetail);
    setShowAddressModal(true);
  };

  const saveAddress = () => {
    if (!tempAddress.trim()) {
      Alert.alert('Alamat Kosong', 'Isi alamat lengkap dulu');
      return;
    }
    setAddress(tempAddress.trim());
    setAddressDetail(tempAddressDetail.trim());
    setShowAddressModal(false);
  };

  const pickDurationPreset = (hours: number) => {
    setDurationHours(hours);
    setShowDurationModal(false);
  };

  const confirmCustomHours = () => {
    const n = Number(tempCustomHours);
    if (!Number.isFinite(n) || n < 2 || n > 12) {
      Alert.alert('Durasi Tidak Valid', 'Durasi harus antara 2-12 jam');
      return;
    }
    setDurationHours(Math.round(n));
    setShowDurationModal(false);
  };

  const isFormValid =
    serviceId > 0 &&
    referralSources.length > 0 &&
    address.length > 0 &&
    workDate !== null &&
    durationHours >= 2 &&
    durationHours <= 12 &&
    description.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert(
        'Form Belum Lengkap',
        'Pastikan semua field wajib terisi dan deskripsi minimal 10 karakter.',
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        service_id: serviceId,
        referral_sources: referralSources,
        material_included: materialIncluded,
        address,
        address_detail: addressDetail || undefined,
        work_scheduled_at: workDate!.toISOString(),
        duration_hours: durationHours,
        description: description.trim(),
        promo_code: promoCode.trim() || undefined,
      };

      console.log('[PerbaikanMaterial] POST /booking/perbaikan-material', payload);
      const response = await ordersApi.createPerbaikanMaterial(payload);
      const data = response.data.data;

      const materialNote = data.material_included
        ? '\nMaterial: (akan dihitung setelah survey)'
        : '';

      Alert.alert(
        'Berhasil!',
        `Order ${data.order_code} berhasil dibuat.\nTotal (jasa): Rp ${data.total_amount.toLocaleString('id-ID')}${materialNote}`,
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err: any) {
      console.error('[PerbaikanMaterial] Submit error:', err.response?.data || err.message);
      const status = err.response?.status;
      const apiMessage = err.response?.data?.message;
      const errors = err.response?.data?.errors;

      let message = apiMessage ?? 'Gagal membuat order. Coba lagi.';
      if (status === 422 && errors) {
        const lines = Object.values(errors).map((arr) => (Array.isArray(arr) ? arr[0] : arr));
        message = lines.join('\n');
      } else if (status === 401) {
        message = 'Sesi habis. Silakan login ulang.';
      } else if (!err.response) {
        message = 'Tidak bisa connect ke server. Cek koneksi atau backend.';
      }
      Alert.alert('Gagal Membuat Order', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 48,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 6 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 4,
            flex: 1,
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
          }}
        >
          Pesan Layanan {serviceName}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Service info card */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            backgroundColor: '#EEF1F7',
            borderRadius: 16,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            {serviceIcon ? (
              <Image source={{ uri: serviceIcon }} style={{ width: 36, height: 36 }} />
            ) : (
              <Text style={{ fontSize: 26 }}>🔧</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: '#111827' }}>
              {serviceName}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 12,
                color: '#6B7280',
                marginTop: 2,
              }}
            >
              Rp {pricePerFullDay.toLocaleString('id-ID')} per hari penuh (8 jam)
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ color: '#1E2D4F', fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>
              Ganti
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. Tahu GoKang dari mana */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Megaphone size={20} color="#1E2D4F" />
          <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
            Tahu GoKang dari mana?<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={openReferralModal}
          style={{
            borderWidth: 2,
            borderColor: referralSources.length > 0 ? '#1E2D4F' : '#D1D5DB',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              flex: 1,
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              color: referralSources.length > 0 ? '#111827' : '#9CA3AF',
            }}
          >
            {referralSources.length > 0 ? referralSources.join(', ') : 'Pilih sumber informasi'}
          </Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* 2. Material Included */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
          <Package size={20} color="#1E2D4F" />
          <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
            Material Included<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setMaterialIncluded(true)}
          activeOpacity={0.7}
          style={{
            borderWidth: 2,
            borderColor: materialIncluded ? '#1E2D4F' : '#D1D5DB',
            backgroundColor: materialIncluded ? '#EEF1F7' : 'white',
            borderRadius: 12,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: materialIncluded ? '#1E2D4F' : '#D1D5DB',
              backgroundColor: materialIncluded ? '#1E2D4F' : 'white',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            {materialIncluded ? <Check size={14} color="white" strokeWidth={3} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#111827' }}>
              Ya, sertakan material
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 12,
                color: '#6B7280',
                marginTop: 2,
                lineHeight: 16,
              }}
            >
              Estimasi material akan dikonfirmasi setelah survey.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMaterialIncluded(false)}
          activeOpacity={0.7}
          style={{
            borderWidth: 2,
            borderColor: !materialIncluded ? '#1E2D4F' : '#D1D5DB',
            backgroundColor: !materialIncluded ? '#EEF1F7' : 'white',
            borderRadius: 12,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: !materialIncluded ? '#1E2D4F' : '#D1D5DB',
              backgroundColor: !materialIncluded ? '#1E2D4F' : 'white',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            {!materialIncluded ? <Check size={14} color="white" strokeWidth={3} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#111827' }}>
              Tidak, saya sediakan sendiri
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 12,
                color: '#6B7280',
                marginTop: 2,
                lineHeight: 16,
              }}
            >
              Hanya bayar jasa tukang.
            </Text>
          </View>
        </TouchableOpacity>

        {/* 3. Alamat pekerjaan */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
          <MapPin size={20} color="#1E2D4F" />
          <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
            Alamat Pekerjaan<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={openAddressModal}
          style={{
            borderWidth: 2,
            borderColor: address ? '#1E2D4F' : '#D1D5DB',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: address ? '#111827' : '#9CA3AF',
              }}
            >
              {address || 'Tentukan alamat pekerjaan'}
            </Text>
            {addressDetail ? (
              <Text
                numberOfLines={1}
                style={{
                  marginTop: 2,
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 12,
                  color: '#6B7280',
                }}
              >
                {addressDetail}
              </Text>
            ) : null}
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* 3. Tanggal & waktu */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
          <Clock size={20} color="#1E2D4F" />
          <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
            Tanggal & Waktu Pekerjaan<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderWidth: 1.5,
            borderColor: workDate ? '#1E2D4F' : '#D1D5DB',
            borderRadius: 26,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: workDate ? '#1E2D4F' : '#9CA3AF',
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 13,
            }}
          >
            {workDate ? formatDateTime(workDate) : 'Pilih Tanggal & Waktu'}
          </Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (showDatePicker || showTimePicker) && (
          <View
            style={{
              marginTop: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <DateTimePicker
              value={tempDate}
              mode={showTimePicker ? 'time' : 'date'}
              display="spinner"
              onChange={showTimePicker ? handleTimeChange : handleDateChange}
              minimumDate={showTimePicker ? undefined : tomorrow}
            />
            <TouchableOpacity
              onPress={() => {
                if (!showTimePicker) {
                  setShowDatePicker(false);
                  setShowTimePicker(true);
                } else {
                  iosConfirmDateTime();
                }
              }}
              style={{
                backgroundColor: '#F97316',
                borderRadius: 22,
                paddingVertical: 10,
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                {showTimePicker ? 'Konfirmasi' : 'Lanjut Pilih Waktu'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 4. Durasi */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
          <Timer size={20} color="#1E2D4F" />
          <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
            Durasi Pekerjaan<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setTempCustomHours(String(durationHours));
            setShowDurationModal(true);
          }}
          style={{
            borderWidth: 2,
            borderColor: '#1E2D4F',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#111827' }}>
            {durationHours} jam
            {durationHours === 4 ? ' (½ hari)' : durationHours === 8 ? ' (1 hari penuh)' : ''}
          </Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* 5. Deskripsi */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
          <Wrench size={20} color="#1E2D4F" />
          <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
            Detail Pekerjaan<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
        </View>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Ceritakan kerjaan yang dibutuhkan. Minimal 10 karakter."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
          style={{
            borderWidth: 2,
            borderColor: description.trim().length >= 10 ? '#1E2D4F' : '#D1D5DB',
            borderRadius: 12,
            padding: 14,
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            minHeight: 110,
            textAlignVertical: 'top',
          }}
        />
        <Text
          style={{
            textAlign: 'right',
            color: '#9CA3AF',
            fontSize: 12,
            marginTop: 4,
            fontFamily: 'Poppins_400Regular',
          }}
        >
          {description.length}/500
        </Text>

        {/* 6. Promo Code */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
          <Ticket size={20} color="#1E2D4F" />
          <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
            Kode Promo
          </Text>
        </View>
        <TextInput
          value={promoCode}
          onChangeText={setPromoCode}
          placeholder="Masukkan kode promo bila ada"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          style={{
            borderWidth: 2,
            borderColor: '#D1D5DB',
            borderRadius: 12,
            padding: 14,
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
          }}
        />

        {/* Estimasi Biaya */}
        <View
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#FAFAFA',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 16,
          }}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, marginBottom: 8 }}>
            Estimasi Biaya
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: '#6B7280',
              lineHeight: 20,
            }}
          >
            {materialIncluded
              ? 'Biaya jasa dihitung dari durasi. Material akan disurvey dulu oleh tim kami sebelum penawaran final.'
              : 'Estimasi biaya dihitung dari durasi pekerjaan. Material disediakan sendiri.'}
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isFormValid || submitting}
          style={{
            backgroundColor: isFormValid && !submitting ? '#1E2D4F' : '#D1D5DB',
            paddingVertical: 16,
            borderRadius: 28,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: isFormValid && !submitting ? 'white' : '#9CA3AF',
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
            }}
          >
            {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Referral Modal */}
      <Modal
        visible={showReferralModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReferralModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              maxHeight: '75%',
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 6 }}>
              Tahu GoKang dari mana?
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#6B7280',
                marginBottom: 12,
              }}
            >
              Pilih satu atau lebih (multiple choice)
            </Text>

            <ScrollView style={{ maxHeight: 380 }}>
              {REFERRAL_OPTIONS.map((option) => {
                const isSelected = tempReferral.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleReferral(option)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6',
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        paddingRight: 8,
                      }}
                    >
                      {option}
                    </Text>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: isSelected ? '#1E2D4F' : '#D1D5DB',
                        backgroundColor: isSelected ? '#1E2D4F' : 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={{ paddingVertical: 14 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, marginBottom: 8 }}>
                  Lainnya
                </Text>
                <TextInput
                  value={tempReferralOther}
                  onChangeText={setTempReferralOther}
                  placeholder="Tuliskan sumber lainnya..."
                  placeholderTextColor="#9CA3AF"
                  style={{
                    borderWidth: 1.5,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    padding: 12,
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 14,
                  }}
                />
              </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => setShowReferralModal(false)}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: '#D1D5DB',
                  borderRadius: 24,
                  paddingVertical: 13,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#6B7280', fontSize: 14 }}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveReferral}
                style={{
                  flex: 1,
                  backgroundColor: '#F97316',
                  borderRadius: 24,
                  paddingVertical: 13,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold', fontSize: 14 }}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Address Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 16 }}>
              Alamat Pekerjaan
            </Text>

            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, marginBottom: 6 }}>
              Alamat Lengkap<Text style={{ color: '#1E2D4F' }}> *</Text>
            </Text>
            <TextInput
              value={tempAddress}
              onChangeText={setTempAddress}
              placeholder="Contoh: Jl. Sudirman No. 45..."
              placeholderTextColor="#9CA3AF"
              multiline
              style={{
                borderWidth: 1.5,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                padding: 12,
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                minHeight: 80,
                textAlignVertical: 'top',
                marginBottom: 16,
              }}
            />

            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, marginBottom: 6 }}>
              Detail/Patokan <Text style={{ color: '#9CA3AF' }}>(opsional)</Text>
            </Text>
            <TextInput
              value={tempAddressDetail}
              onChangeText={setTempAddressDetail}
              placeholder="Contoh: Lantai 3, samping lift"
              placeholderTextColor="#9CA3AF"
              style={{
                borderWidth: 1.5,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                padding: 12,
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowAddressModal(false)}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: '#D1D5DB',
                  borderRadius: 24,
                  paddingVertical: 13,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#6B7280', fontSize: 14 }}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveAddress}
                style={{
                  flex: 1,
                  backgroundColor: '#F97316',
                  borderRadius: 24,
                  paddingVertical: 13,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold', fontSize: 14 }}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Duration Modal */}
      <Modal
        visible={showDurationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDurationModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 16 }}>
              Pilih Durasi
            </Text>

            {DURATION_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.hours}
                onPress={() => pickDurationPreset(preset.hours)}
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 15,
                    color: durationHours === preset.hours ? '#1E2D4F' : '#111827',
                  }}
                >
                  {preset.label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 12,
                    color: '#6B7280',
                    marginTop: 2,
                  }}
                >
                  Rp {Math.round(pricePerFullDay * (preset.hours / 8)).toLocaleString('id-ID')}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, marginBottom: 8 }}>
                Durasi lain (2 - 12 jam)
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput
                  value={tempCustomHours}
                  onChangeText={setTempCustomHours}
                  keyboardType="number-pad"
                  placeholder="Jumlah jam"
                  placeholderTextColor="#9CA3AF"
                  style={{
                    flex: 1,
                    borderWidth: 1.5,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    padding: 12,
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 14,
                  }}
                />
                <TouchableOpacity
                  onPress={confirmCustomHours}
                  style={{
                    paddingHorizontal: 20,
                    backgroundColor: '#F97316',
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                    Pakai
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowDurationModal(false)}
              style={{
                marginTop: 16,
                borderWidth: 1.5,
                borderColor: '#D1D5DB',
                borderRadius: 24,
                paddingVertical: 13,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#6B7280', fontSize: 14 }}>
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Android pickers */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={tomorrow}
        />
      )}
      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
          is24Hour
        />
      )}
    </View>
  );
}
