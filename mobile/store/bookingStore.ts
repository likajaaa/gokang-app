import { create } from 'zustand';

export type PickedAddress = {
  label: string;
  detail?: string;
  latitude: number;
  longitude: number;
};

interface BookingState {
  /** Address yang di-select di `/address-picker`, di-consume oleh form booking. */
  pendingAddress: PickedAddress | null;
  setPendingAddress: (address: PickedAddress | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  pendingAddress: null,
  setPendingAddress: (address) => set({ pendingAddress: address }),
}));
