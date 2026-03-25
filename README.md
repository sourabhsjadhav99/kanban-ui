# Kanban Frontend (UI)

Vue 3 + Tailwind frontend for the draggable Kanban board.

## Setup
1. Ensure backend is running at `http://localhost:5000`.
2. Optional: create `ui/vite-project/.env` from `.env.example` if you need custom API URL.
   - Example: `VITE_API_URL=http://localhost:5000/api`
3. Install dependencies:

```bash
cd ui/vite-project
npm install
```

## Run
Development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Default UI URL: `http://localhost:5173`

## Forms
- Add-task modal uses **VeeValidate** (`useForm`, `Field`, `ErrorMessage`) with **Yup** schemas via `@vee-validate/yup` (`toTypedSchema`). See `src/components/NewTaskForm.vue`.

## Data Flow (Vue <-> Node API)
- `useTasks` composable is the central task state layer.
- On load, frontend calls `GET /api/tasks` and stores response in reactive state.
- Add task modal submits to `POST /api/tasks`; success appends task locally.
- Drag and drop updates UI first, then syncs via `PATCH /api/tasks/:id/status`; failures rollback.
- Delete action confirms first, then calls `DELETE /api/tasks/:id` and removes task from local state.
