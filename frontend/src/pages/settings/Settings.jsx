import React, { useState } from 'react';
import "./settings.css";
import { BsPerson } from "react-icons/bs";
import { CiMail, CiLock } from "react-icons/ci";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import { updateUserFields } from '../../apis/user';
import { toast } from "react-toastify";
import Loader from '../../components/Loader';

export default function Settings() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [updateFormData, setUpdateFormData] = useState({
        newName: "",
        newEmail: "",
        oldPassword: "",
        newPassword: ""
    });

    const handleOnChange = (e) => {
        setUpdateFormData({
            ...updateFormData,
            [e.target.name]: e.target.value
        })
    };

    const validateForm = () => {
        const { newName, newEmail, oldPassword, newPassword } = updateFormData;

        // Check if no field is filled
        if (!newName && !newEmail && !oldPassword && !newPassword) {
            toast.error("Please fill any one field to update");
            return false;
        }

        // Check if multiple fields are filled for name or email
        if ((newName && newEmail) || (newName && oldPassword) || (newEmail && oldPassword)) {
            toast.error("Please fill one field at a time!");
            return false;
        }

        // Check if only one password field is filled
        if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
            toast.error("Please fill both old password and new password to update");
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (newPassword && !passwordRegex.test(newPassword)) {
            toast.error("New password is weak (must be atleast 8 characters with 1 uppercase, 1 lowercase, 1 number & 1 special symbol)");
            return false;
        }

        return true;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const response = await updateUserFields(updateFormData);
        setLoading(false);

        if (response?.message === "Old password is incorrect") {
            toast.error("Old password is incorrect!");
        }
        else if (response) {
            toast.success("User details updated successfully!");
            setUpdateFormData({
                newName: "",
                newEmail: "",
                oldPassword: "",
                newPassword: ""
            });
        }
        else {
            toast.error("An error occurred while updating details");
        }
    };

    return (
        <div className='settings'>
            <h3>Settings</h3>

            <div className='form-section'>
                <form onSubmit={handleUpdate}>
                    <div className='inputBox'>
                        <BsPerson style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
                        <input
                            type="text"
                            id='newName'
                            name='newName'
                            placeholder='Update Name'
                            value={updateFormData.newName}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className='inputBox'>
                        <CiMail style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
                        <input
                            type="email"
                            id='newEmail'
                            name='newEmail'
                            placeholder='Update Email'
                            value={updateFormData.newEmail}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className='inputBox'>
                        <CiLock style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
                        <input
                            type={showOldPassword ? "text" : "password"}
                            id='oldPassword'
                            name='oldPassword'
                            placeholder='Old Password'
                            value={updateFormData.oldPassword}
                            onChange={handleOnChange}
                        />
                        <span onClick={() => setShowOldPassword((prev) => !prev)}>
                            {showOldPassword ? <PiEyeSlash /> : <PiEye />}
                        </span>
                    </div>

                    <div className='inputBox'>
                        <CiLock style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id='newPassword'
                            name='newPassword'
                            placeholder='New Password'
                            value={updateFormData.newPassword}
                            onChange={handleOnChange}
                        />
                        <span onClick={() => setShowNewPassword((prev) => !prev)}>
                            {showNewPassword ? <PiEyeSlash /> : <PiEye />}
                        </span>
                    </div>

                    <button type="submit" className='btn'>Update</button>
                </form>
            </div>

            {loading &&
                <div className='loader'>
                    <Loader />
                </div>
            }
        </div>
    );
}
