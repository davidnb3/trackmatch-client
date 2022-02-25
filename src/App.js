import { useState, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { Button } from "@chakra-ui/react";
import TrackMatch from "./components/TrackMatch.js";
import Header from "./components/Header.js";
import CreateMatch from "./components/CreateMatch.js";
import { TokenContext } from "./store/TokenContext";
import "./App.css";
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
    <div className="app">
      <Header />
      <div className="app-content">
        <Button
          w="100%"
          maxW="300px"
          mb="20px"
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          Add New Match
        </Button>
        <TokenContext.Provider value={accessToken}>
          {toggle && <CreateMatch setToggle={setToggle} toggle={toggle} />}
          {matches.map((match) => (
            <TrackMatch toggle={toggle} setToggle={setToggle} key={match._id} {...match} />
          ))}
        </TokenContext.Provider>
      </div>
    </div>
  );
}

export default App;
