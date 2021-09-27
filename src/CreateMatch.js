import { useState, useEffect } from "react";
import { Container, Input, VStack, Button } from "@chakra-ui/react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "a20026b3038c4dac8c664ace9f0f4c8e",
});

export default function CreateMatch({ accessToken }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    <Container
      data-testid="createMatch"
      maxW="xl"
      p={6}
      display="flex"
      justifyContent="right"
      bgColor="white"
    >
      <form method="POST" style={{ width: "100%" }}>
        <VStack w="100%">
          <Input
            type="search"
            placeholder="Search Spotify"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input type="text" placeholder="Artist" autoComplete="off" />
          <Input type="text" placeholder="Title" autoComplete="off" />
          <Button type="submit" w="100%">
            Submit
          </Button>
        </VStack>
      </form>
    </Container>
  );
}
