import { render, cleanup, fireEvent } from "@testing-library/react";
import AddButton from "../AddButton";
import "@testing-library/jest-dom";

afterEach(cleanup);

it("should be enabled", () => {
  const { getByTestId } = render(<AddButton />);
  expect(getByTestId("button")).toBeEnabled();
});

it("should have textcontent", () => {
  const { getByTestId } = render(<AddButton />);
  expect(getByTestId("button")).toHaveTextContent("Add");
});
