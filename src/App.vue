<script setup lang="ts">
import { onMounted, ref } from "vue";
import BoardHeader from "./components/BoardHeader.vue";
import NewTaskForm from "./components/NewTaskForm.vue";
import KanbanColumn from "./components/KanbanColumn.vue";
import ToastList from "./components/ToastList.vue";
import { useTasks } from "./composables/useTasks";
import { useToasts } from "./composables/useToasts";
import type { BoardColumn, TaskStatus } from "./types/task";

const boardColumns: BoardColumn[] = [
  { id: "todo", title: "To Do", badgeClass: "bg-slate-200 text-slate-700" },
  { id: "in-progress", title: "In Progress", badgeClass: "bg-amber-200 text-amber-800" },
  { id: "done", title: "Done", badgeClass: "bg-emerald-200 text-emerald-800" },
];

const isAddTaskFormVisible = ref(false);
const taskIdPendingDelete = ref<string | null>(null);

const {
  errorMessage,
  isCreatingTask,
  isDeletingTask,
  isLoadingTasks,
  isUpdatingStatus,
  taskGroups,
  fetchTasks,
  createTask,
  deleteTask,
  setDraggedTask,
  updateTaskStatus,
} = useTasks();
const { toasts, pushToast, removeToast } = useToasts();

const handleCreateTask = async (payload: {
  title: string;
  description: string;
  status: TaskStatus;
}) => {
  const wasCreated = await createTask(payload);
  if (wasCreated) {
    isAddTaskFormVisible.value = false;
    pushToast("Task created successfully.", "success");
  } else {
    pushToast("Failed to create task.", "error");
  }
};

const requestDeleteTask = (taskId: string) => {
  taskIdPendingDelete.value = taskId;
};

const cancelDeleteTask = () => {
  taskIdPendingDelete.value = null;
};

const confirmDeleteTask = async () => {
  if (!taskIdPendingDelete.value) {
    return;
  }

  const wasDeleted = await deleteTask(taskIdPendingDelete.value);
  if (wasDeleted) {
    pushToast("Task deleted successfully.", "warning");
    taskIdPendingDelete.value = null;
  } else {
    pushToast("Failed to delete task.", "error");
  }
};

const handleDropTask = async (status: TaskStatus) => {
  const wasUpdated = await updateTaskStatus(status);
  if (wasUpdated) {
    pushToast("Task status updated.", "info");
  } else if (!errorMessage.value) {
    pushToast("Status update skipped.", "warning");
  } else {
    pushToast("Failed to update task status.", "error");
  }
};

onMounted(fetchTasks);
</script>

<template>
  <main class="h-screen bg-slate-100 p-6 md:p-10">
    <ToastList :items="toasts" @dismiss="removeToast" />
    <section class="mx-auto flex h-full max-w-7xl flex-col">
      <BoardHeader
        :is-form-visible="isAddTaskFormVisible"
        @toggle-form="isAddTaskFormVisible = !isAddTaskFormVisible"
      />

      <p v-if="errorMessage" class="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
        {{ errorMessage }}
      </p>

      <NewTaskForm
        v-if="isAddTaskFormVisible"
        :is-submitting="isCreatingTask"
        @create="handleCreateTask"
        @cancel="isAddTaskFormVisible = false"
      />

      <p v-if="isLoadingTasks" class="rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-600">
        Loading tasks...
      </p>

      <div v-else class="grid min-h-0 flex-1 gap-6 lg:grid-cols-3 lg:auto-rows-fr">
        <KanbanColumn
          v-for="column in boardColumns"
          :key="column.id"
          :column="column"
          :tasks="taskGroups[column.id]"
          @start-drag="setDraggedTask"
          @drop-task="handleDropTask(column.id)"
          @delete-task="requestDeleteTask"
        />
      </div>

      <div
        v-if="taskIdPendingDelete"
        class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
      >
        <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
          <h3 class="text-lg font-semibold text-slate-800">Delete Task?</h3>
          <p class="mt-2 text-sm text-slate-600">
            This action will permanently remove the task from your board.
          </p>
          <div class="mt-4 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              @click="cancelDeleteTask"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              @click="confirmDeleteTask"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>

      <p v-if="isUpdatingStatus" class="mt-4 text-sm text-slate-500">Syncing status...</p>
      <p v-if="isDeletingTask" class="mt-1 text-sm text-slate-500">Deleting task...</p>
    </section>
  </main>
</template>
