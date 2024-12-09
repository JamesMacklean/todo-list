'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import api from '../lib/api'; // Import your axios instance

// Function to fetch tasks from Django API
const fetchTasks = async () => {
  const { data } = await api.get('/tasks/');
  return data;  // Return the list of tasks
};

// Function to add a new task
const addTask = async (newTask: { name: string }) => {
  const { data } = await api.post('/tasks/', newTask);
  return data;  // Return the newly added task
};

// Function to mark a task as completed/incomplete
const toggleTaskCompletion = async (taskId: number) => {
  const { data } = await api.patch(`/tasks/${taskId}/`);
  return data;  // Return the updated task
};

// Function to delete a task
const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}/`);
  return taskId;  // Return the ID of the deleted task
};

export default function Home() {
  const queryClient = useQueryClient();  // To invalidate and refetch data after mutations

  // Use React Query to fetch tasks
  const { data: tasks, isLoading } = useQuery('tasks', fetchTasks);
  
  // Use React Query to mutate (add) tasks
  const mutation = useMutation(addTask, {
    onSuccess: () => {
      // Invalidate and refetch tasks after adding a new one
      queryClient.invalidateQueries('tasks');
    },
  });

  // Use React Query to mutate (toggle completion) tasks
  const toggleMutation = useMutation(toggleTaskCompletion, {
    onSuccess: () => {
      // Invalidate and refetch tasks after toggling completion
      queryClient.invalidateQueries('tasks');
    },
  });

  // Use React Query to mutate (delete) tasks
  const deleteMutation = useMutation(deleteTask, {
    onSuccess: (taskId) => {
      // Invalidate and refetch tasks after deleting a task
      queryClient.invalidateQueries('tasks');
    },
  });

  // Manage the input field for adding a new task
  const [newTask, setNewTask] = useState('');

  // Function to handle adding a task when the button is clicked
  const handleAddTask = () => {
    if (newTask.trim()) {
      mutation.mutate({ name: newTask });  // Call the mutation to add the task
      setNewTask('');  // Clear the input field
    }
  };

  // Function to handle toggling task completion
  const handleToggleTask = (taskId: number) => {
    toggleMutation.mutate(taskId);
  };

  // Function to handle deleting a task
  const handleDeleteTask = (taskId: number) => {
    deleteMutation.mutate(taskId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">To-Do List</h1>
      
      {/* Task Input */}
      <div className="flex mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}  // Update the input value
          className="p-2 border rounded-l-md w-2/3"
          placeholder="Enter new task"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Add Task
        </button>
      </div>

      {/* Show loading state */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        // Display tasks
        <ul className="space-y-2">
          {tasks?.map((task: { id: number; name: string; is_completed: boolean }) => (
            <li key={task.id} className="border p-2 rounded-md">
              <div className="flex justify-between items-center">
                <span className={task.is_completed ? 'line-through' : ''}>
                  {task.name}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="bg-green-500 text-white p-1 rounded"
                  >
                    {task.is_completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
