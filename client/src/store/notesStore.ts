import { create } from 'zustand'
import { PanelKey } from '../types'

type NotesMap = Record<PanelKey, string>

interface NotesStore {
  notes: NotesMap
  setNotes: (notes: NotesMap) => void
  setPanel: (key: PanelKey, content: string) => void
}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: { biz_dev: '', project_mgmt: '', financials: '' },
  setNotes: (notes) => set({ notes }),
  setPanel: (key, content) =>
    set((state) => ({ notes: { ...state.notes, [key]: content } })),
}))
