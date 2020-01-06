import React, { useEffect, useState } from "react";
import axios from "axios";

import styled from "styled-components";
import { connect } from "react-redux";
import Editor, { theme } from "rich-markdown-editor";
import moment from "moment";
import Div100vh from "react-div-100vh";
import PerfectScrollbar from '@opuscapita/react-perfect-scrollbar';

import Header from "./Header";
import NoteListCard from "./NoteListCard";
import TitleEditor from "./TitleEditor";
import NoteEditor, { MobileOnly } from "./NoteEditor";
import Sidebar from "./Sidebar";

import useNote from "./useNote";

import { fetchNotes, addNewNote } from "../Store/Actions/notes";

//Styles

const FlexPanel = styled.div`
  display: flex;
  background-color: #f9f9f9;
  height: calc(100% - 3.55rem);
`;

const SidebarContainer = styled.div`
  flex: 1 0 20rem;
  max-width: 40rem;
  border-right: 1px solid #00000012;
  background-color: #f9f9f9;
  
  @media (max-width: 900px) {
    position: absolute;
    left: ${props => (props.showSidebar ? 0 : "-75vw")};
    z-index: 10;
    max-width: 75vw;
    transition: all 0.2s ease-out;
    height: inherit;
  }
`;

const SidebarBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: 'flex-start';
`

const NoteDisplay = styled.div`
  flex: 2 1 66vw;
  margin: 0.75rem;
  padding: 1rem 2rem 1.5rem 2rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;

  h1 {
    font-family: "Roboto Slab", serif;
    font-weight: normal;
    margin-bottom: 1rem;
  }

  @media (max-width: 900px) {
    min-width: calc(100vw - 4rem);
  }
`;

const AddButton = styled.button`
  align-self: center;
  margin-top: 0.75rem;
  margin-bottom: 1.25rem;
  min-height: 2rem;
`;

const HideButton = styled.button`
  border: none;
  justify-self: center;
  align-self: center;
  margin-top: 0.75rem;
  border-radius: 5px;
  padding: 0.1rem 0.5rem 0.1rem 0.5rem;
  font-size: 14px;
  font-family: "Open Sans";
  background: #e6ebee;
  color: #033450;
  min-height: 2rem;
  :hover {
    background: #cdd6dc;
  }

  @media (min-width: 900px) {
    display: none;
  }
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
    setSidebarState(false);
    setSelectedNoteId(newNote._id);
    noteMethods.setNote(newNote);
  };

  const addNote = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${props.auth.token}`
      }
    };

    axios
      .post("/api/note/", {}, config)
      .then(res => {
        props.addNewNote(res.data);
        setSelectedNoteId(res.data._id);
        setSidebarState(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  //UI Logic
  const [showSidebar, setSidebarState] = useState(true);
  const _setSidebarState = () => {
    console.log('I was fired')
    setSidebarState(true)
  }
  return (
    <Div100vh>
      <Header />
      <FlexPanel>
        <SidebarContainer showSidebar={showSidebar}>
          <PerfectScrollbar>
            <SidebarBody>
            <HideButton
              value="Hide"
              onClick={() => setSidebarState(false)}
              hidden={!currentNote}
            >
              Hide
            </HideButton>
            <Sidebar
              notes={props.notes.notes}
              selectNote={selectNote}
              selectedNoteId={selectedNoteId}
            >
              <AddButton
                value="+"
                onClick={addNote}
                className="btn btn-outline-secondary btn-sm"
              >
                +
              </AddButton>
            </Sidebar>
            </SidebarBody>
          </PerfectScrollbar>
        </SidebarContainer>
        <NoteDisplay>
          <PerfectScrollbar option={{suppressScrollX: true}}>
            <NoteEditor
              noteId={selectedNoteId}
              toggleSidebar={() => _setSidebarState(true)}
            />
          </PerfectScrollbar>
        </NoteDisplay>
      </FlexPanel>
    </Div100vh>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  notes: state.notes
});

export default connect(mapStateToProps, { fetchNotes, addNewNote })(
  EditorLayout
);
