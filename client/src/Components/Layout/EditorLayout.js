import React from 'react'
import styled from 'styled-components'

export default function EditorLayout() {

  const FlexPanel = styled.div`
    height: calc(100vh - 3.5rem);
    background-color: lightsteelblue;
    display: flex;
  `
  const NoteList = styled.div`
    flex: 1 2 28vw;
    max-width: 40rem;
    background-color: lightslategrey;
  `

  const NoteDisplay = styled.div`
    flex 2 1 66vw;
  `


  return (
    <FlexPanel> 
      <NoteList />
      <NoteDisplay />
    </FlexPanel>
  )
}
