import React, { useEffect, useState } from 'react';
import "./createTask.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDelete } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { fetchAllUsersExceptCurrent } from '../../apis/user';
import { toast } from "react-toastify";
import { saveTask } from '../../apis/task';
import Loader from "../Loader";
import moment from 'moment';

export default function CreateTask({ onClose, callAgain }) {
    const [allUsers, setAllUsers] = useState([]);
    const [openNames, setOpenNames] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [taskData, setTaskData] = useState({
        title: '',
        selectedPriorityType: '',
        assigneeId: '',
        checkList: [],
        checked: [],
        dueDate: null,
        category: 'To-do'
    });

    const formatDate = (date) => {
        if (!date) return "";
        return moment(date).format("MM/DD/YYYY");
    };

    function getInitials(name) {
        const words = name.split(' ');

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        } else if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
    }

    const fetchUsers = async () => {
        const response = await fetchAllUsersExceptCurrent();
        setAllUsers(response.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePriorityChange = (priority) => {
        setTaskData(prevState => ({
            ...prevState,
            selectedPriorityType: priority,
        }));
    };

    const handleAddClick = (email, id) => {
        setSelectedEmail(email);
        setTaskData(prevState => ({
            ...prevState,
            assigneeId: id,
        }));
        setOpenNames(false);
    };

    const handleCheckListChange = (index, value) => {
        const updatedCheckList = [...taskData.checkList];
        updatedCheckList[index] = value;
        setTaskData(prevState => ({
            ...prevState,
            checkList: updatedCheckList,
        }));
    };

    const addCheckListItem = () => {
        setTaskData(prevState => ({
            ...prevState,
            checkList: [...prevState.checkList, ''],
        }));
    };

    const handleCheckboxChange = (index) => {
        const isChecked = taskData.checked.includes(index);
        const updatedChecked = isChecked
            ? taskData.checked.filter(i => i !== index)
            : [...taskData.checked, index];
        setTaskData(prevState => ({
            ...prevState,
            checked: updatedChecked,
        }));
    };

    const removeCheckListItem = (index) => {
        const updatedCheckList = taskData.checkList.filter((_, i) => i !== index);
        const updatedChecked = taskData.checked
            .filter(i => i !== index)
            .map(i => (i > index ? i - 1 : i));

        setTaskData(prevState => ({
            ...prevState,
            checkList: updatedCheckList,
            checked: updatedChecked,
        }));
    };

    const handleDateChange = (date) => {
        setTaskData(prevState => ({
            ...prevState,
            dueDate: date,
        }));
        setShowDatePicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isContinueEnabled) {
            toast.error("Please fill all the starred fields!");
            return;
        }

        setLoading(true);
        const formattedTaskData = {
            ...taskData,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        };
        const response = await saveTask(formattedTaskData);
        setLoading(false);

        if (response) {
            onClose();
            toast.success("Story created successfully!");
            callAgain.forEach(func => func());
        }
    }

    const isContinueEnabled = taskData.title.trim() !== "" && taskData.selectedPriorityType !== "" && taskData.checkList.length >= 1;

    return (
        <div className='create-task'>
            {!loading ? (
                <div className='dialogueBox'>
                    <form onSubmit={handleSubmit}>
                        <div className='title'>
                            <label htmlFor='title'>Title <span style={{ color: "#FF0000" }}>*</span></label>
                            <input
                                required
                                type="text"
                                id='title'
                                name='title'
                                placeholder="Enter Task Title"
                                value={taskData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='priorityType'>
                            <p>Select Priority <span style={{ color: "#FF0000" }}>*</span></p>
                            <div className='priority' style={{ backgroundColor: taskData.selectedPriorityType === "High" ? "#EEECEC" : "" }} onClick={() => handlePriorityChange('High')}>
                                <div className='bullet' style={{ backgroundColor: "#FF2473" }}></div>
                                <p>HIGH PRIORITY</p>
                            </div>

                            <div className='priority' style={{ backgroundColor: taskData.selectedPriorityType === "Moderate" ? "#EEECEC" : "" }} onClick={() => handlePriorityChange('Moderate')}>
                                <div className='bullet' style={{ backgroundColor: "#18B0FF" }}></div>
                                <p>MODERATE PRIORITY</p>
                            </div>

                            <div className='priority' style={{ backgroundColor: taskData.selectedPriorityType === "Low" ? "#EEECEC" : "" }} onClick={() => handlePriorityChange('Low')}>
                                <div className='bullet' style={{ backgroundColor: "#63C05B" }}></div>
                                <p>LOW PRIORITY</p>
                            </div>
                        </div>

                        <div className='addAssignee'>
                            <p>Assign to</p>
                            <div className='inputBox'>
                                <input
                                    readOnly
                                    type='email'
                                    id='email'
                                    name='email'
                                    placeholder='Add a assignee'
                                    onClick={() => setOpenNames((prev) => !prev)}
                                    value={selectedEmail}
                                />
                                <span onClick={() => setOpenNames((prev) => !prev)}>
                                    {openNames ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </span>

                                {openNames &&
                                    <div className='allUsers'>
                                        {allUsers.map((user, index) => (
                                            <div key={index} className='userOption'>
                                                <div className='initials-email'>
                                                    <span className='initials'>{getInitials(user.name)}</span>
                                                    <span className='email'>{user.email}</span>
                                                </div>

                                                <button className='add' onClick={() => handleAddClick(user.email, user._id)}>Assign</button>
                                            </div>

                                        ))}
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='taskList'>
                            <p>Checklist ({taskData.checked.length}/{taskData.checkList.length}) <span style={{ color: "#FF0000" }}>*</span></p>

                            <div className='all-tasks'>
                                {taskData.checkList.map((task, index) => (
                                    <div key={index} className='input-task'>
                                        <input
                                            type="checkbox"
                                            id={`checkBox-${index}`}
                                            name={`checkBox-${index}`}
                                            checked={taskData.checked.includes(index)}
                                            onChange={() => handleCheckboxChange(index)}
                                        />

                                        <input
                                            required
                                            type="text"
                                            placeholder='Enter task to do'
                                            value={task}
                                            onChange={(e) => handleCheckListChange(index, e.target.value)}
                                            className='inputBox'
                                        />
                                        <MdDelete onClick={() => removeCheckListItem(index)} style={{ color: "#CF3636", fontSize: "1.5rem", cursor: "pointer" }} />
                                    </div>
                                ))}

                                <p className='addList' onClick={addCheckListItem}>+ Add New</p>
                            </div>
                        </div>

                        <div className='btons'>
                            <button
                                className='due-date'
                                type='button'
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                {formatDate(taskData.dueDate) || "Select Due Date"}
                            </button>

                            {showDatePicker && (
                                <div className='datePicker-container'>
                                    <DatePicker
                                        selected={taskData.dueDate || null}
                                        onChange={handleDateChange}
                                        dateFormat="MM/dd/yyyy"
                                        inline
                                    />
                                </div>
                            )}

                            <div className='cancel-save'>
                                <button id='cancel' className='btns' onClick={onClose}>Cancel</button>
                                <button id='save' className='btns' type='submit'>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
}
