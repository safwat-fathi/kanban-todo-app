import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { Task } from '../types/task';

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref<Task[]>([]);

  // Load tasks from Local Storage on initialization
  const loadTasks = () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks.value = JSON.parse(storedTasks);
    }
  };

  // Watch for changes and save to Local Storage
  watch(
    tasks,
    newTasks => {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    },
    { deep: true }
  );

  const addTask = (task: Task) => {
    tasks.value.push(task);
  };

  const updateTask = (updatedTask: Task) => {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  };

  const deleteTask = (taskId: string) => {
    tasks.value = tasks.value.filter(task => task.id !== taskId);
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.value.find(task => task.id === taskId);
    if (task) {
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();
    }
  };

  return {
    tasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
});
