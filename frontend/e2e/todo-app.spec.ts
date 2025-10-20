import { test, expect } from "@playwright/test";

/**
 * E2E Tests: TodoList Application Full Feature Tests
 */

test.describe("TodoList Application", () => {
  test.beforeEach(async ({ page }) => {
    // Visit application before each test
    await page.goto("/");

    // Clear localStorage to avoid test interference
    await page.evaluate(() => localStorage.clear());

    // Clear backend database by deleting all todos
    const response = await page.evaluate(async () => {
      const todosResponse = await fetch("/api/todos");
      const data = await todosResponse.json();
      const todos = data.data || [];

      // Delete all todos
      await Promise.all(
        todos.map((todo: { id: string }) => fetch(`/api/todos/${todo.id}`, { method: "DELETE" }))
      );

      return { deleted: todos.length };
    });

    console.log(`Cleaned up ${response.deleted} todos from backend`);

    await page.reload();
  });

  /**
   * E2E-1: Add todo workflow
   */
  test("should successfully add a new todo", async ({ page }) => {
    // 1. Find input field
    const input = page.getByPlaceholder(/what needs to be done/i);
    await expect(input).toBeVisible();

    // 2. Enter todo title
    await input.fill("Buy milk");

    // 3. Click add button
    const addButton = page.getByRole("button", { name: /add todo/i });
    await addButton.click();

    // 4. Verify todo appears in list
    await expect(page.getByText("Buy milk")).toBeVisible();

    // 5. Verify input is cleared
    await expect(input).toHaveValue("");
  });

  /**
   * E2E-2: View todo list
   */
  test("should display all todos", async ({ page }) => {
    // Add multiple todos
    const input = page.getByPlaceholder(/what needs to be done/i);
    const addButton = page.getByRole("button", { name: /add todo/i });

    const todos = ["Write code", "Meeting", "Exercise"];

    for (const todo of todos) {
      await input.fill(todo);
      await addButton.click();
      await expect(page.getByText(todo)).toBeVisible();
    }

    // Verify statistics section exists and shows correct counts
    const statsSection = page.getByRole("region", { name: /todo statistics/i });
    await expect(statsSection).toBeVisible();

    // Check total count
    const totalStat = statsSection.getByLabel(/total todos/i);
    await expect(totalStat).toContainText("3");

    // Check active count
    const activeStat = statsSection.getByLabel(/active todos/i);
    await expect(activeStat).toContainText("3");
  });

  /**
   * E2E-3: Toggle completion status
   */
  test("should toggle todo completion status", async ({ page }) => {
    // 1. Add todo
    await page.getByPlaceholder(/what needs to be done/i).fill("Test task");
    await page.getByRole("button", { name: /add todo/i }).click();

    // 2. Find checkbox for this todo
    const checkbox = page.getByRole("checkbox", { name: /mark "Test task" as complete/i });
    await expect(checkbox).not.toBeChecked();

    // 3. Check checkbox to mark as complete
    const toggleResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/todos/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await checkbox.check();
    await toggleResponsePromise;

    // Re-locate checkbox after state change (aria-label changes from "as complete" to "as incomplete")
    const checkedCheckbox = page.getByRole("checkbox", { name: /mark "Test task" as incomplete/i });
    await expect(checkedCheckbox).toBeChecked();

    // 4. Verify line-through style
    const todoText = page.getByText("Test task").first();
    await expect(todoText).toHaveCSS("text-decoration-line", "line-through");

    // 5. Uncheck to mark as incomplete
    const untoggleResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/todos/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await checkedCheckbox.uncheck();
    await untoggleResponsePromise;

    // Re-locate checkbox after state change (aria-label changes back to "as complete")
    const uncheckedCheckbox = page.getByRole("checkbox", { name: /mark "Test task" as complete/i });
    await expect(uncheckedCheckbox).not.toBeChecked();
    await expect(todoText).not.toHaveCSS("text-decoration-line", "line-through");
  });

  /**
   * E2E-4: Edit todo content
   */
  test("should edit todo", async ({ page }) => {
    // 1. Add todo
    await page.getByPlaceholder(/what needs to be done/i).fill("Original title");
    await page.getByRole("button", { name: /add todo/i }).click();

    // 2. Double click to enter edit mode
    const todoText = page.getByRole("button", { name: /todo: original title/i });
    await todoText.dblclick();

    // 3. Modify title - find the edit input by label
    const editInput = page.getByLabel(/edit "original title"/i);
    await editInput.clear();
    await editInput.fill("New title");

    // 4. Press Enter to save
    await editInput.press("Enter");

    // 5. Verify title is updated
    await expect(page.getByText("New title")).toBeVisible();
    await expect(page.getByText("Original title")).not.toBeVisible();
  });

  /**
   * E2E-5: Delete todo
   */
  test("should delete todo", async ({ page }) => {
    // 1. Add todo
    await page.getByPlaceholder(/what needs to be done/i).fill("Task to delete");
    await page.getByRole("button", { name: /add todo/i }).click();

    // 2. Verify todo exists
    await expect(page.getByText("Task to delete")).toBeVisible();

    // 3. Click delete button
    const deleteButton = page.getByRole("button", { name: /delete "Task to delete"/i });
    await deleteButton.click();

    // 4. Verify todo is removed
    await expect(page.getByText("Task to delete")).not.toBeVisible();

    // 5. Verify empty state message (check the actual message from TodoList.tsx line 80)
    await expect(page.getByText(/no todos yet/i)).toBeVisible();
  });

  /**
   * E2E-6: Filter functionality
   */
  test("should filter todos (All/Active/Completed)", async ({ page }) => {
    // 1. Add multiple todos
    const input = page.getByPlaceholder(/what needs to be done/i);
    const addButton = page.getByRole("button", { name: /add todo/i });

    // Add first active task
    await input.fill("Active task 1");
    await addButton.click();
    await expect(page.getByText("Active task 1")).toBeVisible();

    // Add second active task
    await input.fill("Active task 2");
    await addButton.click();
    await expect(page.getByText("Active task 2")).toBeVisible();

    // Add completed task
    await input.fill("Completed task");
    await addButton.click();
    await expect(page.getByText("Completed task")).toBeVisible();

    // 2. Mark one as complete
    const completeResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/todos/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await page.getByRole("checkbox", { name: /mark "Completed task" as complete/i }).check();
    await completeResponsePromise;

    // 3. Test Active filter - use aria-label to avoid matching todo titles
    await page.getByRole("button", { name: /show active todos/i }).click();
    await expect(page.getByRole("button", { name: /todo: active task 1/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /todo: active task 2/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /todo: completed task/i })).not.toBeVisible();

    // 4. Test Completed filter
    await page.getByRole("button", { name: /show completed todos/i }).click();
    await expect(page.getByRole("button", { name: /todo: completed task/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /todo: active task 1/i })).not.toBeVisible();

    // 5. Test All filter
    await page.getByRole("button", { name: /show all todos/i }).click();
    await expect(page.getByRole("button", { name: /todo: active task 1/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /todo: completed task/i })).toBeVisible();
  });

  /**
   * E2E-7: Input validation
   */
  test("should reject empty title", async ({ page }) => {
    // 1. Try to submit empty title
    const addButton = page.getByRole("button", { name: /add todo/i });
    await addButton.click();

    // 2. Verify error message is displayed
    await expect(page.getByText(/title cannot be empty/i)).toBeVisible();

    // 3. Verify no todo was added
    await expect(page.getByText(/no todos yet/i)).toBeVisible();
  });

  /**
   * E2E-8: Backend API persistence
   */
  test("should persist todos via backend API", async ({ page }) => {
    // 1. Add todo
    await page.getByPlaceholder(/what needs to be done/i).fill("Persistence test");
    await page.getByRole("button", { name: /add todo/i }).click();

    // 2. Reload page (should fetch from backend API)
    await page.reload();

    // 3. Verify todo still exists (fetched from backend)
    await expect(page.getByRole("button", { name: /todo: persistence test/i })).toBeVisible();
  });

  /**
   * E2E-9: Keyboard shortcuts
   */
  test("should support keyboard shortcuts", async ({ page }) => {
    // 1. Press / to focus input
    await page.keyboard.press("/");
    const input = page.getByPlaceholder(/what needs to be done/i);
    await expect(input).toBeFocused();

    // 2. Enter title and press Enter to submit
    await input.fill("Keyboard test");
    await page.keyboard.press("Enter");

    // 3. Verify todo was added
    await expect(page.getByText("Keyboard test")).toBeVisible();
  });

  /**
   * E2E-10: Responsive design
   */
  test("should work on mobile", async ({ page }) => {
    // Set mobile viewport size
    await page.setViewportSize({ width: 375, height: 667 });

    // Add todo
    await page.getByPlaceholder(/what needs to be done/i).fill("Mobile test");
    await page.getByRole("button", { name: /add todo/i }).click();

    // Verify functionality works
    await expect(page.getByText("Mobile test")).toBeVisible();

    // Verify delete button is visible on mobile (not hover-only)
    const deleteButton = page.getByRole("button", { name: /delete "Mobile test"/i });
    await expect(deleteButton).toBeVisible();
  });
});
