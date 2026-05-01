import { Alert, Linking } from 'react-native';

export const GOKANG_CS_PHONE = '6281234567890';

export const openWhatsApp = async (phone: string, message = ''): Promise<void> => {
  const formatted = phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  const encodedMsg = encodeURIComponent(message);
  const waDeepLink = `whatsapp://send?phone=${formatted}&text=${encodedMsg}`;
  const waWebUrl = `https://wa.me/${formatted}?text=${encodedMsg}`;

  try {
    const canOpenApp = await Linking.canOpenURL(waDeepLink);
    if (canOpenApp) {
      await Linking.openURL(waDeepLink);
    } else {
      await Linking.openURL(waWebUrl);
    }
  } catch (err) {
    console.error('[WhatsApp] openURL error:', err);
    Alert.alert(
      'WhatsApp tidak tersedia',
      'Pastikan WhatsApp sudah terinstall di perangkat kamu.',
      [{ text: 'OK' }],
    );
  }
};

export const openCSWhatsApp = () => {
  openWhatsApp(
    GOKANG_CS_PHONE,
    'Halo CS GoKang, saya butuh bantuan untuk pesanan saya.',
  );
};

export const openTukangWhatsApp = (
  phone: string,
  tukangName: string,
  orderCode: string,
) => {
  openWhatsApp(
    phone,
    `Halo Pak ${tukangName}, saya ingin konfirmasi mengenai pesanan ${orderCode}.`,
  );
};
