-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_todos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "priority" TEXT NOT NULL DEFAULT 'LOW',
    "dueDate" DATETIME
);
INSERT INTO "new_todos" ("completedAt", "createdAt", "description", "dueDate", "id", "isCompleted", "priority", "title", "updatedAt") SELECT "completedAt", "createdAt", "description", "dueDate", "id", "isCompleted", "priority", "title", "updatedAt" FROM "todos";
DROP TABLE "todos";
ALTER TABLE "new_todos" RENAME TO "todos";
CREATE INDEX "todos_priority_idx" ON "todos"("priority");
CREATE INDEX "todos_isCompleted_priority_idx" ON "todos"("isCompleted", "priority");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
