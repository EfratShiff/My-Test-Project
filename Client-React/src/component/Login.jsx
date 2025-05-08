

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const {
        register: registerAdmin,
        handleSubmit: handleAdminSubmit,
        formState: { errors: adminErrors }
    } = useForm();

    const {
        register: registerNewUser,
        handleSubmit: handleAddUser,
        reset: resetAddUser,
        formState: { errors: addUserErrors }
    } = useForm();

    const {
        register: registerDeleteUser,
        handleSubmit: handleDeleteUser,
        reset: resetDeleteUser
    } = useForm();

    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role === 'manager') {
            setIsManager(true);
        }
    }, []);

    const onLoginSubmit = async (data) => {
        try {
            setPasswordError("");
            setUserNotFound(false);
            setShowAdminLogin(false);

            const res = await axios.post('http://localhost:8080/User/getUser', data);
            const token = res.data.token;
            const role = res.data.role;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                alert("התחברת בהצלחה!");

                if (role === 'manager') {
                    alert("ברוך הבא מנהל!");
                    setIsManager(true);
                    navigate('/ManagerMenu'); 
                } else if(role==='student'){
                    alert("ברוך הבא תלמיד!");
                    navigate('/StudentMenu'); 
                }
                else if(role==='teacher'){
                    alert("ברוך הבא מורה!");
                    navigate('/TeacherMenu'); 
                }
            }
        } catch (err) {
            const message = err.response?.data?.error;

            if (message === "Invalid password") {
                setPasswordError("הסיסמה שגויה, נסה שוב.");
                setValue("password", "");
            } else if (message === "User not found") {
                setUserNotFound(true);
            } else {
                alert("שגיאה: " + (message || "בעיה כללית"));
            }
        }
    };

    const onAdminLoginSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:8080/User/getUser', {
                name: "מנהל",
                email: data.adminUseremail,
                password: data.adminPassword,
                roleToCheck: "manager"
            });

            const token = res.data.token;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', 'manager');
                setIsManager(true);
                alert("ברוך הבא מנהל!");
                navigate('/login');
            }
        } catch (err) {
            alert("שגיאה בכניסת מנהל: " + (err.response?.data?.error || "בעיה כללית"));
        }
    };

    const addUser = async (data) => {
        alert(JSON.stringify(data));
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/User/createUser', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("המשתמש נוסף בהצלחה");
            resetAddUser();
        } catch (err) {
            alert("שגיאה בהוספת המשתמש: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };

    const deleteUser = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/User/deleteUser/${data.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("המשתמש נמחק בהצלחה");
            resetDeleteUser();
        } catch (err) {
            alert("שגיאה במחיקת המשתמש: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsManager(false);
        navigate('/login');
    };

    return (
        <>
            {!isManager ? (
                <>
                    <form onSubmit={handleSubmit(onLoginSubmit)}>
                        <h3>כניסה למערכת</h3>
                        <input placeholder="אימייל" {...register("email", { required: true })} />
                        <input placeholder="סיסמה" type="password" {...register("password", { required: true })} />
                        {errors.email && <span>יש להזין אימייל</span>}<br />
                        {errors.password && <span>יש להזין סיסמה</span>}<br />
                        {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}<br />
                        <input type="submit" value="התחברות" />
                    </form>

                    {userNotFound && (
                        <div style={{ marginTop: '20px' }}>
                            <p style={{ color: 'red' }}>המשתמש אינו קיים במערכת.</p>
                            {!showAdminLogin && (
                                <button type="button" onClick={() => setShowAdminLogin(true)}>
                                    כניסה כמנהל
                                </button>
                            )}
                        </div>
                    )}

                    {showAdminLogin && (
                        <form onSubmit={handleAdminSubmit(onAdminLoginSubmit)} style={{ marginTop: '20px' }}>
                            <h3>כניסת מנהל</h3>
                            <input placeholder="מייל" {...registerAdmin("adminUseremail", { required: true })} />
                            <input placeholder="סיסמה" type="password" {...registerAdmin("adminPassword", { required: true })} />
                            {adminErrors.adminUseremail && <span>יש להזין מייל</span>}<br />
                            {adminErrors.adminPassword && <span>יש להזין סיסמה</span>}<br />
                            <input type="submit" value="כניסה" />
                        </form>
                    )}
                </>
            ) : (
                <>
                    <h2>ממשק ניהול</h2>

                    <button onClick={logout} style={{ marginTop: '20px' }}>התנתקות</button>
                </>
            )}
        </>
    );
};

export default Login;
