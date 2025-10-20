import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { useTodoStore } from "@store/todoStore";

describe("App", () => {
  beforeEach(() => {
    // Reset store before each test
    useTodoStore.setState({
      todos: [],
      filter: "all",
      loading: false,
      error: null,
    });
  });

  it("should render the TodoList component", () => {
    render(<App />);

    // Check for TodoList header
    expect(screen.getByText(/my todos/i)).toBeInTheDocument();
  });

  it("should render TodoForm for adding new todos", () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    expect(input).toBeInTheDocument();
  });

  it("should render empty state when no todos", () => {
    render(<App />);

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});
