import React from "react";
import Draggable from "react-draggable";
import { Heading, Text } from "@chakra-ui/react";
import { DragHandleIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import "./TrackMatch.css";

export default function TrackMatch({ toggle, setToggle, ...match }) {
  const handleDelete = async () => {
    const targetId = match._id;
    console.log(targetId);
    await axios
      .delete("http://localhost:3001/tracks", {
        params: { id: targetId },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Draggable handle="#handle" position={{ x: 0, y: 0 }}>
      <div className="track-match">
        <div>
          <div className="track-data">
            <img src={match.firstCoverImg} className="album-cover" alt="album cover" />
            <div>
              <Heading color="#E2E8F0" as="h3" size="sm">
                {match.firstTitle}
              </Heading>
              <Text color="#E2E8F0" fontSize="xs">
                {match.firstArtist}
              </Text>
            </div>
          </div>
          <div className="track-data">
            <img src={match.secondCoverImg} className="album-cover" alt="album cover" />
            <div>
              <Heading color="#E2E8F0" as="h3" size="sm">
                {match.secondTitle}
              </Heading>
              <Text color="#E2E8F0" fontSize="xs">
                {match.secondArtist}
              </Text>
            </div>
          </div>
        </div>

        <div>
          <DeleteIcon cursor="pointer" id={match._id} onClick={handleDelete} />
          <DragHandleIcon cursor="move" id="handle" />
        </div>
      </div>
    </Draggable>
  );
}
