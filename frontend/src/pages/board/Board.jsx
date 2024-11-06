import React, { useEffect, useState } from 'react';
import "./board.css";
import moment from 'moment';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiGroupLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { VscCollapseAll } from "react-icons/vsc";
import { currentUserDetails } from '../../apis/user';
import AddPeople from '../../components/addPeople/AddPeople';
import CreateTask from '../../components/createTask/CreateTask';
import TaskCard from '../../components/taskCard/TaskCard';
import { getAllTasks, getAssignedTasks, getTasksAssignedByUser } from '../../apis/task';
import Loader from '../../components/Loader';

export default function Board() {
  const [userName, setUserName] = useState("User");
  const [openToAddPeople, setOpenToAddPeople] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [multipleAssignedTask, setMultipleAssignedTask] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openChecklist, setOpenChecklist] = useState({});       // for individual checklists
  const [collapsedCategories, setCollapsedCategories] = useState({});       // for category-wise collapse
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async () => {
    const response = await currentUserDetails();
    if (response) {
      setUserName(response.UserData.name);
      localStorage.setItem('userId', response.UserData._id);
    }
  };

  const fetchTasks = async (filter) => {
    const userId = localStorage.getItem('userId');
    let originalUserId;

    setLoading(true);
    const [allTasksResponse, assignedTasksResponse, multipleAssignedTasksResponse] = await Promise.all([
      getAllTasks(filter),
      getAssignedTasks(userId, filter),
      getTasksAssignedByUser(originalUserId, filter)
    ]);

    setLoading(false);

    setAllTasks(allTasksResponse?.data || []);
    setAssignedTasks(assignedTasksResponse?.data || []);
    setMultipleAssignedTask(multipleAssignedTasksResponse?.data || []);
  };

  useEffect(() => {
    fetchUserDetails().then(() => fetchTasks(selectedFilter));
  }, []);

  const handleFilterSelection = (filter) => {
    setSelectedFilter(filter);
    setOpenFilter(false);
    fetchTasks(filter);
  };

  const collapseCategoryChecklists = (category) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    setOpenChecklist(prevChecklists =>
      Object.keys(prevChecklists).reduce((acc, taskId) => {
        if (categorizedTasks[category].some(task => task._id === taskId)) {
          acc[taskId] = false;
        } else {
          acc[taskId] = prevChecklists[taskId];
        }
        return acc;
      }, {})
    );
  };

  const handleCategoryUpdate = (taskId, newCategory) => {
    setAllTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, category: newCategory } : task
      )
    );
    setAssignedTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, category: newCategory } : task
      )
    );
  };

  const categorizedTasks = [...allTasks, ...assignedTasks, ...multipleAssignedTask].reduce((categories, task) => {
    const category = task.category || 'To-do';
    categories[category] = categories[category] || [];
    categories[category].push(task);
    return categories;
  }, {});

  return (
    <div className='board'>
      <div className='info'>
        <div className='utils'>
          <h3>Welcome! {userName}</h3>
          <p className='date'>{moment().format("Do MMM, YYYY")}</p>
        </div>

        <div className='utils'>
          <div className='board-add'>
            <span className='dashboard'>Board</span>
            <span className='add-people' onClick={() => setOpenToAddPeople(true)}><RiGroupLine /> Add people</span>
          </div>

          <p className='filter' onClick={() => setOpenFilter(prev => !prev)}>
            {selectedFilter}
            {openFilter ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </p>

          {openFilter &&
            <div className='all-filters'>
              <li onClick={() => handleFilterSelection("All")}>All</li>
              <li onClick={() => handleFilterSelection("Today")}>Today</li>
              <li onClick={() => handleFilterSelection("This week")}>This week</li>
              <li onClick={() => handleFilterSelection("This month")}>This month</li>
            </div>
          }
        </div>
      </div>

      <div className='all-categories'>
        {['Backlog', 'To-do', 'In-progress', 'Done'].map((category) => (
          <div key={category} className='categories'>
            <div className='category-name'>
              <p>{category}</p>
              <span>
                {category === 'To-do' && (
                  <GoPlus onClick={() => setOpenCreateTask(true)} title='Add a task' style={{ fontSize: "1.3rem", color: "#000000", cursor: "pointer" }} />
                )}
                <VscCollapseAll onClick={() => collapseCategoryChecklists(category)} title='Collapse all' style={{ fontSize: "1.3rem", color: "#767575", cursor: "pointer" }} />
              </span>
            </div>

            <div className='created-task'>
              {(categorizedTasks[category] || []).map(task => (
                <TaskCard
                  key={task._id}
                  taskId={task._id}
                  category={category}
                  openChecklist={openChecklist[task._id]}
                  setOpenChecklist={(value) => setOpenChecklist(prev => ({ ...prev, [task._id]: value }))}
                  onCategoryUpdate={handleCategoryUpdate}
                  callAgain={[() => fetchTasks(selectedFilter)]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {loading &&
        <div className='loader'>
          <Loader />
        </div>
      }

      {openToAddPeople &&
        <AddPeople
          onClose={() => {
            setOpenToAddPeople(false);
            fetchTasks(selectedFilter);
          }}
        />
      }

      {openCreateTask && <CreateTask onClose={() => setOpenCreateTask(false)} callAgain={[() => fetchTasks(selectedFilter)]} />}
    </div>
  );
}
