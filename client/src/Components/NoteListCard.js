import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    padding: 1.0rem 1.0rem 0.15rem 1.0rem;
    margin: 0.75rem;
    border-radius: 0.5rem;
    box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    cursor: pointer;

    h1 {
      font-family: 'Roboto Slab', serif;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 21px;
      color: #434343;
      margin-bottom: 0.75rem;
    }
    p{
      font-family: 'Open Sans', sans-serif;
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      max-height: 5em;
    }
`

export default function NoteListCard({note, onClick}) {

  return (
    <Container onClick={onClick}>
      <h1>{note.noteTitle}</h1>
      <p>{note.noteMarkdown}</p>
    </Container>
  )
}