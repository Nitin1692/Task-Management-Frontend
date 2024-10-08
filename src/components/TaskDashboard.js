import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const TaskDashboard = ({ token, setToken }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [duedate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);

      if (Array.isArray(response.data.result)) {
        setTasks(response.data.result);
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, setToken]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await axios.post(
        API_URL,
        { title, description, status, duedate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      resetForm();
      // Fetch tasks again after creating a new task
      await fetchTasks(); 
    } catch (error) {
      console.error("Failed to create task", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.duedate);
    setEditingTaskId(task._id);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/${editingTaskId}`,
        { title, description, status, duedate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      resetForm();
      // Fetch tasks again after updating the task
      await fetchTasks(); 
    } catch (error) {
      console.error("Failed to update task", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setError("");
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch tasks again after deleting a task
      await fetchTasks(); 
    } catch (error) {
      console.error("Failed to delete task", error);
      setError("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setDueDate("");
    setEditingTaskId(null);
  };

  return (
    <div>
      <h2>Task Dashboard</h2>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      <form onSubmit={editingTaskId ? handleUpdateTask : handleCreateTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          value={duedate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {editingTaskId ? "Update Task" : "Create Task"}
        </button>
        {editingTaskId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <ul>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Due Date: {new Date(task.duedate).toLocaleDateString()}</p>
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No tasks available.</li>
        )}
      </ul>
    </div>
  );
};

export default TaskDashboard;
