import React from "react";
import { Container } from "@chakra-ui/react";

export default function CreateMatch() {
  return (
    <Container
      data-testid="createMatch"
      maxW="xl"
      p={6}
      display="flex"
      justifyContent="right"
      bgColor="blue"
    ></Container>
  );
}
