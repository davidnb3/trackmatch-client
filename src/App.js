import { useState, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { Container, Button } from "@chakra-ui/react";
import Card from "./components/Card.js";
import Header from "./components/Header.js";
import CreateMatch from "./components/CreateMatch.js";
import axios from "axios";

function App({ code }) {
  const accessToken = useAuth(code);
  const [toggle, setToggle] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/tracks")
      .then((res) => {
        setMatches(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container
      p="0"
      pb={3}
      m="0"
      maxW="none"
      bgColor="#2D3748"
      minH="100vh"
      h="100%"
    >
      <Header />
      <Container maxW="sm">
        <Button
          w="100%"
          mb="20px"
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          Add New Match
        </Button>
        {toggle && (
          <CreateMatch
            setToggle={setToggle}
            toggle={toggle}
            accessToken={accessToken}
          />
        )}
        {matches.map((match) => (
          <Card
            toggle={toggle}
            setToggle={setToggle}
            key={match._id}
            {...match}
          />
        ))}
      </Container>
    </Container>
  );
}

export default App;
