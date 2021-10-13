import { useState, useEffect } from "react";
import { Box, Flex, VStack, Tooltip, Input, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "a20026b3038c4dac8c664ace9f0f4c8e",
});

export default function CreateMatch({ accessToken, toggle, setToggle }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [match, setMatch] = useState({
    firstTitle: "",
    firstArtist: "",
    secondTitle: "",
    secondArtist: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/tracks", {
        match,
      })
      .then(() => {
        window.location = "/";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //___SET NEW ACCESSTOKEN ON API WHEN ACCESSTOKEN CHANGES
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    spotifyApi
      .searchTracks(search)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [search, accessToken]);

  return (
    <form method="post" onSubmit={handleSubmit}>
      <Box
        px={9}
        py={5}
        bgColor="rgba(237,242,247, 0.1)"
        minW="290px"
        w="100%"
        position="relative"
        borderRadius="10px"
        _hover={{
          backgroundColor: "rgba(237,242,247, 0.2)",
        }}
      >
        <Flex direction="row" justifyContent="space-between">
          <VStack spacing={1} alignItems="baseline">
            <Tooltip label="Add Cover" placement="top">
              <Box
                d="flex"
                alignItems="center"
                justifyContent="center"
                h="120px"
                w="120px"
                maxW="120px"
                bgColor="rgba(247,250,252,0.2)"
                borderRadius="5px"
                _hover={{
                  backgroundColor: "rgba(247,250,252,0.5)",
                }}
              >
                <AddIcon />
              </Box>
            </Tooltip>
            <Input
              color="#E2E8F0"
              placeholder="Track Title"
              size="xs"
              maxW="120px"
              value={match.firstTitle}
              onChange={({ target }) =>
                setMatch({ ...match, firstTitle: target.value })
              }
            />
            <Input
              color="#E2E8F0"
              placeholder="Artist"
              size="xs"
              maxW="120px"
              value={match.firstArtist}
              onChange={({ target }) =>
                setMatch({ ...match, firstArtist: target.value })
              }
            />
          </VStack>
          <VStack spacing={1} alignItems="baseline">
            <Tooltip label="Add Cover" placement="top">
              <Box
                d="flex"
                alignItems="center"
                justifyContent="center"
                h="120px"
                w="120px"
                maxW="120px"
                bgColor="rgba(247,250,252,0.2)"
                borderRadius="5px"
                _hover={{
                  backgroundColor: "rgba(247,250,252,0.5)",
                }}
              >
                <AddIcon />
              </Box>
            </Tooltip>
            <Input
              color="#E2E8F0"
              placeholder="Track Title"
              size="xs"
              maxW="120px"
              value={match.secondTitle}
              onChange={({ target }) =>
                setMatch({ ...match, secondTitle: target.value })
              }
            />
            <Input
              color="#E2E8F0"
              placeholder="Artist"
              size="xs"
              maxW="120px"
              value={match.secondArtist}
              onChange={({ target }) =>
                setMatch({ ...match, secondArtist: target.value })
              }
            />
          </VStack>
        </Flex>
        <Button
          colorScheme="gray"
          mt={3}
          mb={1}
          type="submit"
          size="xs"
          w="100%"
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
      </Box>
    </form>
  );
}
