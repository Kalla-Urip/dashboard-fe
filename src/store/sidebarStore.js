import { create } from "zustand";

export const sidebarStore = create(set => ({
  collapse: false,
  toggleCollapse: () => set((state) => ({ ...state, collapse: !state.collapse })),
  drawerCollapse: false,
  toggleDrawer: () => set((state) => ({ ...state, drawerCollapse: !state.drawerCollapse })),
}))