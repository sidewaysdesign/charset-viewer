function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        hasError: false
      }
    case 'FETCH_SUCCESS':
      console.log('payload -->', action.payload)
      return {
        ...state,
        isLoading: false,
        hasError: false,
        hits: action.payload
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        hasError: true
      }
    default:
      throw new Error()
  }
}

export default fetchReducer
