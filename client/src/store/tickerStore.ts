import { create } from 'zustand'
import { TickerEntry, NotePromptState } from '../types'

interface TickerStore {
  entries: TickerEntry[]
  prompt: NotePromptState
  setEntries: (entries: TickerEntry[]) => void
  prependEntry: (entry: TickerEntry) => void
  updateEntry: (entry: TickerEntry) => void
  openPrompt: (entryId: number) => void
  closePrompt: () => void
}

export const useTickerStore = create<TickerStore>((set) => ({
  entries: [],
  prompt: { open: false, entryId: null },
  setEntries: (entries) => set({ entries }),
  prependEntry: (entry) =>
    set((state) => ({ entries: [entry, ...state.entries].slice(0, 200) })),
  updateEntry: (entry) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === entry.id ? entry : e)),
    })),
  openPrompt: (entryId) => set({ prompt: { open: true, entryId } }),
  closePrompt: () => set({ prompt: { open: false, entryId: null } }),
}))
