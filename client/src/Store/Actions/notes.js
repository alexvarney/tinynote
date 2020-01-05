import axios from "axios";
import actionTypes from "../Actions/actionTypes";

export const fetchNotes = token => dispatch => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  axios
    .get("/api/note/", config)
    .then(res => {
      dispatch({
        type: actionTypes.notes.notesFetchSuccess,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({ type: actionTypes.notes.notesFetchFailure });
    });
};

export const updateNote = (note, token) => dispatch => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  axios
    .put(`/api/note/${note._id}`, note, config)
    .then(res => {
      dispatch({ type: actionTypes.notes.updateNote, payload: res.data });
    })
    .catch(err => {
      console.log(err);
    });
};

export const addNewNote = note => dispatch => {
  dispatch({type: actionTypes.notes.updateNote, payload: note})
}

export const deleteNote = (note, token) => dispatch => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  axios.delete(`/api/note/${note._id}`, config)
    .then(res => dispatch({type: actionTypes.notes.deleteNote, payload: note._id}))
    .catch(err => console.log(err))

}