import { create } from "zustand";

export const useRouteStore = create((set) => ({
  start: "",
  end: "",
  viaList: [],

  setStart: (value) => set({ start: value }),
  setEnd: (value) => set({ end: value }),

  setVia: (index, value) =>
    set((state) => {
      const newList = [...state.viaList];
      newList[index] = value;
      return { viaList: newList };
    }),

  addVia: () =>
    set((state) => ({ viaList: [...state.viaList, ""] })),
}));