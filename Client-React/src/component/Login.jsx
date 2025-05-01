
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useForm } from "react-hook-form";
// import { useNavigate } from 'react-router-dom'; // השמטת Navigate כי לא צריך אותו כאן

// const Login = () => {
//     const navigate = useNavigate(); // ✅ עכשיו הוא בתוך הקומפוננטה

//     const { register, handleSubmit, formState: { errors } } = useForm();
//     const { register: registerNew, handleSubmit: handleRegisterSubmit, reset } = useForm();

//     const [showRegister, setShowRegister] = useState(false);

//     const onLoginSubmit = async (data) => {
//         try {
//             const res = await axios.post('http://localhost:8080/User/getUser', data);
//             const token = res.data.token;
//             if (token) {
//                 localStorage.setItem('token', token);
//                 alert("התחברת בהצלחה!");
//                 navigate('/'); // ✅ ניווט נכון
//             }
//         } catch (err) {
           
//                 if (err.response && err.response.data && err.response.data.error) {
//                     const message = err.response.data.error;
//                     alert("שגיאה מהשרת: " + message);
//                }
//             alert("error");
//             console.error(err);
//             setShowRegister(true);
//         }
//     };

//     const onRegisterSubmit = async (data) => {
//         try {
//             const res = await axios.post('http://localhost:8080/User/createUser', data);
//             const token = res.data.token;
//             if (token) {
//                 localStorage.setItem('token', token);
//                 alert("נרשמת בהצלחה!");
//                 setShowRegister(false);
//                 reset();
//                 navigate('/'); // ✅ ניווט נכון גם אחרי רישום
//             }
//         } catch (err) {
//             console.error("שגיאה בהרשמה", err);
//         }
//     };

//     return (
//         <>
//             <form onSubmit={handleSubmit(onLoginSubmit)}>
//                 <input placeholder="אמייל" {...register("email", { required: true })} />
//                 <input placeholder="סיסמה" type="password" {...register("password", { required: true })} />
//                 {errors.UserName && <span>יש להזין שם משתמש</span>}
//                 {errors.Password && <span>יש להזין סיסמה</span>}
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
        register: registerNew,
        handleSubmit: handleRegisterSubmit,
        reset
    } = useForm();

    const [showRegister, setShowRegister] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const onLoginSubmit = async (data) => {
        try {
            setPasswordError(""); // ננקה שגיאה ישנה
            console.log(localStorage.getItem('token'));
            console.log( JSON.parse(atob(localStorage.getItem('token').split('.')[1])))

            const res = await axios.post('http://localhost:8080/User/getUser', data);
            const token = res.data.token;

            if (token) {
                localStorage.setItem('token', token);
                alert("התחברת בהצלחה!");
                navigate('/'); // מעבר לדף הבית
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                const message = err.response.data.error;

                if (message === "Invalid password") {
                    setPasswordError("הסיסמה שגויה, נסה שוב.");
                    setValue("password", ""); // מאפס רק את שדה הסיסמה
                    return;
                }

                if (message === "User not found") {
                    alert("האימייל לא קיים במערכת.");
                    setShowRegister(true);
                    return;
                }

                alert("שגיאה מהשרת: " + message);
            } else {
                alert("שגיאה כללית");
            }

            console.error(err);
        }
    };

    const onRegisterSubmit = async (data) => {
        try {
            // const res = await axios.post('http://localhost:8080/User/createUser', data);
            // const token = res.data.token;

            const token = localStorage.getItem('token');
const res = await axios.post('http://localhost:8080/User/createUser', data,{
    headers: {
        Authorization: `Bearer ${token}`
    }
});

            if (token) {
                localStorage.setItem('token', token);
                alert("נרשמת בהצלחה!");
                setShowRegister(false);
                reset(); // מנקה את הטופס
                navigate('/'); // מעבר לדף הבית אחרי רישום
            }
        } catch (err) {
            alert("שגיאה בהרשמה", err);
            console.log(err);
            
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

            {showRegister && (
                <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} style={{ marginTop: '20px' }}>
                    <h3>רישום משתמש חדש</h3>
                    <input placeholder="שם משתמש" {...registerNew("name", { required: true })} />
                    <input placeholder="אמייל" {...registerNew("email", { required: true })} />
                    <input placeholder="סיסמה" type="password" {...registerNew("password", { required: true })} />
                    <input placeholder="תפקיד (student/teacher)" {...registerNew("role", { required: true })} />
                    <input type="submit" value="רישום" />
                </form>
            )}
        </>
    );
};

export default Login;
