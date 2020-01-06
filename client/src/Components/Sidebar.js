import React from 'react'
import NoteListCard from './NoteListCard'
import moment from 'moment';

export default function Sidebar(props) {

  const {notes, selectedNoteId, selectNote, children} = props

  return (
    <>
      {props.notes
          .sort(
            (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()
          )
          .map(note => (
            <NoteListCard
              selected={note._id === selectedNoteId}
              key={note._id}
              note={note}
              onClick={() => selectNote(note)}
            />
          ))}

          {children}
    </>
  )
}
