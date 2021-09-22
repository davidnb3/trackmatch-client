import { useState } from "react";
import useAuth from "./useAuth";
import { Container } from "@chakra-ui/react";
import AddButton from "./AddButton.js";
import CreateMatch from "./CreateMatch.js";
import Grid from "./Grid.js";

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [createMatch, setCreateMatch] = useState(false);

  return (
    <Container p="0" m="0" maxW="none" bgColor="#2D3748" h="100vh">
      <Container maxW="sm">
        <AddButton setCreateMatch={setCreateMatch} createMatch={createMatch} />
        {createMatch ? <CreateMatch accessToken={accessToken} /> : <Grid />}
      </Container>
    </Container>
  );
}
