

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useForm } from "react-hook-form";
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const navigate = useNavigate();

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors }
//     } = useForm();

//     const {
//         register: registerNew,
//         handleSubmit: handleRegisterSubmit,
//         reset
//     } = useForm();

//     const [showRegister, setShowRegister] = useState(false);
//     const [passwordError, setPasswordError] = useState("");

//     const onLoginSubmit = async (data) => {
//         try {
//             setPasswordError(""); // ננקה שגיאה ישנה

//             const res = await axios.post('http://localhost:8080/User/getUser', data);
//             const token = res.data.token;
//             console.log(token);

//             if (token) {
//                 localStorage.setItem('token', token);
//                 alert("התחברת בהצלחה!");
//                 navigate('/'); // ניווט לדף הבית
//             }
//         } catch (err) {
//             // setPasswordError(""); // במקרה של שגיאה, נוודא שננקה את השגיאה הקודמת

//             if (err.response && err.response.data && err.response.data.error) {
//                 const message = err.response.data.error;

//                 if (message === "Invalid password") {
//                     setPasswordError("הסיסמה שגויה, נסה שוב.");
//                     setValue("password", ""); // מאפס רק את שדה הסיסמה
//                     return;
//                 }

//                 if (message === "User not found") {
//                     alert("האימייל לא קיים במערכת.");
//                     setShowRegister(true);
//                     return;
//                 }

//                 alert("שגיאה מהשרת: " + message);
//             } else {
//                 alert("שגיאה כללית");
//             }
//         }
//     };


//     const onRegisterSubmit = async (data) => {
//         try {
//             // const res = await axios.post('http://localhost:8080/User/createUser', data);
//             // const token = res.data.token;

//             const token = localStorage.getItem('token');
// const res = await axios.post('http://localhost:8080/User/createUser', data,{
//     headers: {
//         Authorization: `Bearer ${token}`
//     }
// });

//             if (token) {
//                 localStorage.setItem('token', token);
//                 alert("נרשמת בהצלחה!");
//                 setShowRegister(false);
//                 reset(); // מנקה את הטופס
//                 navigate('/'); // מעבר לדף הבית אחרי רישום
//             }
//         } catch (err) {
//             alert("שגיאה בהרשמה", err);
//             console.log(err);

//         }
//     };

//     return (
//         <>
//             <form onSubmit={handleSubmit(onLoginSubmit)}>
//                 <input placeholder="אמייל" {...register("email", { required: true })} />
//                 <input
//                     placeholder="סיסמה"
//                     type="password"
//                     {...register("password", { required: true })}
//                 />
//                 {errors.email && <span>יש להזין אימייל</span>}<br />
//                 {errors.password && <span>יש להזין סיסמה</span>}<br />
//                 {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}<br />
//                 <input type="submit" value="התחברות" />
//             </form>

//             {showRegister && (
//                 <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} style={{ marginTop: '20px' }}>
//                     <h3>רישום משתמש חדש</h3>
//                     <input placeholder="שם משתמש" {...registerNew("name", { required: true })} />
//                     <input placeholder="אמייל" {...registerNew("email", { required: true })} />
//                     <input placeholder="סיסמה" type="password" {...registerNew("password", { required: true })} />
//                     <input placeholder="תפקיד (student/teacher)" {...registerNew("role", { required: true })} />
//                     <input type="submit" value="רישום" />
//                 </form>
//             )}
//         </>
//     );
// };

// export default Login;





import React, { useState } from 'react';
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

    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const onLoginSubmit = async (data) => {
        try {
            setPasswordError("");
            setUserNotFound(false);
            setShowAdminLogin(false);

            const res = await axios.post('http://localhost:8080/User/getUser', data);
            const token = res.data.token;

            if (token) {
                localStorage.setItem('token', token);
                alert("התחברת בהצלחה!");
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                const message = err.response.data.error;

                if (message === "Invalid password") {
                    setPasswordError("הסיסמה שגויה, נסה שוב.");
                    setValue("password", "");
                    return;
                }

                if (message === "User not found") {
                    setUserNotFound(true);
                    return;
                }

                alert("שגיאה מהשרת: " + message);
            } else {
                alert("שגיאה כללית");
            }
        }
    };

    const onAdminLoginSubmit = async (data) => {
        console.log(data);
        try {
            const res = await axios.post('http://localhost:8080/User/getUser', {
                name: "מנהל", // אפשר להשאיר, לא מזיק אבל גם לא נדרש
                email: data.adminUseremail,       // ✅ תיקון
                password: data.adminPassword,
                roleToCheck: "manager"            // ✅ תיקון
            });

            const token = res.data.token;
            console.log(token);
            if (token) {
                localStorage.setItem('token', token);
                alert("ברוך הבא מנהל!");
                navigate('/ManagerMenu'); // עדכן בהתאם לדף מנהל שלך
            }
        } catch (err) {
            alert("שגיאה בכניסת מנהל: " + (err.response?.data?.error || "בעיה כללית"));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onLoginSubmit)}>
                <input placeholder="אמייל" {...register("email", { required: true })} />
                <input
                    placeholder="סיסמה"
                    type="password"
                    {...register("password", { required: true })}
                />
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
                    {adminErrors.adminUsername && <span>יש להזין שם משתמש</span>}<br />
                    {adminErrors.adminPassword && <span>יש להזין סיסמה</span>}<br />
                    <input type="submit" value="כניסה" />
                </form>
            )}
        </>
    );
};

export default Login;