import React from "react";
import { Container, Button } from "@chakra-ui/react";

export default function AddButton({ createMatch, setCreateMatch }) {
  const handleClick = () => {
    if (createMatch) {
      setCreateMatch(false);
    } else {
      setCreateMatch(true);
    }
  };

  return (
    <Container maxW="xl" p={6} display="flex" justifyContent="right">
      <Button
        data-testid="button"
        c="#F56565"
        borderRadius="100px"
        onClick={handleClick}
      >
        Add
      </Button>
    </Container>
  );
}
