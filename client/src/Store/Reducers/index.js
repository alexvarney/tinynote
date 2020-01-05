import {combineReducers} from 'redux'

import authReducer from './auth'
import notesReducer from './notes'

export default combineReducers({
    auth: authReducer,
    notes: notesReducer
})