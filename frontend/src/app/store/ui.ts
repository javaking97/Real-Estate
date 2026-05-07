import { create } from 'zustand';

interface UiState {
  mobileSidebarOpen: boolean;
  notificationOpen: boolean;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeNotification: () => void;
  toggleNotification: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileSidebarOpen: false,
  notificationOpen: false,

  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  closeNotification: () => set({ notificationOpen: false }),
  toggleNotification: () => set((state) => ({ notificationOpen: !state.notificationOpen })),
}));
