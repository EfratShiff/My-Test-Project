import axios from "axios";
import { useEffect, useState } from "react";

const ViewTests = () => {
  const [tests, setTests] = useState([]);
  const [teachersNames, setTeachersNames] = useState({});  

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/Test/getAllTest", {
        
        });
        console.log("response:", response.data);
        setTests(response.data);
      } catch (error) {
        alert("err");
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

  return (
    <div>
      <h1>View Tests</h1>
      {tests.map((test, index) => (
        <div key={index}>
          <h2>{test.title}</h2>
          <p>הגבלת זמן : {test.timeLimit} דקות</p>
          <p>שם מורה: {teachersNames[test.teacherId] || "טעינה..."}</p> 
        </div>
      ))}
    </div>
  );
};

export default ViewTests;
