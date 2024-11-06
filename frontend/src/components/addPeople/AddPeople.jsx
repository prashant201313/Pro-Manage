import React, { useEffect, useState } from 'react';
import "./addPeople.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { fetchAllUsersExceptCurrent } from '../../apis/user';
import { toast } from "react-toastify";
import { assignTasksToUser } from '../../apis/task';

export default function AddPeople({ onClose }) {
    const [allUsers, setAllUsers] = useState([]);
    const [openNames, setOpenNames] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [openConfirmAddPeople, setOpenConfirmAddPeople] = useState(false);

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

    const handleAddClick = (email) => {
        setSelectedEmail(email);
        setOpenNames(false);
    };

    const handleEmail = () => {
        if (!selectedEmail) {
            toast.warn("Select any user from dropdown!");
            return;
        }
        setOpenConfirmAddPeople(true);
    }

    const handleConfirmAddPeople = async () => {
        try {
            const response = await assignTasksToUser(selectedEmail);
            onClose();
            toast.success("Board assigned!");
        } 
        catch (error) {
            toast.error("Error assigning tasks. Please try again.")
        }
    };

    return (
        <div className='addPeople'>
            {!openConfirmAddPeople ? (
                <div className='dialogueBox'>
                    <p>Add people to the board</p>

                    <div className='inputBox'>
                        <input
                            required
                            readOnly
                            type='email'
                            id='email'
                            name='email'
                            placeholder='Enter the email'
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

                                        <button className='add' onClick={() => handleAddClick(user.email)}>Add +</button>
                                    </div>

                                ))}
                            </div>
                        }
                    </div>

                    <div id='btns'>
                        <button id='cancel' className='bton' onClick={onClose}>Cancel</button>
                        <button id='add' className='bton' onClick={handleEmail}>Add email</button>
                    </div>
                </div>
            ) : (
                <div className='addDialogueBox'>
                    <p>{selectedEmail} added to board</p>
                    <button onClick={handleConfirmAddPeople}>Okay, got it!</button>
                </div>  
            )}
        </div>
    );
}
