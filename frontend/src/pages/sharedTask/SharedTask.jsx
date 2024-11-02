import React, { useEffect, useState } from 'react';
import "./sharedTask.css";
import { useParams } from 'react-router-dom';
import { getTaskDetails } from '../../apis/task';
import moment from 'moment';
import Loader from "../../components/Loader";

export default function SharedTask() {
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 429);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 429);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [taskData, setTaskData] = useState({
        title: '',
        selectedPriorityType: '',
        assigneeId: '',
        checkList: [],
        checked: [],
        dueDate: null,
        category: 'To-do'
    });

    const priorityColors = {
        "High": "#FF2473",
        "Moderate": "#18B0FF",
        "Low": "#63C05B",
    };

    const fetchTaskDetails = async () => {
        setLoading(true);
        const response = await getTaskDetails(params?.id);
        setLoading(false);
        if (response) {
            setTaskData({
                ...response.data,
                checked: response.data.checked.map(index => parseInt(index)),
            });
        }
    }

    useEffect(() => {
        if (params.id) {
            fetchTaskDetails();
        }
    }, [params.id]);

    const isHighPriorityOverdue = taskData.selectedPriorityType === "High" || taskData.dueDate && moment(taskData.dueDate).isBefore(moment());

    return (
        <div className='sharedTask'>
            <div className='brand'>
                <img width={18} src="/proIcon.png" alt="proIcon" />
                <h5>Pro Manage</h5>
            </div>

            {!loading ? (
                <>
                    <div className='task'>
                        <div className='task-details'>
                            <div className='priority'>
                                <div className='bullet' style={{ backgroundColor: priorityColors[taskData.selectedPriorityType] }}></div>
                                <p>{taskData.selectedPriorityType.toUpperCase()} PRIORITY</p>
                            </div>

                            <p title={taskData.title} className='title'>{taskData.title}</p>

                            <p className='checklist'>Checklist ({taskData.checked.length}/{taskData.checkList.length})</p>

                            <div className='all-checklist'>
                                {taskData.checkList.map((task, index) => (
                                    <div className='input-task' key={index}>
                                        <input
                                            type="checkbox"
                                            id={`checkBox-${index}`}
                                            name={`checkBox-${index}`}
                                            checked={taskData.checked.includes(index)}
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

                            {taskData.dueDate && (
                                <div className='due-date'>
                                    <span>Due Date</span>
                                    <button style={isHighPriorityOverdue ? { backgroundColor: '#CF3636', color: '#FFFFFF' } : {}}>{moment(taskData.dueDate).format('MMM Do')}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className='loadingTask'>
                    <Loader />
                </div>
            )}

        </div>
    );
}
