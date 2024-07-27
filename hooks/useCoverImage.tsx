import { create } from "zustand";

type CoverImageStore = {
  isOpen: boolean;
  url: string;
  onOpen: () => void;
  onClose: () => void;
  onChange: (url: string) => void;
};

export const useCoverImage = create<CoverImageStore>((set, get) => ({
  isOpen: false,
  url: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onChange: (url) => set({ url: url, isOpen: true }),
}));
