import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { PanelKey } from '../../types'
import { useNotesStore } from '../../store/notesStore'
import { useNotes } from '../../hooks/useNotes'

const PANEL_LABELS: Record<PanelKey, string> = {
  biz_dev: 'Business Development',
  project_mgmt: 'Project Management',
  financials: 'Financials',
}

interface NotePanelProps {
  panelKey: PanelKey
}

export default function NotePanel({ panelKey }: NotePanelProps) {
  const content = useNotesStore((s) => s.notes[panelKey])
  const { handleNoteChange } = useNotes()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: `Add ${PANEL_LABELS[panelKey]} notes…` }),
    ],
    content,
    onUpdate: ({ editor }) => {
      handleNoteChange(panelKey, editor.getHTML())
    },
  })

  // Sync remote changes into the editor without losing cursor
  useEffect(() => {
    if (!editor) return
    const editorHtml = editor.getHTML()
    if (editorHtml !== content) {
      editor.commands.setContent(content, false)
    }
  }, [content])

  return (
    <div className="flex flex-col h-full border-r border-gray-200 last:border-r-0">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {PANEL_LABELS[panelKey]}
        </h3>
        {/* Mini toolbar */}
        {editor && (
          <div className="flex gap-1 mt-1">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
              <strong>B</strong>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
              <em>I</em>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
              ≡
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
              1.
            </ToolbarBtn>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none min-h-full focus:outline-none text-gray-800"
        />
      </div>
    </div>
  )
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
        active ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}
