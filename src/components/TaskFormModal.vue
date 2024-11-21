<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded w-96">
      <h2 class="text-xl font-bold mb-4">
        {{ isEdit ? 'Edit Task' : 'Add Task' }}
      </h2>
      <form @submit.prevent="handleSubmit(onSubmit)">
        <!-- Title -->
        <div class="mb-4">
          <label class="block text-gray-700">Title</label>
          <input
            v-model="values.title"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
          <span class="text-red-500">{{ errors.title }}</span>
        </div>
        <!-- Description -->
        <div class="mb-4">
          <label class="block text-gray-700">Description</label>
          <textarea
            v-model="values.description"
            class="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <!-- Due Date -->
        <div class="mb-4">
          <label class="block text-gray-700">Due Date</label>
          <input
            v-model="values.dueDate"
            type="date"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <!-- Priority -->
        <div class="mb-4">
          <label class="block text-gray-700">Priority</label>
          <select
            v-model="values.priority"
            class="w-full px-3 py-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <!-- Buttons -->
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 bg-gray-500 text-white rounded"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { Task } from '../types/task';

const props = defineProps<{
  task: Task | null;
}>();

const emits = defineEmits(['save', 'close']);

const isEdit = computed(() => props.task !== null);

const taskSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  dueDate: yup.string().nullable(),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required(),
});

const { handleSubmit, values, errors } = useForm({
  validationSchema: taskSchema,
  initialValues: {
    title: props.task?.title || '',
    description: props.task?.description || '',
    dueDate: props.task?.dueDate || '',
    priority: props.task?.priority || 'low',
  },
});

/**
 * Handle form submission.
 * @param values - The form values.
 */
const onSubmit = (values: any) => {
  emits('save', {
    ...props.task,
    ...values,
    updatedAt: new Date().toISOString(),
  });
};
</script>

<style scoped>
/* Add any styles specific to TaskFormModal.vue here */
</style>
