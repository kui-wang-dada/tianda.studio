import { create } from 'zustand'

interface UIState {
  isNavScrolled: boolean
  isMobileMenuOpen: boolean
  setNavScrolled: (v: boolean) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isNavScrolled: false,
  isMobileMenuOpen: false,
  setNavScrolled: (v) => set({ isNavScrolled: v }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}))
