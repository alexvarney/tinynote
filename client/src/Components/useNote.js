import React, {useReducer} from 'react'

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

export default useNote;