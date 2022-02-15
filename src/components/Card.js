import React from "react";
import Draggable from "react-draggable";
import { Box, Flex, Heading, VStack, Text, Image } from "@chakra-ui/react";
import { DragHandleIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function Grid({ toggle, setToggle, ...match }) {
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
      <VStack mb="20px">
        <Draggable handle="#handle" position={{ x: 0, y: 0 }}>
          <Flex
            direction="row"
            justifyContent="space-around"
            data-testid="grid"
            p={5}
            bgColor="rgba(237,242,247, 0.1)"
            minW="290px"
            w="100%"
            position="relative"
            borderRadius="10px"
            _hover={{
              backgroundColor: "rgba(237,242,247, 0.2)",
            }}
          >
            <VStack spacing={1} alignItems="baseline">
              <Box
                d="flex"
                alignItems="center"
                justifyContent="center"
                h="120px"
                w="120px"
                maxW="120px"
                borderRadius="5px"
              >
                <Image
                  src="http://localhost:3001/images/logo.png"
                  alt="Segun Adebayo"
                />
              </Box>
              <Heading
                color="#E2E8F0"
                maxW="120px"
                as="h3"
                size="sm"
                isTruncated
              >
                {match.firstTitle}
              </Heading>
              <Text color="#E2E8F0" maxW="120px" fontSize="xs" isTruncated>
                {match.firstArtist}
              </Text>
            </VStack>
            <VStack spacing={1} alignItems="baseline">
              <Box
                d="flex"
                alignItems="center"
                justifyContent="center"
                h="120px"
                w="120px"
                maxW="120px"
                borderRadius="5px"
              >
                <Image
                  src="http://localhost:3001/images/logo.png"
                  alt="Segun Adebayo"
                />
              </Box>

              <Heading
                color="#E2E8F0"
                maxW="120px"
                as="h3"
                size="sm"
                isTruncated
              >
                {match.firstTitle}
              </Heading>
              <Text color="#E2E8F0" maxW="120px" fontSize="xs" isTruncated>
                {match.firstArtist}
              </Text>
            </VStack>
            <DeleteIcon
              cursor="pointer"
              position="absolute"
              id={match._id}
              left="324px"
              w="20px"
              h="80px"
              onClick={handleDelete}
            />
            <DragHandleIcon
              cursor="move"
              id="handle"
              position="absolute"
              left="324px"
              w="20px"
              h="20px"
            />
          </Flex>
        </Draggable>
      </VStack>
    </>
  );
}
