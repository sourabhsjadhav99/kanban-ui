<script setup lang="ts">
import { onMounted, ref } from "vue";
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

const { errorMessage, isCreatingTask, isDeletingTask, isLoadingTasks, isUpdatingStatus, taskGroups, fetchTasks, createTask, deleteTask, setDraggedTask, updateTaskStatus } = useTasks();
const { pushToast } = useToasts();

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
        @open-task="openTaskDetails"
      />
    </div>

    <DeleteConfirmModal
      :visible="Boolean(taskIdPendingDelete)"
      @cancel="cancelDeleteTask"
      @confirm="confirmDeleteTask"
    />

    <p v-if="isUpdatingStatus" class="mt-4 text-sm text-slate-500">Syncing status...</p>
    <p v-if="isDeletingTask" class="mt-1 text-sm text-slate-500">Deleting task...</p>
  </section>
</template>
