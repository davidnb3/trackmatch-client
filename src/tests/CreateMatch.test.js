import { render, cleanup, fireEvent } from "@testing-library/react";
import { waitFor, screen } from "@testing-library/react";
import CreateMatch from "../components/CreateMatch";

it("renders without crashing", () => {
  render(<CreateMatch />);
});
