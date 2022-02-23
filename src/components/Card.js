import React from "react";
import Draggable from "react-draggable";
import { Box, Flex, Heading, VStack, Text, Image } from "@chakra-ui/react";
import { DragHandleIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function Card({ toggle, setToggle, ...match }) {
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
    <>
      <Draggable handle="#handle" position={{ x: 0, y: 0 }}>
        <Flex
          direction="row"
          minW="290px"
          mb="20px"
          bgColor="rgba(237,242,247, 0.1)"
          _hover={{
            backgroundColor: "rgba(237,242,247, 0.2)",
          }}
        >
          <VStack w="100%">
            <VStack spacing={1} alignItems="baseline" w="100%">
              <Heading color="#E2E8F0" as="h3" size="sm">
                {match.firstTitle}
              </Heading>
              <Text color="#E2E8F0" fontSize="xs">
                {match.firstArtist}
              </Text>
            </VStack>
            <VStack spacing={1} alignItems="baseline" w="100%">
              <Heading color="#E2E8F0" as="h3" size="sm">
                {match.secondTitle}
              </Heading>
              <Text color="#E2E8F0" fontSize="xs">
                {match.secondArtist}
              </Text>
            </VStack>
          </VStack>
          <Box>
            <DeleteIcon cursor="pointer" id={match._id} onClick={handleDelete} />
            <DragHandleIcon cursor="move" id="handle" />
          </Box>
        </Flex>
      </Draggable>
    </>
  );
}
