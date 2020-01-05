import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import useInterval from "@use-it/interval";
import Editor, { theme } from "rich-markdown-editor";
import Moment from "moment";

import useNote from "./useNote";
import TitleEditor from "./TitleEditor";
import { updateNote, deleteNote } from "../Store/Actions/notes";

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
  font-family: "Open Sans", sans-serif;
  font-weight: 200;
  color: #838383;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  margin: 1rem 0 0 0.5rem;
  padding-top: 0.5rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #033450;
  color: #033450;
  margin-bottom: 1.5rem;
  font-family: "Open Sans", sans-serif;
  justify-content: flex-end;
  span {
    border-radius: 5px;
    background: #e6ebee;
    margin-left: 0.25rem;
    padding: 0.1rem 0.5rem 0.1rem 0.5rem;
    margin-bottom: 0.25rem;
    cursor: pointer;
    font-size: 14px;
  }
  span:hover{

    background: #cdd6dc;
    color: #fff;
  }
`;

const editorTheme = {
  ...theme,
  fontFamily: `'Open Sans', sans-serif`,
  text: "#2E2E2E"
};

function NoteEditor(props) {
  const { noteId, auth, notes } = props;
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
    return () => {
      saveNote();
    };
  }, [noteId]);

  const getLastUpdatedValue = () => {
    const storedNote = notes.notes.filter(
      item => item._id === selectedNote._id
    )[0];

    if (storedNote) {
      console.log(storedNote);

      const duration = Moment().diff(Moment(storedNote.updatedAt), "seconds");

      const formatting = {
        0: seconds => `moments`,
        1: seconds => `${Math.floor(seconds / 60)}m`,
        2: seconds => `${Math.floor(seconds / (60 * 60))}h`,
        3: seconds => `${Math.floor(seconds / (60 * 60 * 60))}d`
      };

      let durationLog60 = Math.floor(Math.log(duration) / Math.log(60));

      if (durationLog60 <= 0) {
        durationLog60 = 0;
      } else if (durationLog60 > 3) {
        durationLog60 = 3;
      }
      return formatting[durationLog60](duration);
    }

    return "<no value>";
  };

  const deleteNote = () => {
    if (window.confirm("Are you sure?")) {
      if (auth.loggedIn) {
        props.deleteNote(selectedNote, auth.token);
        noteMethods.setNote(null);
      }
    }
  };

  useInterval(saveNote, 5000);

  return (
    <Container>
      {selectedNote && (
        <>
          <OptionsContainer>
            <span onClick={deleteNote}>Delete Note</span>
            <span>Publish Note</span>
          </OptionsContainer>
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
            <span>
              created{" "}
              {Moment(selectedNote.createdAt).format("dddd MMM do, YYYY")}
            </span>
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

export default connect(mapStateToProps, { updateNote, deleteNote })(NoteEditor);
