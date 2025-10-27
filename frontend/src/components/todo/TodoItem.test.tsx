import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TodoItem } from "./TodoItem";
import { useTodoStore } from "@store/todoStore";

// Mock useTodos hook to prevent API calls in tests
vi.mock("@hooks/useTodos", () => ({
  useTodoActions: () => ({
    fetchTodos: vi.fn().mockResolvedValue(undefined),
    createTodo: vi.fn().mockResolvedValue(undefined),
    // updateTodo should return the updated todo object (like the real API)
    updateTodo: vi.fn().mockImplementation((id, updates) => {
      // Simulate API returning updated todo
      return Promise.resolve({
        id,
        ...updates,
        updatedAt: new Date(),
      });
    }),
    deleteTodo: vi.fn().mockResolvedValue(undefined),
    toggleTodo: vi.fn().mockResolvedValue(undefined),
  }),
  useInitTodos: () => ({
    fetchTodos: vi.fn().mockResolvedValue(undefined),
    createTodo: vi.fn().mockResolvedValue(undefined),
    updateTodo: vi.fn().mockResolvedValue(undefined),
    deleteTodo: vi.fn().mockResolvedValue(undefined),
    toggleTodo: vi.fn().mockResolvedValue(undefined),
  }),
  useTodos: () => ({
    fetchTodos: vi.fn().mockResolvedValue(undefined),
    createTodo: vi.fn().mockResolvedValue(undefined),
    updateTodo: vi.fn().mockResolvedValue(undefined),
    deleteTodo: vi.fn().mockResolvedValue(undefined),
    toggleTodo: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe("TodoItem", () => {
  beforeEach(() => {
    // Reset store before each test
    useTodoStore.setState({
      todos: [],
      filter: "all",
      loading: false,
      error: null,
    });
  });

  const mockTodo = {
    id: "test-id-1",
    title: "Test Todo",
    description: "Test Description",
    isCompleted: false,
    priority: "LOW" as const,
    createdAt: new Date("2025-10-17T10:00:00.000Z"),
    updatedAt: new Date("2025-10-17T10:00:00.000Z"),
  };

  describe("Rendering - View Mode", () => {
    it("should render todo title", () => {
      render(<TodoItem todo={mockTodo} />);

      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    it("should render checkbox for completion status", () => {
      render(<TodoItem todo={mockTodo} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it("should render checked checkbox for completed todo", () => {
      const completedTodo = { ...mockTodo, isCompleted: true };
      render(<TodoItem todo={completedTodo} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("should render delete button", () => {
      render(<TodoItem todo={mockTodo} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton).toBeInTheDocument();
    });

    it("should apply line-through style to completed todo title", () => {
      const completedTodo = { ...mockTodo, isCompleted: true };
      render(<TodoItem todo={completedTodo} />);

      const title = screen.getByText("Test Todo");
      expect(title).toHaveClass("line-through");
    });

    it("should apply opacity to completed todo", () => {
      const completedTodo = { ...mockTodo, isCompleted: true };
      render(<TodoItem todo={completedTodo} />);

      const title = screen.getByText("Test Todo");
      expect(title).toHaveClass("opacity-50");
    });
  });

  describe("Toggle Completion", () => {
    it("should toggle todo completion when checkbox is clicked", () => {
      useTodoStore.setState({ todos: [mockTodo] });
      render(<TodoItem todo={mockTodo} />);

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      const todos = useTodoStore.getState().todos;
      expect(todos[0].isCompleted).toBe(true);
    });

    it("should toggle from completed to active", () => {
      const completedTodo = { ...mockTodo, isCompleted: true };
      useTodoStore.setState({ todos: [completedTodo] });
      render(<TodoItem todo={completedTodo} />);

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      const todos = useTodoStore.getState().todos;
      expect(todos[0].isCompleted).toBe(false);
    });
  });

  describe("Delete Todo", () => {
    it("should delete todo when delete button is clicked", () => {
      useTodoStore.setState({ todos: [mockTodo] });
      render(<TodoItem todo={mockTodo} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      const todos = useTodoStore.getState().todos;
      expect(todos).toHaveLength(0);
    });
  });

  describe("Edit Mode", () => {
    it("should enter edit mode when title is double-clicked", () => {
      render(<TodoItem todo={mockTodo} />);

      const title = screen.getByText("Test Todo");
      fireEvent.doubleClick(title);

      const input = screen.getByDisplayValue("Test Todo");
      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });

    it("should show input with current title in edit mode", () => {
      render(<TodoItem todo={mockTodo} />);

      const title = screen.getByText("Test Todo");
      fireEvent.doubleClick(title);

      const input = screen.getByDisplayValue("Test Todo") as HTMLInputElement;
      expect(input.value).toBe("Test Todo");
    });

    it("should update todo when pressing Enter", async () => {
      useTodoStore.setState({ todos: [mockTodo] });
      render(<TodoItem todo={mockTodo} />);

      // Enter edit mode
      const title = screen.getByText("Test Todo");
      fireEvent.doubleClick(title);

      // Edit title
      const input = screen.getByDisplayValue("Test Todo");
      fireEvent.change(input, { target: { value: "Updated Todo" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      // Wait for async update to complete by checking store state
      await waitFor(() => {
        const todos = useTodoStore.getState().todos;
        expect(todos[0].title).toBe("Updated Todo");
      });
    });

    it("should cancel edit when pressing Escape", () => {
      useTodoStore.setState({ todos: [mockTodo] });
      render(<TodoItem todo={mockTodo} />);

      // Enter edit mode
      const title = screen.getByText("Test Todo");
      fireEvent.doubleClick(title);

      // Edit title
      const input = screen.getByDisplayValue("Test Todo");
      fireEvent.change(input, { target: { value: "Changed" } });
      fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

      // Title should remain unchanged
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
      const todos = useTodoStore.getState().todos;
      expect(todos[0].title).toBe("Test Todo");
    });

    it("should exit edit mode when input loses focus", async () => {
      useTodoStore.setState({ todos: [mockTodo] });
      render(<TodoItem todo={mockTodo} />);

      // Enter edit mode
      const title = screen.getByText("Test Todo");
      fireEvent.doubleClick(title);

      // Edit and blur
      const input = screen.getByDisplayValue("Test Todo");
      fireEvent.change(input, { target: { value: "Updated" } });
      fireEvent.blur(input);

      // Wait for async update to complete by checking store state
      await waitFor(() => {
        const todos = useTodoStore.getState().todos;
        expect(todos[0].title).toBe("Updated");
      });
    });

    it("should not save empty title", () => {
      useTodoStore.setState({ todos: [mockTodo] });
      render(<TodoItem todo={mockTodo} />);

      const title = screen.getByText("Test Todo");
      fireEvent.doubleClick(title);

      const input = screen.getByDisplayValue("Test Todo");
      fireEvent.change(input, { target: { value: "" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      // Title should remain unchanged
      const todos = useTodoStore.getState().todos;
      expect(todos[0].title).toBe("Test Todo");
    });

    it("should trim whitespace before saving", async () => {
      useTodoStore.setState({ todos: [mockTodo] });
      render(<TodoItem todo={mockTodo} />);

      const title = screen.getByText("Test Todo");
      fireEvent.doubleClick(title);

      const input = screen.getByDisplayValue("Test Todo");
      fireEvent.change(input, { target: { value: "  Updated  " } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      // Wait for async update to complete by checking store state
      await waitFor(() => {
        const todos = useTodoStore.getState().todos;
        expect(todos[0].title).toBe("Updated");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible checkbox label", () => {
      render(<TodoItem todo={mockTodo} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-label", 'Mark "Test Todo" as complete');
    });

    it("should have accessible delete button label", () => {
      render(<TodoItem todo={mockTodo} />);

      const deleteButton = screen.getByRole("button", { name: /delete "Test Todo"/i });
      expect(deleteButton).toBeInTheDocument();
    });

    it("should have accessible checkbox label for completed todo", () => {
      const completedTodo = { ...mockTodo, isCompleted: true };
      render(<TodoItem todo={completedTodo} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-label", 'Mark "Test Todo" as incomplete');
    });
  });

  describe("Keyboard Navigation", () => {
    it("should be keyboard accessible", () => {
      render(<TodoItem todo={mockTodo} />);

      const checkbox = screen.getByRole("checkbox");
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      expect(checkbox).toHaveAttribute("type", "checkbox");
      expect(deleteButton).toHaveAttribute("type", "button");
    });
  });

  describe("Styling", () => {
    it("should apply correct layout classes", () => {
      const { container } = render(<TodoItem todo={mockTodo} />);

      const itemDiv = container.firstChild as HTMLElement;
      expect(itemDiv).toHaveClass("flex");
      expect(itemDiv).toHaveClass("items-center");
    });

    it("should apply hover effect classes", () => {
      const { container } = render(<TodoItem todo={mockTodo} />);

      const itemDiv = container.firstChild as HTMLElement;
      expect(itemDiv).toHaveClass("hover:bg-gray-50");
    });

    it("should hide delete button by default and show on hover", () => {
      render(<TodoItem todo={mockTodo} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      // Delete button is visible on mobile (opacity-100), hidden on desktop (sm:opacity-0)
      expect(deleteButton).toHaveClass("opacity-100");
      expect(deleteButton.className).toMatch(/sm:opacity-0/);
      expect(deleteButton.className).toMatch(/sm:group-hover:opacity-100/);
    });
  });

  describe("Priority Badge Display (CR-002)", () => {
    it("should display priority badge for todo with CRITICAL priority", () => {
      const criticalTodo = { ...mockTodo, priority: "CRITICAL" as const };
      render(<TodoItem todo={criticalTodo} />);

      expect(screen.getByText("緊急")).toBeInTheDocument();
    });

    it("should display priority badge for todo with HIGH priority", () => {
      const highTodo = { ...mockTodo, priority: "HIGH" as const };
      render(<TodoItem todo={highTodo} />);

      expect(screen.getByText("高")).toBeInTheDocument();
    });

    it("should display priority badge for todo with NORMAL priority", () => {
      const normalTodo = { ...mockTodo, priority: "NORMAL" as const };
      render(<TodoItem todo={normalTodo} />);

      expect(screen.getByText("中")).toBeInTheDocument();
    });

    it("should display priority badge for todo with LOW priority", () => {
      const lowTodo = { ...mockTodo, priority: "LOW" as const };
      render(<TodoItem todo={lowTodo} />);

      expect(screen.getByText("低")).toBeInTheDocument();
    });

    it("should apply correct color styling for CRITICAL priority badge", () => {
      const criticalTodo = { ...mockTodo, priority: "CRITICAL" as const };
      render(<TodoItem todo={criticalTodo} />);

      const badge = screen.getByText("緊急");
      // Should have red color scheme
      expect(badge).toBeInTheDocument();
      // Check for red color (DC2626)
      expect(badge.closest("span")).toHaveStyle({ color: "#DC2626" });
    });

    it("should apply correct color styling for HIGH priority badge", () => {
      const highTodo = { ...mockTodo, priority: "HIGH" as const };
      render(<TodoItem todo={highTodo} />);

      const badge = screen.getByText("高");
      // Should have orange color scheme
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")).toHaveStyle({ color: "#EA580C" });
    });
  });
});
