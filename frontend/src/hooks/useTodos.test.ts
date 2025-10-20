import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTodoActions, useInitTodos, useTodos } from "./useTodos";
import { useTodoStore } from "@/store/todoStore";
import type { Todo } from "@/types/todo";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useTodoActions Hook", () => {
  beforeEach(() => {
    // Reset store state before each test
    useTodoStore.setState({
      todos: [],
      filter: "all",
      loading: false,
      error: null,
    });
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe("fetchTodos", () => {
    it("should fetch todos from API when called manually", async () => {
      const mockTodos: Todo[] = [
        {
          id: "1",
          title: "Test Todo",
          isCompleted: false,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockTodos }),
      });

      const { result } = renderHook(() => useTodoActions());

      // Manually call fetchTodos (no automatic fetch on mount)
      await result.current.fetchTodos();

      await waitFor(() => {
        const state = useTodoStore.getState();
        expect(state.todos).toHaveLength(1);
        expect(state.todos[0].title).toBe("Test Todo");
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/todos");
    });

    it("should NOT fetch todos automatically on mount", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

      renderHook(() => useTodoActions());

      // Should NOT call fetch automatically
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should set loading state while fetching", async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, data: [] }),
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useTodoActions());

      // Manually trigger fetch
      const fetchPromise = result.current.fetchTodos();

      // Should be loading immediately
      expect(useTodoStore.getState().loading).toBe(true);

      await fetchPromise;

      await waitFor(() => {
        expect(useTodoStore.getState().loading).toBe(false);
      });
    });

    it("should handle fetch errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: {
            code: "SERVER_ERROR",
            message: "Failed to fetch todos",
          },
        }),
      });

      const { result } = renderHook(() => useTodoActions());

      await result.current.fetchTodos();

      await waitFor(() => {
        const state = useTodoStore.getState();
        expect(state.error).toBe("Failed to fetch todos");
        expect(state.loading).toBe(false);
      });
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useTodoActions());

      await result.current.fetchTodos();

      await waitFor(() => {
        const state = useTodoStore.getState();
        expect(state.error).toBe("Network error");
        expect(state.loading).toBe(false);
      });
    });
  });

  describe("createTodo", () => {
    it("should create a todo via API", async () => {
      const newTodo: Todo = {
        id: "123",
        title: "New Todo",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock create request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ success: true, data: newTodo }),
      });

      const { result } = renderHook(() => useTodoActions());

      // Call createTodo
      const created = await result.current.createTodo({ title: "New Todo" });

      expect(created).toEqual(newTodo);
      expect(mockFetch).toHaveBeenCalledWith("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Todo" }),
      });
    });

    it("should handle create errors", async () => {
      // Mock create error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Title is required",
          },
        }),
      });

      const { result } = renderHook(() => useTodoActions());

      await expect(result.current.createTodo({ title: "" })).rejects.toThrow("Title is required");
    });
  });

  describe("updateTodo", () => {
    it("should update a todo via API", async () => {
      const updatedTodo: Todo = {
        id: "1",
        title: "Updated Todo",
        isCompleted: true,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date(),
        completedAt: new Date(),
      };

      // Mock update request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: updatedTodo }),
      });

      const { result } = renderHook(() => useTodoActions());

      const updated = await result.current.updateTodo("1", {
        title: "Updated Todo",
        isCompleted: true,
      });

      expect(updated).toEqual(updatedTodo);
      expect(mockFetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated Todo", isCompleted: true }),
      });
    });

    it("should handle update errors", async () => {
      // Mock update error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Todo not found",
          },
        }),
      });

      const { result } = renderHook(() => useTodoActions());

      await expect(result.current.updateTodo("999", { title: "Updated" })).rejects.toThrow(
        "Todo not found"
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo via API", async () => {
      // Mock delete request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const { result } = renderHook(() => useTodoActions());

      await result.current.deleteTodo("1");

      expect(mockFetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "DELETE",
      });
    });

    it("should handle delete errors", async () => {
      // Mock delete error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Todo not found",
          },
        }),
      });

      const { result } = renderHook(() => useTodoActions());

      await expect(result.current.deleteTodo("999")).rejects.toThrow("Todo not found");
    });
  });

  describe("toggleTodo", () => {
    it("should toggle todo completion via API", async () => {
      const initialTodo: Todo = {
        id: "1",
        title: "Test Todo",
        isCompleted: false,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };

      const toggledTodo: Todo = {
        ...initialTodo,
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date(),
      };

      // Set initial store state
      useTodoStore.setState({ todos: [initialTodo] });

      // Mock toggle request (PUT with isCompleted: true)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: toggledTodo }),
      });

      const { result } = renderHook(() => useTodoActions());

      const updated = await result.current.toggleTodo("1");

      expect(updated.isCompleted).toBe(true);
      expect(updated.completedAt).toBeTruthy();
      expect(mockFetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: true }),
      });
    });
  });
});

describe("useInitTodos Hook", () => {
  beforeEach(() => {
    useTodoStore.setState({
      todos: [],
      filter: "all",
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("should fetch todos from API on mount", async () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Test Todo",
        isCompleted: false,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTodos }),
    });

    renderHook(() => useInitTodos());

    await waitFor(() => {
      const state = useTodoStore.getState();
      expect(state.todos).toHaveLength(1);
      expect(state.todos[0].title).toBe("Test Todo");
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/todos");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should set loading state while fetching on mount", async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true, data: [] }),
              }),
            100
          )
        )
    );

    renderHook(() => useInitTodos());

    // Should be loading immediately after mount
    expect(useTodoStore.getState().loading).toBe(true);

    await waitFor(() => {
      expect(useTodoStore.getState().loading).toBe(false);
    });
  });

  it("should return action functions", () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    const { result } = renderHook(() => useInitTodos());

    expect(result.current).toHaveProperty("fetchTodos");
    expect(result.current).toHaveProperty("createTodo");
    expect(result.current).toHaveProperty("updateTodo");
    expect(result.current).toHaveProperty("deleteTodo");
    expect(result.current).toHaveProperty("toggleTodo");
  });
});

describe("useTodos Hook (deprecated)", () => {
  beforeEach(() => {
    useTodoStore.setState({
      todos: [],
      filter: "all",
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("should behave like useInitTodos for backward compatibility", async () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Test Todo",
        isCompleted: false,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTodos }),
    });

    renderHook(() => useTodos());

    await waitFor(() => {
      const state = useTodoStore.getState();
      expect(state.todos).toHaveLength(1);
      expect(state.todos[0].title).toBe("Test Todo");
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/todos");
  });
});
