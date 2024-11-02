import React, { useState } from 'react';
import "./confirmToLogout.css"
import Loader from '../Loader';
import { logout } from '../../apis/user';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function ConfirmToLogout({ onClose }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const response = await logout();
        setLoading(false);
        if (response) {
            toast.success("Logged out successfully!");
            navigate("/login");
        }
    }

    return (
        <div className='confirmLogout'>
            {!loading ? (
                <div className='dialogueBox'>
                    <p>Are you sure you want to Logout?</p>

                    <div id='btns'>
                        <button id='logout' className='bton' onClick={handleLogout}>Yes, Logout</button>
                        <button id='cancel' className='bton' onClick={onClose}>Cancel</button>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
}
