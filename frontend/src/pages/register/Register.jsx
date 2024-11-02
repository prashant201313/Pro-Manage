import React, { useState } from 'react';
import "./register.css";
import { useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { CiMail, CiLock } from "react-icons/ci";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import ImageSection from '../../components/imageSection/ImageSection';
import { toast } from "react-toastify";
import { signUp } from "../../apis/user";
import Loader from "../../components/Loader";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    const fields = ['name', 'email', 'password', 'confirmPassword'];
    fields.forEach(field => {
      if (formData[field].trim().length === 0 || formData[field] === undefined || formData[field] === null) {
        newErrors[field] = `${capitalizeFirstChar(field)} is required`;
      } else {
        newErrors[field] = "";
      }
    });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password = "Weak password (must be atleast 8 characters with 1 uppercase, 1 lowercase, 1 number & 1 special symbol)";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors({ ...newErrors });

    if (newErrors.name === "" && newErrors.email === "" && newErrors.password === "" && newErrors.confirmPassword === "") {
      setLoading(true);
      const response = await signUp(formData);
      setLoading(false);
      if (response) {
        toast.success("User registered successfully!");
        navigate("/login");
      }
      else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <>
    <div className='register'>
      <div className='img-section'>
        <ImageSection />
      </div>

      <div className='form-section'>
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>

          <div>
            <div className='inputBox' style={{ border: errors.name ? "1.8px solid #CF3636" : "1.8px solid #D0D0D0" }}>
              <BsPerson style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
              <input
                type="text"
                id='name'
                name='name'
                placeholder='Name'
                value={formData.name}
                onChange={handleOnChange}
              />
            </div>
            <p className='error-para'>{errors.name}</p>
          </div>

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

          <div>
            <div className='inputBox' style={{ border: errors.confirmPassword ? "1.8px solid #CF3636" : "1.8px solid #D0D0D0" }}>
              <CiLock style={{ color: "#828282", fontSize: "1.7rem", margin: "0 0.5rem" }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleOnChange}
              />
              <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? <PiEyeSlash /> : <PiEye />}
              </span>
            </div>
            <p className='error-para'>{errors.confirmPassword}</p>
          </div>

          <button type="submit" className='btn reg'>Register</button>
          <p>Have an account ?</p>
          <button className='btn log' onClick={() => navigate("/login")}>Log in</button>

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
