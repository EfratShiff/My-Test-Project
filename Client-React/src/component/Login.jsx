// import { useForm, useFieldArray } from "react-hook-form";
// const Login = () => {

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm()

//     const Submit = (data) => {
//         debugger
//     }
   

//     return(
//         <>

            
//             <form onSubmit={handleSubmit(Submit)}>

//                 <input defaultValue="שם משתמש" {...register("UserName",{ required: true })} />

//                 <input defaultValue="סיסמא" {...register("Password", { required: true })} />

//                 {errors.exampleRequired && <span>שדה חובה</span>}

//                 <input type="submit" />
//             </form>

//         </>
//     )
// }

// export default Login;






import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerNew, handleSubmit: handleRegisterSubmit, reset } = useForm();

    const [showRegister, setShowRegister] = useState(false);

    const onLoginSubmit = async (data) => {
        try {
            const res = await axios.post('/api/login', data);
            const token = res.data.token;
            if (token) {
                localStorage.setItem('token', token);
                alert("התחברת בהצלחה!");
                // ניווט או הפניה לדף אחר
            }
        } catch (err) {
            console.error(err);
            setShowRegister(true);
        }
    };

    const onRegisterSubmit = async (data) => {
        try {
            const res = await axios.post('/api/register', data);
            const token = res.data.token;
            if (token) {
                localStorage.setItem('token', token);
                alert("נרשמת בהצלחה!");
                setShowRegister(false);
                reset(); // מנקה את הטופס
            }
        } catch (err) {
            console.error("שגיאה בהרשמה", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onLoginSubmit)}>
                <input placeholder="שם משתמש" {...register("UserName", { required: true })} />
                <input placeholder="סיסמה" type="password" {...register("Password", { required: true })} />
                {errors.UserName && <span>יש להזין שם משתמש</span>}
                {errors.Password && <span>יש להזין סיסמה</span>}
                <input type="submit" value="התחברות" />
            </form>

            {showRegister && (
                <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} style={{ marginTop: '20px' }}>
                    <h3>רישום משתמש חדש</h3>
                    <input placeholder="שם משתמש" {...registerNew("UserName", { required: true })} />
                    <input placeholder="סיסמה" type="password" {...registerNew("Password", { required: true })} />
                    <input placeholder="שם פרטי" {...registerNew("FirstName", { required: true })} />
                    <input placeholder="תפקיד (student/teacher)" {...registerNew("role", { required: true })} />
                    <input type="submit" value="רישום" />
                </form>
            )}
        </>
    );
};

export default Login;
