import { combineReducers } from 'redux';
import roleListReducer from './roleListReducer';
import editRoleReducer from './editRoleReducer';

export default combineReducers({
  roleListReducer,
  editRoleReducer
})
