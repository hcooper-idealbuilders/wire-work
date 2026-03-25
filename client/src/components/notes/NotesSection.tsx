import React from 'react'
import NotePanel from './NotePanel'

export default function NotesSection() {
  return (
    <div className="grid grid-cols-3 h-full divide-x divide-gray-200">
      <NotePanel panelKey="biz_dev" />
      <NotePanel panelKey="project_mgmt" />
      <NotePanel panelKey="financials" />
    </div>
  )
}
