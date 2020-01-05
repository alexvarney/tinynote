import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import useInterval from "@use-it/interval";
import Editor, { theme } from "rich-markdown-editor";
import Moment from 'moment';

import useNote from "./useNote";
import TitleEditor from "./TitleEditor";
import {updateNote} from '../Store/Actions/notes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const TimestampContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-family: 'Open Sans', sans-serif;
  font-weight: 200;
  color: #838383;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  margin: 1.0rem 0 0 0.5rem;
  padding-top: 0.5rem;

`

const editorTheme = {
  ...theme,
  fontFamily: `'Open Sans', sans-serif`,
  text: "#2E2E2E"
};

function NoteEditor(props) {
  
  const {noteId, auth, notes} = props
  const [selectedNote, noteMethods] = useNote(null);

  const saveNote = () => {
    if (selectedNote) {
      const bodyValue =
        typeof selectedNote.noteMarkdown === "function"
          ? selectedNote.noteMarkdown()
          : selectedNote.noteMarkdown;

      const updatedNote = {
        ...selectedNote,
        noteMarkdown: bodyValue
      };

      //Check if update is necessary
      let savedNote = props.notes.notes.filter(
        item => item._id === selectedNote._id
      )[0];

      if (savedNote) {
        savedNote = {
          ...savedNote,
          updatedAt: null
        };
      }
      const _updatedNote = {
        ...updatedNote,
        updatedAt: null
      };

      if (
        savedNote &&
        JSON.stringify(savedNote) === JSON.stringify(_updatedNote)
      ) {
        return null;
      }

      props.updateNote(updatedNote, auth.token);
    }
  };
  
  useEffect(() => {
    saveNote();
    if (noteId) {
      //find the note in the store and select it
      const storeResult = notes.notes.filter(item => item._id === noteId)[0];
      if (storeResult) {
        noteMethods.setNote(storeResult);
      }
    }
    return () => {saveNote()}
  }, [noteId]);

  const getLastUpdatedValue = () => {

    const storedNote = notes.notes.filter(item => item._id === selectedNote._id)[0]
    
    if(storedNote){

      console.log(storedNote)

      const duration = Moment().diff(Moment(storedNote.updatedAt), 'seconds')

      const formatting = {
        0: seconds => `moments`,
        1: seconds => `${Math.floor(seconds / 60)}m`,
        2: seconds => `${Math.floor(seconds / (60*60))}h`,
        3: seconds => `${Math.floor(seconds / (60*60*60))}d`,
      }

      let durationLog60 = Math.floor(Math.log(duration)/Math.log(60))
      
      if(durationLog60 <= 0){
        durationLog60 = 0;
      } else if (durationLog60 > 3){
        durationLog60 = 3;
      }
      return formatting[durationLog60](duration)
    }

      return '<no value>'
    }
  

  useInterval(saveNote, 5000)

  return (
    <Container>
      {selectedNote && (
        <>
          <TitleEditor
            note={selectedNote}
            value={selectedNote.noteTitle}
            onChange={noteMethods.onTitleChange}
            onSave={saveNote}
          />
          <Editor
            onChange={noteMethods.onBodyChange}
            key={selectedNote._id}
            defaultValue={selectedNote.noteMarkdown}
            theme={editorTheme}
          />
          <TimestampContainer>
            <span>created {Moment(selectedNote.createdAt).format('dddd MMM do, YYYY')}</span>
            <span>updated {getLastUpdatedValue()} ago</span>
          </TimestampContainer>
        </>
      )}
    </Container>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  notes: state.notes
});

export default connect(mapStateToProps, {updateNote})(NoteEditor);
