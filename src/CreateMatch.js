import { useState, useEffect } from "react";
import { Container, Input, FormControl } from "@chakra-ui/react";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "cda05a1cfab241769542ed054c843d20",
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

    axios
      .get(`https://api.spotify.com/v1/search?q=human%20error&type=track`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
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
      h="calc(100vh - 88px)"
    >
      <FormControl id="searchSpotify" isRequired>
        <Input
          type="search"
          placeholder="Search Spotify"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </FormControl>
    </Container>
  );
}
