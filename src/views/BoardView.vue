<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BoardHeader from "../components/BoardHeader.vue";
import NewTaskForm from "../components/NewTaskForm.vue";
import KanbanColumn from "../components/KanbanColumn.vue";
import DeleteConfirmModal from "../components/DeleteConfirmModal.vue";
import { useTasks } from "../composables/useTasks";
import { useToasts } from "../composables/useToasts";
import { boardColumns } from "../constants/boardColumns";
import type { TaskStatus } from "../types/task";

const router = useRouter();
const isAddTaskFormVisible = ref(false);
const taskIdPendingDelete = ref<string | null>(null);

const selectedStatus = ref<TaskStatus | "all">("all");
const titleSearch = ref("");

const { tasks, errorMessage, isCreatingTask, isDeletingTask, isLoadingTasks, isUpdatingStatus, fetchTasks, createTask, deleteTask, setDraggedTask, updateTaskStatus } = useTasks();
const { pushToast } = useToasts();

const normalizedTitleSearch = computed(() => titleSearch.value.trim().toLowerCase());

const filteredTaskGroups = computed(() =>
  tasks.value.reduce<Record<TaskStatus, typeof tasks.value>>(
    (groups, task) => {
      const matchesStatus = selectedStatus.value === "all" || task.status === selectedStatus.value;
      const matchesTitle = !normalizedTitleSearch.value || task.title.toLowerCase().includes(normalizedTitleSearch.value);

      if (matchesStatus && matchesTitle) {
        groups[task.status].push(task);
      }

      return groups;
    },
    { todo: [], "in-progress": [], done: [] }
  )
);

const hasFilteredTasks = computed(() =>
  boardColumns.some((column) => filteredTaskGroups.value[column.id].length > 0)
);

const handleCreateTask = async (payload: { title: string; description: string; status: TaskStatus }) => {
  const wasCreated = await createTask(payload);
  if (wasCreated) {
    isAddTaskFormVisible.value = false;
    pushToast("Task created successfully.", "success");
  } else {
    pushToast("Failed to create task.", "error");
  }
};

const openTaskDetails = (taskId: string) => {
  router.push(`/tasks/${taskId}`);
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
  <section class="mx-auto flex h-full max-w-7xl flex-col">
    <BoardHeader :is-form-visible="isAddTaskFormVisible" @toggle-form="isAddTaskFormVisible = !isAddTaskFormVisible" />

    <p v-if="errorMessage" class="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
      {{ errorMessage }}
    </p>

    <NewTaskForm
      v-if="isAddTaskFormVisible"
      :is-submitting="isCreatingTask"
      @create="handleCreateTask"
      @cancel="isAddTaskFormVisible = false"
    />

    <div class="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
      <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span>Status</span>
        <select
          v-model="selectedStatus"
          class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </label>

      <label class="flex flex-1 items-center gap-2 text-sm font-medium text-slate-700">
        <span>Search</span>
        <input
          v-model="titleSearch"
          type="text"
          placeholder="Search by task title..."
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>
    </div>

    <p v-if="isLoadingTasks" class="rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-600">
      Loading tasks...
    </p>

    <div v-else class="grid min-h-0 flex-1 gap-6 lg:grid-cols-3 lg:auto-rows-fr">
      <KanbanColumn
        v-for="column in boardColumns"
        :key="column.id"
        :column="column"
        :tasks="filteredTaskGroups[column.id]"
        @start-drag="setDraggedTask"
        @drop-task="handleDropTask(column.id)"
        @delete-task="requestDeleteTask"
        @open-task="openTaskDetails"
      />
    </div>

    <p
      v-if="!isLoadingTasks && !hasFilteredTasks"
      class="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500"
    >
      No tasks match the selected filters.
    </p>

    <DeleteConfirmModal
      :visible="Boolean(taskIdPendingDelete)"
      @cancel="cancelDeleteTask"
      @confirm="confirmDeleteTask"
    />

    <p v-if="isUpdatingStatus" class="mt-4 text-sm text-slate-500">Syncing status...</p>
    <p v-if="isDeletingTask" class="mt-1 text-sm text-slate-500">Deleting task...</p>
  </section>
</template>
