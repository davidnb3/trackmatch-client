import React from "react";
import { Container } from "@chakra-ui/react";

export default function Grid() {
  return (
    <Container
      data-testid="grid"
      maxW="xl"
      p={6}
      display="flex"
      justifyContent="right"
      bgColor="white"
    ></Container>
  );
}
