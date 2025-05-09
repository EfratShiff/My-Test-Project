
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";


// const ViewTests = () => {
//   const navigate = useNavigate();
//   const [tests, setTests] = useState([]);
//   const [teachersNames, setTeachersNames] = useState({});

//   useEffect(() => {
//     const fetchTests = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/Test/getAllTest");
//         setTests(response.data);
//       } catch (error) {
//         alert("שגיאה בטעינת מבחנים");
//         console.error("Error fetching tests", error);
//       }
//     };

//     fetchTests();
//   }, []);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       if (tests.length > 0) {
//         const ids = [...new Set(tests.map(test => test.teacherId))];
//         const names = {};

//         for (const id of ids) {
//           if (!id) continue;
//           try {
//             const response = await axios.get(`http://localhost:8080/User/getUserById/${id}`);
//             names[id] = response.data.name || "ללא שם";
//           } catch (err) {
//             console.error(`שגיאה בשליפת מורה ${id}:`, err);
//             names[id] = "שגיאה";
//           }
//         }

//         setTeachersNames(names);
//       }
//     };

//     fetchTeachers();
//   }, [tests]);

//   const handleClick = (testId) => {
//     const token = localStorage.getItem("token");
  
//     // אם לא נמצא טוקן
//     if (!token) {
//       alert("לא נמצא טוקן, התחבר שוב");
//       return; // יצא מהפונקציה אם אין טוקן
//     }
  
//     const decoded = jwtDecode(token);
//     const role = decoded.role;
  
//     // חפש את המבחן שהמשתמש בחר
//     const test = tests.find((test) => test._id === testId);
    
//     // אם המבחן לא נמצא, חזור
//     if (!test) {
//       alert("לא נמצא מבחן עם מזהה זה.");
//       return;
//     }
  
//     // קבלת התאריך הנוכחי
//     const currentDate = new Date();
//     const lastDate = new Date(test.lastDate);
//     if (role === "teacher") {
//       navigate(`/SolveTest/${testId}`);
//       return; // מורה תמיד יכול לגשת למבחן
//     }
  
//     // אם התאריך של המבחן עבר, תלמיד לא יכול לגשת
//     if (lastDate < currentDate) {
//       alert("המבחן עבר את תאריך ההגשה. תלמיד לא יכול לגשת למבחן.");
//       return; // יצא מהפונקציה אם המבחן עבר
//     }
//     navigate(`/SolveTest/${testId}`);
//   };
  

//     return (
//       <div>
//         <h1>מבחנים זמינים</h1>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
//           {tests.map((test, index) => (
//             <button
//               key={index}
//               onClick={() => handleClick(test._id)}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: "#1976d2",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 minWidth: "200px",
//                 textAlign: "right",
//               }}
//             >
//               <strong>{test.title}</strong><br />
//               תאריך אחרון להגשה: {test.lastDate ? new Date(test.lastDate).toLocaleString() : "לא הוזן"}<br />
//               מורה: {teachersNames[test.teacherId] || "טעינה..."}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

// export default ViewTests;



import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ViewTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [teachersNames, setTeachersNames] = useState({});

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/Test/getAllTest");
        setTests(response.data);
      } catch (error) {
        alert("שגיאה בטעינת מבחנים");
        console.error("Error fetching tests", error);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (tests.length > 0) {
        const ids = [...new Set(tests.map(test => test.teacherId))];
        const names = {};

        for (const id of ids) {
          if (!id) continue;
          try {
            const response = await axios.get(`http://localhost:8080/User/getUserById/${id}`);
            names[id] = response.data.name || "ללא שם";
          } catch (err) {
            console.error(`שגיאה בשליפת מורה ${id}:`, err);
            names[id] = "שגיאה";
          }
        }

        setTeachersNames(names);
      }
    };

    fetchTeachers();
  }, [tests]);

  const handleClick = (testId) => {
    const token = localStorage.getItem("token");

    // אם לא נמצא טוקן
    if (!token) {
      alert("לא נמצא טוקן, התחבר שוב");
      return; // יצא מהפונקציה אם אין טוקן
    }

    const decoded = jwtDecode(token);
    const role = decoded.role;

    // חפש את המבחן שהמשתמש בחר
    const test = tests.find((test) => test._id === testId);
    
    // אם המבחן לא נמצא, חזור
    if (!test) {
      alert("לא נמצא מבחן עם מזהה זה.");
      return;
    }

    // קבלת התאריך הנוכחי
    const currentDate = new Date();
    
    // המרת התאריך מהדאטה בייס לאובייקט Date
    const lastDate = new Date(test.lastDate);

    // אם התפקיד הוא מורה, אפשר להיכנס תמיד
    if (role === "teacher") {
      console.log("ההרשאה שלך היא:", role);
      console.log("Token שנשלח:", token);
      console.log("נבחר מבחן:", testId);
      navigate(`/SolveTest/${testId}`);
      return; // מורה תמיד יכול לגשת למבחן
    }

    // אם התאריך של המבחן עבר, תלמיד לא יכול לגשת
    if (lastDate < currentDate) {
      alert("המבחן עבר את תאריך ההגשה. תלמיד לא יכול לגשת למבחן.");
      return; // יצא מהפונקציה אם המבחן עבר
    }

    // אם לא עבר הזמן, תלמיד יכול לגשת
    console.log("ההרשאה שלך היא:", role);
    console.log("Token שנשלח:", token);
    console.log("נבחר מבחן:", testId);
    navigate(`/SolveTest/${testId}`);
  };

  return (
    <div>
      <h1>מבחנים זמינים</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {tests.map((test, index) => {
          // קבלת התאריך הנוכחי
          const currentDate = new Date();
          const lastDate = new Date(test.lastDate);

          // בדיקה אם הזמן של המבחן עבר
          const isExpired = lastDate < currentDate;

          return (
            <button
              key={index}
              onClick={() => handleClick(test._id)}
              style={{
                padding: "10px 20px",
                backgroundColor: isExpired ? "#d32f2f" : "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                minWidth: "200px",
                textAlign: "right",
                position: "relative"
              }}
            >
              <strong>{test.title}</strong><br />
              תאריך אחרון להגשה: {test.lastDate ? new Date(test.lastDate).toLocaleString() : "לא הוזן"}<br />
              מורה: {teachersNames[test.teacherId] || "טעינה..."}
              {isExpired && (
                <span
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "#fff",
                    backgroundColor: "#d32f2f",
                    padding: "5px",
                    borderRadius: "50%"
                  }}
                >
                </span>
              )}
              {isExpired && (
                <div
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    position: "absolute",
                    bottom: "5px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: "bold"
                  }}
                >
                  הזמן תם!
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ViewTests;
