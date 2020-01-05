import React, { useEffect, useState, useReducer, useRef } from "react";
import axios from "axios";
import useInterval from "@use-it/interval";
import styled from "styled-components";
import { connect } from "react-redux";
import Editor, { theme } from "rich-markdown-editor";
import moment from "moment";

import NoteListCard from "../NoteListCard";
import TitleEditor from "../TitleEditor";

import { fetchNotes, updateNote } from "../../Store/Actions/notes";

//Styles

const FlexPanel = styled.div`
  min-height: calc(100vh - 3.5rem);
  display: flex;
  background-color: #f9f9f9;
`;
const NoteList = styled.div`
  flex: 1 2 28vw;
  max-width: 40rem;
  border-right: 1px solid #00000012;
  overflow-y: scroll;
`;

const NoteDisplay = styled.div`
  flex: 2 1 66vw;
  margin: 0.75rem;
  padding: 1.5rem 2rem 1.5rem 2rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1);
  h1 {
    font-family: "Roboto Slab", serif;
    font-weight: normal;
    margin-bottom: 1rem;
  }
`;

const editorTheme = {
  ...theme,
  fontFamily: `'Open Sans', sans-serif`,
  text: "#2E2E2E"
};

//Custom Hook for managing note updates
const useNote = initialNote => {
  const noteReducer = (state, action) => {
    switch (action.type) {
      case "SET_NOTE":
        return action.payload;
      case "CHANGE_TITLE":
        return {
          ...state,
          noteTitle: action.payload
        };
      case "CHANGE_BODY":
        return {
          ...state,
          noteMarkdown: action.payload
        };
      default:
        return { ...state };
    }
  };

  const actions = {
    onTitleChange: event => {
      noteDispatch({
        type: "CHANGE_TITLE",
        payload: event.target.value
      });
    },
    setNote: newNote => {
      noteDispatch({
        type: "SET_NOTE",
        payload: newNote
      });
    },
    onBodyChange: newNote => {
      noteDispatch({
        type: "CHANGE_BODY",
        payload: newNote
      });
    }
  };

  const [currentNote, noteDispatch] = useReducer(noteReducer, initialNote);

  return [currentNote, actions];
};

//Note Editor Component
const EditorLayout = props => {
  
  //Fetch notes on login
  useEffect(() => {
    if (props.auth.loggedIn) {
      props.fetchNotes(props.auth.token);
    }
  }, [props.auth.loggedIn]);

  //Selected Note Logic
  const [currentNote, noteMethods] = useNote(null);

  const selectNote = newNote => {
    if (currentNote) {
      saveNote();
    }
    noteMethods.setNote(newNote);
  };

  const saveNote = () => {
    if (currentNote) {
      const bodyValue =
        typeof currentNote.noteMarkdown === "function"
          ? currentNote.noteMarkdown()
          : currentNote.noteMarkdown;

      const updatedNote = {
        ...currentNote,
        noteMarkdown: bodyValue
      };

      //Check if update is necessary
      let savedNote = props.notes.notes.filter(
        item => item._id === currentNote._id
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

      props.updateNote(updatedNote, props.auth.token);
    }
  };

  useInterval(saveNote, 2500);

  return (
    <FlexPanel>
      <NoteList>
        {props.notes.notes
          .sort(
            (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()
          )
          .map(note => (
            <NoteListCard
              selected={currentNote && note._id === currentNote._id}
              key={note._id}
              note={note}
              onClick={() => selectNote(note)}
            />
          ))}
      </NoteList>
      <NoteDisplay>
        {currentNote && (
          <>
            <TitleEditor
              note={currentNote}
              value={currentNote.noteTitle}
              onChange={noteMethods.onTitleChange}
              onSave={saveNote}
            />
            <Editor
              onChange={noteMethods.onBodyChange}
              key={currentNote._id}
              defaultValue={currentNote.noteMarkdown}
              theme={editorTheme}
            />
          </>
        )}
      </NoteDisplay>
    </FlexPanel>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  notes: state.notes
});

export default connect(mapStateToProps, { fetchNotes, updateNote })(
  EditorLayout
);
