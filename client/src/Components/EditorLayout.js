import React, { useEffect, useState } from "react";
import axios from "axios";


import styled from "styled-components";
import { connect } from "react-redux";
import Editor, { theme } from "rich-markdown-editor";
import moment from "moment";

import NoteListCard from "./NoteListCard";
import TitleEditor from "./TitleEditor";
import NoteEditor from './NoteEditor';

import useNote from './useNote';

import { fetchNotes, addNewNote } from "../Store/Actions/notes";

//Styles

const FlexPanel = styled.div`
  min-height: calc(100vh - 3.6rem);
  max-height: calc(100vh - 3.6rem);
  display: flex;
  background-color: #f9f9f9;
  overflow-y: hidden;
`;

const NoteList = styled.div`
  flex: 1 2 28vw;
  max-width: 40rem;
  border-right: 1px solid #00000012;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: scroll;
`;

const NoteDisplay = styled.div`
  flex: 2 1 66vw;
  margin: 0.75rem;
  padding: 1.5rem 2rem 1.5rem 2rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;

  h1 {
    font-family: "Roboto Slab", serif;
    font-weight: normal;
    margin-bottom: 1rem;
  }
`;

const AddButton = styled.button`
  align-self: center;
  margin-top: 0.75rem;
  margin-bottom: 1.25rem;
`;

//Note Editor Component
const EditorLayout = props => {
  
  //Fetch notes on login
  useEffect(() => {
    if (props.auth.loggedIn) {
      props.fetchNotes(props.auth.token);
    }
  }, [props.auth.loggedIn]);

  const [selectedNoteId, setSelectedNoteId] = useState(null);

  //Selected Note Logic
  const [currentNote, noteMethods] = useNote(null);

  const selectNote = newNote => {
    setSelectedNoteId(newNote._id)
    noteMethods.setNote(newNote);
  };
  
  const addNote = () => {

    const config = {
      headers: {
        Authorization: `Bearer ${props.auth.token}`
      }
    };

    axios.post('/api/note/', {}, config)
      .then(res => {
        props.addNewNote(res.data)
        setSelectedNoteId(res.data._id)
      })
      .catch(err => {console.log(err)})
    
  }

  return (
    <FlexPanel>
      <NoteList>
        {props.notes.notes
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

        <AddButton onClick={addNote} className="btn btn-outline-secondary btn-sm">+</AddButton>
      </NoteList>
      <NoteDisplay>
        <NoteEditor noteId={selectedNoteId} />
      </NoteDisplay>
    </FlexPanel>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  notes: state.notes
});

export default connect(mapStateToProps, { fetchNotes, addNewNote })(
  EditorLayout
);
