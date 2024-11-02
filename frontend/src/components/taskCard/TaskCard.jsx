import React, { useEffect, useState } from 'react';
import "./taskCard.css";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { deleteTask, getTaskDetails, updateTaskCategory, updateTaskChecklist } from '../../apis/task';
import moment from 'moment';
import { getAssigneeDetails } from '../../apis/user';
import { toast } from "react-toastify";
import ConfirmToDelete from '../confirmToDelete/ConfirmToDelete';
import UpdateTask from '../updateTask/UpdateTask';

export default function TaskCard({ taskId, openChecklist, setOpenChecklist, onCategoryUpdate, callAgain }) {
    const [openMenu, setOpenMenu] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdateTask, setOpenUpdateTask] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assigneeInitials, setAssigneeInitials] = useState('');
    const [assigneeName, seAassigneeName] = useState("");
    const [shareMessage, setShareMessage] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [taskData, setTaskData] = useState({
        title: '',
        selectedPriorityType: '',
        assigneeId: '',
        checkList: [],
        checked: [],
        dueDate: null,
        category: 'To-do'
    });

    function getInitials(name) {
        const words = name.split(' ');

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        } else if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
    }

    const priorityColors = {
        "High": "#FF2473",
        "Moderate": "#18B0FF",
        "Low": "#63C05B",
    };

    const fetchTaskDetails = async () => {
        setLoading(true);
        const response = await getTaskDetails(taskId);
        setLoading(false);
        if (response) {
            setTaskData({
                ...response.data,
                checked: response.data.checked.map(index => parseInt(index)),
            });
        }

        if (response.data.assigneeId) {
            const assigneeResponse = await getAssigneeDetails(response.data.assigneeId);
            if (assigneeResponse) {
                const initials = getInitials(assigneeResponse.data.name);
                setAssigneeInitials(initials);
                seAassigneeName(assigneeResponse.data.name)
            }
        }
    }

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails();
        }
    }, [taskId]);

    const handleCheckboxChange = async (index) => {
        const isChecked = taskData.checked.includes(index);
        const updatedChecked = isChecked
            ? taskData.checked.filter(i => i !== index)
            : [...taskData.checked, index];
        setTaskData(prevState => ({
            ...prevState,
            checked: updatedChecked,
        }));

        // Update the checklist in the database
        const result = await updateTaskChecklist(taskId, updatedChecked);
        if (!result) {
            // If the update fails, revert the state change
            setTaskData(prevState => ({
                ...prevState,
                checked: taskData.checked,
            }));
        }
    };

    const handleCategoryChange = async (category) => {
        setLoading(true);
        const result = await updateTaskCategory(taskId, category);
        setLoading(false);
        if (result) {
            setTaskData(prevState => ({
                ...prevState,
                category
            }));
            onCategoryUpdate(taskId, category);
        }
    };

    const handleShare = (taskId) => {
        const taskLink = `http://localhost:5173/task/${taskId}`;

        navigator.clipboard.writeText(taskLink)
            .then(() => {
                setShareMessage('Link copied!');
            })
            .catch(() => {
                setShareMessage('Failed to copy link');
            });

        setTimeout(() => setShareMessage(''), 3000);
        setOpenMenu(false);
    };

    const deleteSelectedTask = async () => {
        if (selectedTaskId) {
            setLoading(true);
            const response = await deleteTask(selectedTaskId);
            setLoading(false);
            if (response) {
                setOpenDelete(false);
                toast.success("Quiz deleted successfully!");
                callAgain.forEach(func => func());
            }
        }
    };

    const isHighPriorityOverdue = taskData.selectedPriorityType === "High" || taskData.dueDate && moment(taskData.dueDate).isBefore(moment());

    return (
        <>
            {loading ? (
                <div className='taskCard'>
                    <div className='priority-menu'>
                        <div className='priority'>
                            <p className='loading' style={{padding: "0.4rem", width: "170px"}}></p>
                        </div>
                        <BsThreeDots />
                    </div>

                    <p className='title loading' style={{padding: "0.9rem", width: "100%"}}></p>

                    <div className='checklist'>
                        <p className='loading' style={{padding: "0.7rem", width: "50%"}}></p>
                        <div className='arrow' onClick={() => setOpenChecklist(!openChecklist)}>
                            {openChecklist ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                    </div>

                    <div className='btons'>
                        <div id='due-date' className='loading' style={{padding: "0.9rem 1.9rem", borderRadius: "8px", backgroundColor: "#EEECEC"}}></div>

                        <div className='section-btns'>
                            <button className='btn loading' style={{padding: "0.9rem 2.1rem", backgroundColor: "#EEECEC"}}></button>
                            <button className='btn loading' style={{padding: "0.9rem 2.3rem", backgroundColor: "#EEECEC"}}></button>
                            <button className='btn loading' style={{padding: "0.9rem 1.7rem", backgroundColor: "#EEECEC"}}></button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='taskCard'>
                    <div className='priority-menu'>
                        <div className='priority'>
                            <div className='bullet' style={{ backgroundColor: priorityColors[taskData.selectedPriorityType] }}></div>
                            <p>{taskData.selectedPriorityType.toUpperCase()} PRIORITY</p>
                            {taskData.assigneeId &&
                                <div title={assigneeName} className='assignee'>{assigneeInitials}</div>
                            }
                        </div>

                        <BsThreeDots onClick={() => setOpenMenu(prev => !prev)} style={{ cursor: 'pointer', position: "relative" }} />
                        {openMenu &&
                            <div className='menu'>
                                <li 
                                    onClick={() => {
                                        setOpenMenu(false);
                                        setSelectedTaskId(taskData._id);
                                        setOpenUpdateTask(true);
                                    }}
                                >
                                    Edit
                                </li>

                                <li 
                                    onClick={() => handleShare(taskData._id)}
                                >
                                    Share
                                </li>

                                <li 
                                    style={{ color: "#CF3636" }} 
                                    onClick={() => {
                                        setOpenMenu(false);
                                        setSelectedTaskId(taskData._id);
                                        setOpenDelete(true);
                                    }}
                                >
                                    Delete
                                </li>
                            </div>
                        }

                        {shareMessage && <div className='share-message'>{shareMessage}</div>}   
                    </div>

                    <p title={taskData.title} className='title'>{taskData.title}</p>

                    <div className='checklist'>
                        <p>Checklist ({taskData.checked.length}/{taskData.checkList.length})</p>
                        <div className='arrow' onClick={() => setOpenChecklist(!openChecklist)}>
                            {openChecklist ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                    </div>

                    {openChecklist &&
                        <div className='all-checklist'>
                            {taskData.checkList.map((task, index) => (
                                <div className='input-task' key={index}>
                                    <input
                                        type="checkbox"
                                        id={`checkBox-${index}`}
                                        name={`checkBox-${index}`}
                                        checked={taskData.checked.includes(index)}
                                        onChange={() => handleCheckboxChange(index)}
                                    />

                                    <input
                                        readOnly
                                        type="text"
                                        value={task}
                                        className='inputBox'
                                    />
                                </div>
                            ))}
                        </div>
                    }

                    <div className='btons'>
                        {taskData.category === 'Done' ? (
                            <button style={{ backgroundColor: '#63C05B', color: '#FFFFFF', cursor: "default" }} className='btn'>Done</button>
                        ) : taskData.dueDate ? (
                            <button id='due-date' style={isHighPriorityOverdue ? { backgroundColor: '#CF3636', color: '#FFFFFF' } : {}} className='btn'>{moment(taskData.dueDate).format('MMM Do')}</button>
                        ) : (
                            <button></button>
                        )}

                        <div className='section-btns'>
                            <button className='btn' onClick={() => handleCategoryChange('Backlog')}>BACKLOG</button>
                            <button className='btn' onClick={() => handleCategoryChange('In-progress')}>PROGRESS</button>
                            <button className='btn' onClick={() => handleCategoryChange('Done')}>DONE</button>
                        </div>
                    </div>

                    {openDelete && 
                        <ConfirmToDelete 
                            onClose={() => setOpenDelete(false)} 
                            onConfirm={deleteSelectedTask} 
                            loading={loading} 
                        />
                    }

                    {openUpdateTask && selectedTaskId && (
                        <UpdateTask
                            taskId={selectedTaskId}
                            onClose={() => setOpenUpdateTask(false)}
                        />
                    )}
                </div>
            )}
        </>
    );
}
