import { createRouter, createWebHistory } from "vue-router";
import BoardView from "../views/BoardView.vue";
import TaskView from "../views/TaskView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "board", component: BoardView },
    { path: "/tasks/:id", name: "task-view", component: TaskView },
  ],
});

export default router;
