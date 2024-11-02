import React from 'react';
import "./confirmToDelete.css";
import Loader from "../Loader";

export default function ConfirmToDelete({ onClose, onConfirm, loading }) {

    return (
        <div className='confirmDelete'>
            {!loading ? (
                <div className='dialogueBox'>
                    <p>Are you sure you want to Delete?</p>

                    <div id='btns'>
                        <button id='delete' className='bton' onClick={onConfirm}>Yes, Delete</button>
                        <button id='cancel' className='bton' onClick={onClose}>Cancel</button>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
}
