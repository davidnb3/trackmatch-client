const initialState = {
  search: { firstSearch: "", secondSearch: "" },
  // searchResults: {
  //   firstSearchResults: [],
  //   secondSearchResults: [],
  // },
  // selectedTracks: {
  //   firstSelectedTrack: null,
  //   secondSelectedTrack: null,
  // },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "HANDLE SEARCH":
      return { ...state, search: { ...state.search, [action.field]: action.payload } };
    case "HANDLE SEARCHRESULTS":
      return { ...state, searchResults: { ...state.searchResults } };
    default:
      return state;
  }
};

export { initialState, reducer };
