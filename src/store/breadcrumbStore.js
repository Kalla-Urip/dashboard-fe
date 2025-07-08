import { create } from "zustand";

export const breadcrumbStore = create(set => ({
  items: [
    {
      title: 'Dashboard'
    }
  ],
  title: 'Dashboard',
  setItems: (newItems) => set(state => ({...state, items: newItems})),
  setTitle: (newTitle) => set(state => ({...state, title: newTitle})),
}))