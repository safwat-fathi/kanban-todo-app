<template>
  <h1 class="text-5xl font-bold text-center my-8">Todo Kanban Board</h1>
  <div class="p-4">
    <!-- Search Input -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search tasks..."
      class="w-full px-3 py-2 border rounded mb-4"
    />

    <!-- Kanban Columns -->
    <div class="space-x-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <KanbanColumn
        title="Todo"
        status="todo"
        :tasks="tasksByStatus('todo')"
        :searchQuery="searchQuery"
        @move-task="moveTask"
        @add-task="openAddTaskModal"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
      />
      <KanbanColumn
        title="In Progress"
        status="inProgress"
        :tasks="tasksByStatus('inProgress')"
        :searchQuery="searchQuery"
        @move-task="moveTask"
        @add-task="openAddTaskModal"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
      />
      <KanbanColumn
        title="In Review"
        status="inReview"
        :tasks="tasksByStatus('inReview')"
        :searchQuery="searchQuery"
        @move-task="moveTask"
        @add-task="openAddTaskModal"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
      />
      <KanbanColumn
        title="Done"
        status="done"
        :tasks="tasksByStatus('done')"
        :searchQuery="searchQuery"
        @move-task="moveTask"
        @add-task="openAddTaskModal"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
      />
    </div>

    <!-- Task Form Modal -->
    <TaskFormModal
      v-if="showTaskFormModal"
      :task="selectedTask"
      :isEdit="isEdit"
      @save="saveTask"
      @close="closeTaskModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '../store/useTaskStore';
import KanbanColumn from './KanbanColumn.vue';
import TaskFormModal from './TaskFormModal.vue';
import { Task } from '../types/task';
import { nanoid } from 'nanoid';

const taskStore = useTaskStore();

const showTaskFormModal = ref(false);
const selectedTask = ref<Task | null>(null);
const searchQuery = ref('');
const isEdit = ref(false);

/**
 * Filter tasks by status and search query.
 * @param status - The status of the tasks to filter.
 * @returns An array of tasks matching the status and search query.
 */
const tasksByStatus = (status: Task['status']) => {
  return taskStore.tasks.filter(task => task.status === status);
};

/**
 * Move a task to a new status.
 * @param taskId - The ID of the task to move.
 * @param newStatus - The new status to assign to the task.
 */
const moveTask = (taskId: string, newStatus: Task['status']) => {
  taskStore.moveTask(taskId, newStatus);
};

/**
 * Open the modal to add a new task.
 * @param status - The status to assign to the new task.
 */
const openAddTaskModal = (status: Task['status']) => {
  isEdit.value = false; // We're adding a new task
  selectedTask.value = {
    id: nanoid(),
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
    status,
    createdAt: new Date().toISOString(),
  };
  showTaskFormModal.value = true;
};

/**
 * Open the modal to edit an existing task.
 * @param taskId - The ID of the task to edit.
 */
const openEditTaskModal = (taskId: string) => {
  isEdit.value = true; // We're editing an existing task
  const task = taskStore.tasks.find(task => task.id === taskId);
  if (task) {
    selectedTask.value = { ...task };
    showTaskFormModal.value = true;
  }
};

/**
 * Save a new or edited task.
 * @param task - The task object to save.
 */
const saveTask = (task: Task) => {
  if (taskStore.tasks.some(t => t.id === task.id)) {
    taskStore.updateTask(task);
  } else {
    taskStore.addTask(task);
  }
  closeTaskModal();
};

/**
 * Close the task form modal.
 */
const closeTaskModal = () => {
  showTaskFormModal.value = false;
  selectedTask.value = null;
};

/**
 * Delete a task.
 * @param taskId - The ID of the task to delete.
 */
const deleteTask = (taskId: string) => {
  taskStore.deleteTask(taskId);
};
</script>
