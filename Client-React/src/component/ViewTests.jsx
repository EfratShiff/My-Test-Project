import axios from "axios";
import { useEffect, useState } from "react";

const ViewTests = () => {
  const [tests, setTests] = useState([]);
  const [teachersNames, setTeachersNames] = useState({});  // אחסון שמות המורים

  // שליפת המבחנים
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/Test/getAllTest", {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem('token')}`
          // }
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

  // שליפת המורים לאחר שליפת המבחנים
  useEffect(() => {
    const fetchTeachers = async () => {
      if (tests.length > 0) {
        const ids = [...new Set(tests.map(test => test.teacherId))]; // teacherId ייחודיים בלבד
        const names = {};

        for (const id of ids) {
          if (!id) continue;
          try {
            const response = await axios.get(`http://localhost:8080/User/getUserById/${id}`);
            names[id] = response.data.name || "ללא שם";  // תוודא איך בדיוק בנוי ה־response שלך
          } catch (err) {
            console.error(`שגיאה בשליפת מורה ${id}:`, err);
            names[id] = "שגיאה";
          }
        }

        setTeachersNames(names); // עדכון שמות המורים
      }
    };

    fetchTeachers();
  }, [tests]);  // הריצה תתבצע כאשר tests משתנה

  return (
    <div>
      <h1>View Tests</h1>
      {tests.map((test, index) => (
        <div key={index}>
          <h2>{test.title}</h2>
          <p>הגבלת זמן : {test.timeLimit} דקות</p>
          <p>שם מורה: {teachersNames[test.teacherId] || "טעינה..."}</p> {/* מציג את שם המורה */}
        </div>
      ))}
    </div>
  );
};

export default ViewTests;
