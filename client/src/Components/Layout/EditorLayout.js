import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import styled from "styled-components";
import { connect } from "react-redux";
import Editor, { theme } from "rich-markdown-editor";
import moment from "moment";

import NoteListCard from "../NoteListCard";
import TitleEditor from "../TitleEditor";

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
  const [notes, setNotes] = useState([]);

  //Save an updated note state to the above collection
  const saveNoteLocally = note => {
    setNotes(prevNotes => {
      const filteredNotes = prevNotes.filter(
        prevNote => prevNote._id !== note._id
      );

      const bodyValue =
        typeof note.noteMarkdown === "function"
          ? note.noteMarkdown()
          : note.noteMarkdown;

      filteredNotes.push({ ...note, noteMarkdown: bodyValue });

      return filteredNotes;
    });
  };

  //Download notes on component load
  useEffect(() => {
    if (props.auth.loggedIn) {
      const config = {
        headers: {
          Authorization: `Bearer ${props.auth.token}`
        }
      };
      axios
        .get("/api/note/", config)
        .then(res => {
          setNotes(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [props.auth.loggedIn]);

  //Selected Note Logic
  const [currentNote, noteMethods] = useNote(null);

  const selectNote = newNote => {
    console.log(currentNote);
    if (currentNote) {
      saveNoteLocally(currentNote);
    }
    noteMethods.setNote(newNote);
  };

  return (
    <FlexPanel>
      <NoteList>
        {notes
          .sort(
            (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()
          )
          .map(note => (
            <NoteListCard
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
              value={currentNote.noteTitle}
              onChange={noteMethods.onTitleChange}
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
  auth: state.auth
});

export default connect(mapStateToProps, {})(EditorLayout);
