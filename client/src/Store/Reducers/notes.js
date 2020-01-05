import actionTypes from "../Actions/actionTypes";

const initialState = {
  isFetchingNotes: false,
  notes: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.notes.beginNotesFetch:
      return {
        ...state,
        isFetchingNotes: true
      };
    case actionTypes.notes.notesFetchSuccess:
      return {
        ...state,
        notes: action.payload,
        isFetchingNotes: false
      };
    case actionTypes.notes.notesFetchFailure:
      return {
        ...state,
        isFetchingNotes: false
      };
    case actionTypes.notes.updateNote:
      return {
        ...state,
        notes: [
          ...state.notes.filter(note => note._id !== action.payload._id),
          action.payload
        ]
      };
    default:
      return state;
  }
};
