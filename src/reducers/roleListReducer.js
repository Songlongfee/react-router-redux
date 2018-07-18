import * as types from '../actions/actionTypes';

const initialState = {
  userId: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER_ID:
      return {
        ...state,
        userId: action.userId
      }
    default:
      return state
  }
}
