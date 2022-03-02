import { useState, useEffect, useContext, useReducer } from "react";
import { Input, Button } from "@chakra-ui/react";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import { TokenContext } from "../store/TokenContext";
import { reducer, initialState } from "../store/CreateMatchStateReducer";
import "./CreateMatch.css";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "a20026b3038c4dac8c664ace9f0f4c8e",
});

export default function CreateMatch({ toggle, setToggle }) {
  const accessToken = useContext(TokenContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("state", state);

  // const [search, setSearch] = useState({ firstSearch: "", secondSearch: "" });
  // console.log("search", search);
  const [searchResults, setSearchResults] = useState({
    firstSearchResults: [],
    secondSearchResults: [],
  });
  const [selectedTracks, setSelectedTracks] = useState({
    firstSelectedTrack: null,
    secondSelectedTrack: null,
  });

  const handleSearch = (e) => {
    dispatch({
      type: "HANDLE SEARCH",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trackMatch = selectedTracks;
    axios
      .post("http://localhost:3001/tracks", {
        trackMatch,
      })
      .then(() => {
        window.location = "/";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectFirstTrack = (track) => {
    setSelectedTracks({
      firstSelectedTrack: track,
      secondSelectedTrack: selectedTracks.secondSelectedTrack,
    });
  };

  const selectSecondTrack = (track) => {
    setSelectedTracks({
      firstSelectedTrack: selectedTracks.firstSelectedTrack,
      secondSelectedTrack: track,
    });
  };

  //___SET NEW ACCESSTOKEN ON API WHEN ACCESSTOKEN CHANGES
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  //___SEARCH FOR THE FIRST TRACK
  useEffect(() => {
    const isSearchEmpty = Object.values(state.search).every(
      (prop) => prop === null || prop === "" || prop === undefined
    );
    if (isSearchEmpty) return;
    if (!accessToken) return;
    let cancel = false;
    getFirstTrackList(cancel);

    return () => (cancel = true);
  }, [state.search.firstSearch, accessToken]);

  //___SEARCH FOR THE SECOND TRACK
  useEffect(() => {
    const isSearchEmpty = Object.values(state.search).every(
      (prop) => prop === null || prop === "" || prop === undefined
    );
    if (isSearchEmpty) return;
    if (!accessToken) return;
    let cancel = false;
    getSecondTrackList(cancel);

    return () => (cancel = true);
  }, [state.search.secondSearch, accessToken]);

  return (
    <div className="create-match">
      {selectedTracks.firstSelectedTrack ? (
        <div className="selected-track">
          <img
            className="album-cover"
            src={selectedTracks.firstSelectedTrack.albumUrl}
            alt="album-cover"
          />
          <div>
            <div>{selectedTracks.firstSelectedTrack.title}</div>
            <div>{selectedTracks.firstSelectedTrack.artist}</div>
          </div>
        </div>
      ) : (
        <Input
          color="#E2E8F0"
          placeholder="Search first Track"
          name="firstSearch"
          value={state.search.firstSearch}
          mb="10px"
          onChange={(e) => handleSearch(e)}
        />
      )}
      {state.search.firstSearch && !selectedTracks.firstSelectedTrack ? (
        <div className="track-result-container">
          {searchResults.firstSearchResults?.map((track) => (
            <TrackSearchResult key={track.uri}>
              <div className="track-result" onClick={() => selectFirstTrack(track)}>
                <img className="track-image" src={track.albumUrl} alt="album-cover" />
                <div>
                  <div>{track.title}</div>
                  <div>{track.artist}</div>
                </div>
              </div>
            </TrackSearchResult>
          ))}
        </div>
      ) : (
        <div></div>
      )}
      {selectedTracks.secondSelectedTrack ? (
        <div className="selected-track">
          <img
            className="album-cover"
            src={selectedTracks.secondSelectedTrack.albumUrl}
            alt="album-cover"
          />
          <div>
            <div>{selectedTracks.secondSelectedTrack.title}</div>
            <div>{selectedTracks.secondSelectedTrack.artist}</div>
          </div>
        </div>
      ) : (
        <Input
          color="#E2E8F0"
          placeholder="Search second Track"
          name="secondSearch"
          mb="10px"
          value={state.search.secondSearch}
          onChange={(e) => handleSearch(e)}
        />
      )}
      {state.search.secondSearch && !selectedTracks.secondSelectedTrack ? (
        <div className="track-result-container">
          {searchResults.secondSearchResults?.map((track) => (
            <TrackSearchResult key={track.uri}>
              <div className="track-result" onClick={() => selectSecondTrack(track)}>
                <img className="track-image" src={track.albumUrl} alt="album-cover" />
                <div>
                  <div>{track.title}</div>
                  <div>{track.artist}</div>
                </div>
              </div>
            </TrackSearchResult>
          ))}
        </div>
      ) : (
        <div></div>
      )}
      <Button
        colorScheme="gray"
        mb={1}
        type="submit"
        size="xs"
        w="100%"
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </Button>
      <Button
        type="submit"
        size="xs"
        w="100%"
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        Cancel
      </Button>
    </div>
  );

  // Spotify API Call for first track
  function getFirstTrackList(cancel) {
    spotifyApi.searchTracks(state.search.firstSearch).then((res) => {
      // Cancel searchResults if we type characters before its execution
      if (cancel) return;

      const trackList = res.body.tracks.items.map((track) => {
        const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
          if (smallest.height < image.height) return smallest;
          return image;
        }, track.album.images[0]);
        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
        };
      });
      setSearchResults({
        firstSearchResults: trackList,
        secondSearchResults: searchResults.secondSearchResults,
      });
    });
  }

  // Spotify API Call for second track
  function getSecondTrackList(cancel) {
    spotifyApi.searchTracks(state.search.secondSearch).then((res) => {
      // Cancel searchResults if we type characters before its execution
      if (cancel) return;

      const trackList = res.body.tracks.items.map((track) => {
        const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
          if (smallest.height < image.height) return smallest;
          return image;
        }, track.album.images[0]);
        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
        };
      });
      setSearchResults({
        firstSearchResults: searchResults.firstSearchResults,
        secondSearchResults: trackList,
      });
    });
  }
}
