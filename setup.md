# Workello — Setup Guide

Workello is a collaborative Kanban board designed with an interactive Admin Panel for managing users, boards, tasks, and task completion statuses.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Styling**: TailwindCSS v4
- **State Management**: Zustand (fully replaces previous context and reducer architectures)
- **Routing**: React Router v8
- **Drag and Drop**: `@dnd-kit/react`
- **Persistence**: `localStorage` (through Zustand persist middleware)

## Credentials & Access
Workello has two types of portals, accessed via the main landing page:

| Role | User ID | Password | Access Area |
|------|---------|----------|-------------|
| **Admin** | `Admin` | `Admin123` | `/admin` (Manage Users & Boards) |
| **User** | Dynamically Created | Dynamically Created | `/board` (Personal Kanban Board) |

> *Note: Initial mock users `Alice` (password: `Alice123`) and `Bob` (password: `Bob123`) are pre-seeded for test purposes.*

## Key Features & How it Works

### 1. Welcome & Authentication Gate
- A premium welcome page (`/`) redirects traffic to Admin Login (`/login/admin`) or User Login (`/login/user`).
- Authentication sessions are tracked globally via `useAuthStore` and persisted in the browser storage.

### 2. Admin Panel (/admin)
- **Overview Dashboard**: Displays high-level stats (total cards, users count, subtasks created, overall task completion rate).
- **Users Management**: CRUD workspace allowing administrators to register new users, configure unique passwords/UserIDs, modify details, or remove user access.
- **User Boards view**: Allows live view of any user board. Admins can add cards, modify titles/descriptions, assign colors, add subtasks, toggle completion states, or delete cards/tasks in real-time.

### 3. User Board Space (/board)
- Users see a personal workspace containing lists: **To Do**, **In Progress**, **Done**, and **Backlog**.
- Interactive drag and drop to move cards between columns.
- Move rules are enforced:
  - Cards cannot move backward from *In Progress* to *To Do*.
  - Completed cards cannot leave the *Done* list.
  - Incomplete cards moved to *Done* trigger a task-completion checklist modal.
  - Moving cards with un-started tasks to *In Progress* prompts a validation warning.

## Running Locally

To install dependencies and start the development server, run:

```bash
bun install
bun run dev
```

## Vercel Deployment

Workello is structured as a single-page application (SPA). When building for deployment, use:

```bash
bun run build
```

To ensure React Router routing works correctly on page refresh in production, add a `vercel.json` rewrite file at your root directory:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
