<template>
  <div class="p-4">
    <!-- Search Input -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search tasks..."
      class="w-full px-3 py-2 border rounded mb-4"
    />

    <!-- Kanban Columns -->
    <div class="flex space-x-4">
      <KanbanColumn
        title="Todo"
        status="todo"
        :tasks="tasksByStatus('todo')"
        @move-task="moveTask"
        @add-task="openAddTaskModal"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
      />
      <KanbanColumn
        title="In Progress"
        status="inProgress"
        :tasks="tasksByStatus('inProgress')"
        @move-task="moveTask"
        @add-task="openAddTaskModal"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
      />
      <KanbanColumn
        title="In Review"
        status="inReview"
        :tasks="tasksByStatus('inReview')"
        @move-task="moveTask"
        @add-task="openAddTaskModal"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
      />
      <KanbanColumn
        title="Done"
        status="done"
        :tasks="tasksByStatus('done')"
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
      @save="saveTask"
      @close="closeTaskModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskStore } from '../store/useTaskStore';
import KanbanColumn from './KanbanColumn.vue';
import TaskFormModal from './TaskFormModal.vue';
import { Task } from '../types/task';
import { nanoid } from 'nanoid';

const taskStore = useTaskStore();

const showTaskFormModal = ref(false);
const selectedTask = ref<Task | null>(null);
const searchQuery = ref('');

/**
 * Filter tasks by status and search query.
 * @param status - The status of the tasks to filter.
 * @returns A computed ref of tasks matching the status and search query.
 */
const tasksByStatus = (status: Task['status']) => {
  return computed(() =>
    taskStore.tasks.filter(
      task =>
        task.status === status &&
        (task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          task.description
            ?.toLowerCase()
            .includes(searchQuery.value.toLowerCase()))
    )
  );
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
  selectedTask.value = {
    id: nanoid(),
    title: '',
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

<style scoped>
/* Add any styles specific to KanbanBoard.vue here */
</style>
