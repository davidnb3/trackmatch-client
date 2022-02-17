import { useState, useEffect } from "react";
import { Box, Flex, VStack, Tooltip, Input, Button } from "@chakra-ui/react";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "a20026b3038c4dac8c664ace9f0f4c8e",
});

export default function CreateMatch({ accessToken, toggle, setToggle }) {
  // const [firstSearch, setFirstSearch] = useState("");
  // const [secondSearch, setSecondSearch] = useState("");
  // const [firstSearchResults, setFirstSearchResults] = useState([]);
  // console.log(firstSearchResults);
  // const [secondSearchResults, setSecondSearchResults] = useState([]);

  const [search, setSearch] = useState({ firstSearch: "", secondSearch: "" });

  const [searchResults, setSearchResults] = useState({
    firstSearchResults: [],
    secondSearchResults: [],
  });

  console.log(searchResults.firstSearchResults);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios
  //     .post("http://localhost:3001/tracks", {
  //       match,
  //     })
  //     .then(() => {
  //       window.location = "/";
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const searchTracks = (cancel, search) => {
    return spotifyApi
      .searchTracks(search)
      .then((res) => {
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
        return trackList;
      })
      .catch((err) => console.log(err));
  };

  //___SET NEW ACCESSTOKEN ON API WHEN ACCESSTOKEN CHANGES
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  //___SEARCH FOR THE FIRST TRACK
  useEffect(() => {
    const isSearchEmpty = Object.values(search).every(
      (prop) => prop === null || prop === "" || prop === undefined
    );
    if (isSearchEmpty) return;
    if (!accessToken) return;
    let cancel = false;

    setSearchResults({
      firstSearchResults: searchTracks(cancel, search.firstSearch),
      secondSearchResults: searchResults.secondSearchResults,
    });

    return () => (cancel = true);
  }, [search.firstSearch, accessToken]);

  //___SEARCH FOR THE SECOND TRACK
  useEffect(() => {
    const isSearchEmpty = Object.values(search).every(
      (prop) => prop === null || prop === "" || prop === undefined
    );
    if (isSearchEmpty) return;
    if (!accessToken) return;
    let cancel = false;

    setSearchResults({
      firstSearchResults: searchResults.firstSearchResults,
      secondSearchResults: searchTracks(cancel, search.secondSearch),
    });

    return () => (cancel = true);
  }, [search.secondSearch, accessToken]);

  return (
    <Box
      px={9}
      py={5}
      bgColor="rgba(237,242,247, 0.1)"
      minW="290px"
      w="100%"
      mb="20px"
      position="relative"
      borderRadius="10px"
      _hover={{
        backgroundColor: "rgba(237,242,247, 0.2)",
      }}
    >
      <VStack spacing={1} alignItems="baseline">
        <Input
          color="#E2E8F0"
          placeholder="Search first Track"
          size="xs"
          value={search.firstSearch}
          onChange={({ target }) =>
            setSearch({ firstSearch: target.value, secondSearch: search.secondSearch })
          }
        />
        <Input
          color="#E2E8F0"
          placeholder="Search second Track"
          size="xs"
          onChange={({ target }) =>
            setSearch({ firstSearch: search.firstSearch, secondSearch: target.value })
          }
        />
      </VStack>

      <Button colorScheme="gray" mt={3} mb={1} type="submit" size="xs" w="100%">
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
    </Box>
  );
}
