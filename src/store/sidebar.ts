import { create } from "zustand";

interface SidebarStore {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
}));
