function ourReducer(draft, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'showsearchresults':
      draft.results = action.results
      draft.query = action.query
      return
    case 'defaultmodeupdate':
      draft.defaultedsearch = action.value
      return
    case 'queryupdate':
      draft.query = action.value
      return
    case 'openinspector':
      draft.inspectorOpen = action.inspectoropen
      draft.inspectorData = action.data
      return
    case 'closeinspector':
      draft.inspectorOpen = action.inspectoropen
      draft.inspectorIndex = null
      return
  }
}
export default ourReducer
