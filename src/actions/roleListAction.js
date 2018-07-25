export const setUserId = (userId) => {
  return {
    type: 'SET_USER_ID',
    userId
  }
}

export const setEmployeeId = (relationId ) => {
  return {
    type: 'SET_EMPLOYEE_ID',
    relationId
  }
}

export const setUserList = (list) => {
  return {
    type: 'SET_USER_LIST',
    list
  }
}