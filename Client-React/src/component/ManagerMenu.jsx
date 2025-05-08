import React, { useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const ManagerMenu = () => {
  const [actionType, setActionType] = useState(""); 
  const [users, setUsers] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {

    const token = localStorage.getItem("token");
    try {
      if (actionType.startsWith("add")) {
        const role = actionType === "add-teacher" ? "teacher" : "student";
      alert(role);
        data.role = role;
        const token = localStorage.getItem('token');
        alert(JSON.stringify(data));


        await axios.post('http://localhost:8080/User/createUser', data, {
                  headers: { Authorization: `Bearer ${token}` }
              });
        alert("המשתמש נוסף בהצלחה");
       
        alert(`המשתמש בתפקיד ${role} נוסף בהצלחה`);
      }
      else if (actionType.startsWith("delete")) {
        const role = actionType === "delete-teacher" ? "teacher" : "student";
        alert(data.name+" " + data.password);
        await axios.delete(`http://localhost:8080/User/deleteUser/${data.name}/${data.password}`, {
        });
      
        alert(`המשתמש בתפקיד ${role} נמחק`);
      }
      reset();
      setActionType("");      
    } catch (err) {
      alert("שגיאה בהוספת המשתמש: " + (err.response?.data?.error || "שגיאה כללית"));
    }
  };

  const showForm = !!actionType;

  return (
    <>
      ברוך הבא מנהל <br />

      <Button onClick={() => setActionType("add-teacher")} sx={{ fontSize: 18 }}>
        הוספת מורה
      </Button>
      <Button onClick={() => setActionType("add-student")} sx={{ fontSize: 18 }}>
        הוספת תלמידה
      </Button>
      <Button onClick={() => setActionType("delete-teacher")} sx={{ fontSize: 18 }}>
        מחיקת מורה
      </Button>
      <Button onClick={() => setActionType("delete-student")} sx={{ fontSize: 18 }}>
        מחיקת תלמידה
      </Button>
      <Button component={Link} to="/ViewTests" sx={{ fontSize: 18 }}>
        צפייה במבחנים
      </Button> <Button 
       sx={{ fontSize: 18 }}>
        צפייה בכל המשתמשים
      </Button>

      {showForm && (
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
      <h4>
        {actionType.includes("add") ? "הוספת" : "מחיקת"}{" "}
        {actionType.includes("teacher") ? "מורה" : "תלמידה"}
      </h4>
    
      <input placeholder="שם" {...register("name", { required: true })} />
    
      {actionType.includes("add") && (
        <input placeholder="אימייל" {...register("email", { required: true })} />
      )}
    
      <input
        placeholder="סיסמה"
        type="password"
        {...register("password", { required: true })}
      />
    
      <input type="submit" value="שלח" />
    </form>
     
      )}


{users.length > 0 && (
  <div>
    <h3>רשימת משתמשים:</h3>
    <ul>
      {users.map((user, index) => (
        <li key={index}>
          {user.name} - {user.email} - {user.role} - {user.password}
        </li>
      ))}
    </ul>
  </div>
)}

    </>
  );
};

export default ManagerMenu;
