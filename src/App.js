import { useState } from "react";
import useAuth from "./hooks/useAuth";
import { Container } from "@chakra-ui/react";
import Card from "./components/Card.js";
import Header from "./components/Header.js";
import AddCard from "./components/AddCard.js";

function App({ code }) {
  const accessToken = useAuth(code);
  const [toggle, setToggle] = useState(false);
  return (
    <Container p="0" m="0" maxW="none" bgColor="#2D3748" h="100vh">
      <Header />
      <Container maxW="sm">
        {!toggle ? (
          <Card setToggle={setToggle} toggle={toggle} />
        ) : (
          <AddCard setToggle={setToggle} toggle={toggle} />
        )}
      </Container>
    </Container>
  );
}

export default App;
