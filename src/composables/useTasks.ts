import { computed, ref } from "vue";
import axios from "axios";
import type { Task, TaskStatus } from "../types/task";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const taskList = ref<Task[]>([]);
const draggedTaskId = ref<string | null>(null);
const isLoadingTasks = ref(false);
const isLoadingTaskDetails = ref(false);
const isUpdatingStatus = ref(false);
const isCreatingTask = ref(false);
const isDeletingTask = ref(false);
const errorMessage = ref("");

export const useTasks = () => {

  const fetchTasks = async () => {
    isLoadingTasks.value = true;
    errorMessage.value = "";

    try {
      const response = await axios.get<Task[]>(`${API_BASE_URL}/tasks`);
      taskList.value = response.data;
    } catch (error) {
      console.error(error);
      errorMessage.value = "Unable to load tasks. Please check if API server is running.";
    } finally {
      isLoadingTasks.value = false;
    }
  };

  const createTask = async (payload: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    if (!payload.title.trim() || isCreatingTask.value) {
      return false;
    }

    isCreatingTask.value = true;
    errorMessage.value = "";

    try {
      const response = await axios.post<Task>(`${API_BASE_URL}/tasks`, {
        title: payload.title.trim(),
        description: payload.description.trim(),
        status: payload.status,
      });
      taskList.value.unshift(response.data);
      return true;
    } catch (error) {
      console.error(error);
      errorMessage.value = "Failed to create task. Please try again.";
      return false;
    } finally {
      isCreatingTask.value = false;
    }
  };

  const getTaskById = async (taskId: string) => {
    isLoadingTaskDetails.value = true;
    errorMessage.value = "";
    try {
      const response = await axios.get<Task>(`${API_BASE_URL}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      errorMessage.value = "Failed to load task details.";
      return null;
    } finally {
      isLoadingTaskDetails.value = false;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (isDeletingTask.value) {
      return false;
    }

    const taskIndex = taskList.value.findIndex((task) => task._id === taskId);
    if (taskIndex < 0) {
      return false;
    }

    const [removedTask] = taskList.value.splice(taskIndex, 1);
    isDeletingTask.value = true;
    errorMessage.value = "";

    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      return true;
    } catch (error) {
      taskList.value.splice(taskIndex, 0, removedTask);
      console.error(error);
      errorMessage.value = "Failed to delete task. Please try again.";
      return false;
    } finally {
      isDeletingTask.value = false;
    }
  };

  const taskGroups = computed(() =>
    taskList.value.reduce<Record<TaskStatus, Task[]>>(
      (groups, task) => {
        groups[task.status].push(task);
        return groups;
      },
      { todo: [], "in-progress": [], done: [] }
    )
  );

  const updateTaskStatus = async (nextStatus: TaskStatus) => {
    if (!draggedTaskId.value || isUpdatingStatus.value) {
      return false;
    }

    const taskIndex = taskList.value.findIndex((task) => task._id === draggedTaskId.value);
    if (taskIndex < 0) {
      return false;
    }

    const selectedTask = taskList.value[taskIndex];
    const previousStatus = selectedTask.status;

    if (previousStatus === nextStatus) {
      draggedTaskId.value = null;
      return false;
    }

    taskList.value[taskIndex] = { ...selectedTask, status: nextStatus };
    isUpdatingStatus.value = true;
    errorMessage.value = "";

    try {
      await axios.patch(`${API_BASE_URL}/tasks/${selectedTask._id}/status`, {
        status: nextStatus,
      });
      return true;
    } catch (error) {
      taskList.value[taskIndex] = { ...selectedTask, status: previousStatus };
      console.error(error);
      errorMessage.value = "Failed to sync task status. Change reverted.";
      return false;
    } finally {
      isUpdatingStatus.value = false;
      draggedTaskId.value = null;
    }
  };

  const setDraggedTask = (taskId: string) => {
    draggedTaskId.value = taskId;
  };

  return { errorMessage, isCreatingTask, isDeletingTask, isLoadingTasks, isLoadingTaskDetails, isUpdatingStatus, taskGroups, fetchTasks, createTask, getTaskById, deleteTask, setDraggedTask, updateTaskStatus};
};
