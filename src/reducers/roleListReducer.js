import * as types from '../actions/actionTypes';
import { Map } from 'immutable';

const initialState = Map({
  userId: 0,
  relationId: 10,
  list: []
})

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER_ID:
      return state.merge({
        userId: action.userId
      })
    case types.SET_USER_LIST:
      return state.merge(Map({
        list:[...state.get('list'), ...action.list]
      }))
      // return state.set('list',[...state.get('list'), ...action.list])
    case types.SET_EMPLOYEE_ID:
      return {
        ...state,
        relationId: action.relationId
      }
    default:
      return state
  }
}
