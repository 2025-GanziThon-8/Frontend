import { create } from "zustand";

export const useRouteStore = create((set) => ({
  /* 1. 유저가 입력한 주소 정보 */
  start: null,
  end: null,
  viaList: [],

  setStart: (payload) => set({ start: payload }),
  setEnd: (payload) => set({ end: payload }),
  setVia: (idx, payload) =>
    set((state) => {
      const arr = [...state.viaList];
      arr[idx] = payload;
      return { viaList: arr };
    }),
  addVia: () =>
    set((state) => ({
      viaList: [...state.viaList, null],
    })),

  /* 2. RouteScreen에서 받은 경로 리스트 */
  paths: [],
  setPaths: (list) => set({ paths: list }),

  /* 3. 선택된 경로 (세부 정보를 Report로 넘길 것) */
  selectedPath: null,
  setSelectedPath: (p) => set({ selectedPath: p }),

  /* 4. 로딩/에러 전역 제어 (필요할 때 사용 가능) */
  loading: false,
  setLoading: (v) => set({ loading: v }),

  error: null,
  setError: (v) => set({ error: v }),
}));