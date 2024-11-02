import React, { useEffect, useState } from 'react';
import "./analytics.css";
import { getAllTasks, getAssignedTasks } from '../../apis/task';
import { currentUserDetails } from '../../apis/user';
import Loader from '../../components/Loader';

export default function Analytics() {
  const [allTasks, setAllTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async () => {
    setLoading(true);
    const response = await currentUserDetails();
    setLoading(false);
    if (response) {
      localStorage.setItem('userId', response.UserData._id);
    }
  };

  const fetchAllTasks = async () => {
    setLoading(true);
    const response = await getAllTasks();
    setLoading(false);
    if (response) {
      setAllTasks(response?.data || []);
    }
  }

  const fetchAssignedTasks = async (userId) => {
    const response = await getAssignedTasks(userId);
    if (response) {
      setAssignedTasks(response?.data || []);
    }
  };

  useEffect(() => {
    fetchUserDetails().then(() => {
      const userId = localStorage.getItem('userId');
      fetchAllTasks();
      fetchAssignedTasks(userId);
    });
  }, []);

  // Counts for all tasks
  const backlogOfUser = allTasks.filter(task => task.category === 'Backlog').length;
  const todoOfUser = allTasks.filter(task => task.category === 'To-do').length;
  const inProgressOfUser = allTasks.filter(task => task.category === 'In-progress').length;
  const completedOfUser = allTasks.filter(task => task.category === 'Done').length;

  const highPriorityOfUser = allTasks.filter(task => task.selectedPriorityType === 'High').length;
  const moderatePriorityOfUser = allTasks.filter(task => task.selectedPriorityType === 'Moderate').length;
  const lowPriorityOfUser = allTasks.filter(task => task.selectedPriorityType === 'Low').length;
  const dueDateOfUser = allTasks.filter(task => task.dueDate).length;

  // Counts for assigned tasks
  const backlogAssigned = assignedTasks.filter(task => task.category === 'Backlog').length;
  const todoAssigned = assignedTasks.filter(task => task.category === 'To-do').length;
  const inProgressAssigned = assignedTasks.filter(task => task.category === 'In-progress').length;
  const completedAssigned = assignedTasks.filter(task => task.category === 'Done').length;

  const highPriorityAssigned = assignedTasks.filter(task => task.selectedPriorityType === 'High').length;
  const moderatePriorityAssigned = assignedTasks.filter(task => task.selectedPriorityType === 'Moderate').length;
  const lowPriorityAssigned = assignedTasks.filter(task => task.selectedPriorityType === 'Low').length;
  const dueDateAssigned = assignedTasks.filter(task => task.dueDate).length;

  // Merging counts for total counts
  const allBacklog = backlogOfUser + backlogAssigned;
  const alltodo = todoOfUser + todoAssigned;
  const allInProgress = inProgressOfUser + inProgressAssigned;
  const allComplete = completedOfUser + completedAssigned;

  const allHighPriority = highPriorityOfUser + highPriorityAssigned;
  const allModeratePriority = moderatePriorityOfUser + moderatePriorityAssigned;
  const allLowPriority = lowPriorityOfUser + lowPriorityAssigned;
  const allDueDate = dueDateOfUser + dueDateAssigned;

  return (
    <div className='analytics'>
      <h3>Analytics</h3>

      <div className='analytics-data'>
        <div className='analytics-box'>
          <div className='task-data'>
            <li>Backlog Tasks</li>
            <p>{allBacklog}</p>
          </div>

          <div className='task-data'>
            <li>To-do Tasks</li>
            <p>{alltodo}</p>
          </div>

          <div className='task-data'>
            <li>In-Progress Tasks</li>
            <p>{allInProgress}</p>
          </div>

          <div className='task-data'>
            <li>Completed Tasks</li>
            <p>{allComplete}</p>
          </div>
        </div>

        <div className='analytics-box'>
          <div className='task-data'>
            <li>Low Priority</li>
            <p>{allLowPriority}</p>
          </div>

          <div className='task-data'>
            <li>Moderate Priority</li>
            <p>{allModeratePriority}</p>
          </div>

          <div className='task-data'>
            <li>High Priority</li>
            <p>{allHighPriority}</p>
          </div>

          <div className='task-data'>
            <li>Due Date Tasks</li>
            <p>{allDueDate}</p>
          </div>
        </div>
      </div>

      {loading &&
        <div className='loader'>
          <Loader />
        </div>
      }      
    </div>
  );
}
