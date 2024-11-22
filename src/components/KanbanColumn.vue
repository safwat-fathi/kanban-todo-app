<template>
  <div class="bg-gray-100 p-2 rounded">
    <h2 class="text-xl font-bold mb-2">{{ title }}</h2>

    <div class="relative">
      <div
        v-if="!tasks.length"
        class="absolute inset-0 flex items-center justify-center space-y-2 text-gray-500"
      >
        No tasks in this column.
      </div>
      <draggable
        :list="filteredTasks"
        :group="{ name: 'tasks', pull: true, put: true }"
        @change="onDragChange"
        class="space-y-2 min-h-[100px] bg-white rounded-md p-2"
        item-key="id"
      >
        <!-- Task Items -->
        <template #item="{ element }">
          <TaskCard
            :task="element"
            @edit-task="$emit('edit-task', element.id)"
            @delete-task="$emit('delete-task', element.id)"
          />
        </template>
      </draggable>
    </div>
    <button
      class="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded"
      @click="$emit('add-task', status)"
    >
      Add Task
    </button>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import { Task } from '../types/task';
import { computed } from 'vue';

const { title, status, tasks, searchQuery } = defineProps<{
  title: string;
  status: Task['status'];
  tasks: Task[];
  searchQuery: string;
}>();

const emits = defineEmits([
  'move-task',
  'add-task',
  'edit-task',
  'delete-task',
]);

const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

/**
 * Computed property to filter tasks based on status and search query.
 * Also handles updates to the task list when tasks are moved.
 */
const filteredTasks = computed({
  get() {
    return tasks
      .filter(
        task =>
          task.status === status &&
          (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort(
        (a, b) =>
          priorityOrder[a.priority || 'low'] -
          priorityOrder[b.priority || 'low']
      );
  },
  set(newTasks: Task[]) {
    newTasks.forEach(task => {
      if (task.status !== status) {
        emits('move-task', task.id, status);
      }
    });
  },
});

/**
 * Handle the change event when items are moved.
 * @param event - The drag event object.
 */
const onDragChange = (event: any) => {
  if (event.added) {
    const task = event.added.element as Task;
    emits('move-task', task.id, status);
  }
};
</script>

<style scoped>
/* Add any styles specific to KanbanColumn.vue here */
</style>
