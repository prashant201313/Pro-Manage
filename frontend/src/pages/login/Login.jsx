import React, { useState } from 'react';
import "./login.css";
import ImageSection from '../../components/imageSection/ImageSection';
import { useNavigate } from 'react-router-dom';
import { CiMail, CiLock } from "react-icons/ci";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import { toast } from "react-toastify";
import { signIn } from '../../apis/user';
import Loader from '../../components/Loader';

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const capitalizeFirstChar = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { ...errors };

    const fields = ['email', 'password'];
    fields.forEach(field => {
      if (formData[field].trim().length === 0 || formData[field] === undefined || formData[field] === null) {
        newErrors[field] = `${capitalizeFirstChar(field)} is required`;
      } else {
        newErrors[field] = "";
      }
    });

    setErrors({ ...newErrors });

    if (newErrors.email === "" && newErrors.password === "") {
      setLoading(true);
      const response = await signIn({ ...formData });
      setLoading(false);
      if (response) {
        toast.success("Logged in successfully!");
        navigate("/pro-manage/board");
      }
      else {
        toast.error("Login failed! Wrong credentials");
      }
    }
  };

  return (
    <>
      <div className='login'>
        <div className='img-section'>
          <ImageSection />
        </div>

        <div className='form-section'>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <div>
              <div className='inputBox' style={{ border: errors.email ? "1.8px solid #CF3636" : "1.8px solid #D0D0D0" }}>
                <CiMail style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
                <input
                  type="email"
                  id='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleOnChange}
                />
              </div>
              <p className='error-para'>{errors.email}</p>
            </div>

            <div>
              <div className='inputBox' style={{ border: errors.password ? "1.8px solid #CF3636" : "1.8px solid #D0D0D0" }}>
                <CiLock style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  id='password'
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleOnChange}
                />
                <span onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <PiEyeSlash /> : <PiEye />}
                </span>
              </div>
              <p className='error-para'>{errors.password}</p>
            </div>

            <button type="submit" className='btn reg'>Log in</button>
            <p>Have no account yet ?</p>
            <button className='btn log' onClick={() => navigate("/register")}>Register</button>

          </form>

        </div>
      </div>

      {loading &&
        <div className='loader'>
          <Loader />
        </div>
      }
    </>
  );
}
