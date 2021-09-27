import React from "react";
import Draggable from "react-draggable";
import { Box, Flex, Heading, VStack, Text, Tooltip } from "@chakra-ui/react";
import { AddIcon, DragHandleIcon } from "@chakra-ui/icons";

export default function Grid() {
  const trackMatch = {
    firstTitle: "Song Title",
    firstArtist: "Artist Name",
    secondTitle: "Song Title",
    secondArtist: "Artist Name",
  };

  return (
    <Draggable handle="#handle" position={{ x: 0, y: 0 }}>
      <Flex
        direction="row"
        justifyContent="space-around"
        data-testid="grid"
        p={5}
        bgColor="rgba(237,242,247, 0.1)"
        minW="290px"
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
            bgColor="rgba(247,250,252,0.2)"
            borderRadius="5px"
            _hover={{
              backgroundColor: "rgba(247,250,252,0.5)",
            }}
          >
            <AddIcon />
          </Box>
          <Heading color="#E2E8F0" maxW="120px" as="h3" size="sm" isTruncated>
            {trackMatch.firstTitle}
          </Heading>
          <Text color="#E2E8F0" maxW="120px" fontSize="xs" isTruncated>
            {trackMatch.firstArtist}
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
            bgColor="rgba(247,250,252,0.2)"
            borderRadius="5px"
            _hover={{
              backgroundColor: "rgba(247,250,252,0.5)",
            }}
          >
            <AddIcon />
          </Box>
          <Heading color="#E2E8F0" maxW="120px" as="h3" size="sm" isTruncated>
            {trackMatch.firstTitle}
          </Heading>
          <Text color="#E2E8F0" maxW="120px" fontSize="xs" isTruncated>
            {trackMatch.firstArtist}
          </Text>
        </VStack>
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
  );
}
