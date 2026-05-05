import { create } from 'zustand'

export interface LightboxImage {
  src: string
  caption?: string
  alt?: string
}

interface LightboxState {
  isOpen: boolean
  images: LightboxImage[]
  index: number
  open: (images: LightboxImage[], startIndex?: number) => void
  close: () => void
  next: () => void
  prev: () => void
  goto: (index: number) => void
}

export const useLightboxStore = create<LightboxState>((set, get) => ({
  isOpen: false,
  images: [],
  index: 0,
  open: (images, startIndex = 0) => set({ isOpen: true, images, index: startIndex }),
  close: () => set({ isOpen: false }),
  next: () => {
    const { index, images } = get()
    set({ index: (index + 1) % images.length })
  },
  prev: () => {
    const { index, images } = get()
    set({ index: (index - 1 + images.length) % images.length })
  },
  goto: (i) => set({ index: i }),
}))
