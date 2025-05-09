
  import { useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from "axios";


  const SolveTest = () => {
    const { testId } = useParams();
    const [test, setTest] = useState(null);
    const deleteTest = async () => {
      try {
        const response = await axios.delete('http://localhost:8080/Test/deleteTest/בדיקה', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("response:", response);
        alert("המבחן נמחק בהצלחה!");
      } catch (error) {
        console.error("Error deleting test:", error);
        alert("שגיאה במחיקת המבחן, אנא נסה שוב מאוחר יותר.");

        console.log(`הייתה שגיאה במחיקת המבחן: ${error.response ? error.response.data : error.message}`);
        console.log("Error details:", error.response);
      console.log( JSON.parse(atob(localStorage.getItem('token').split('.')[1])))
      }
    };
  
    useEffect(() => {
      const fetchTest = async () => {
        try {
          console.log("שולף מבחן עם ID:", testId); // בדיקה חשובה
          const response = await axios.get(`http://localhost:8080/Test/getTest/${testId}`);
          console.log("קיבלתי מבחן:", response.data);
          setTest(response.data);
        } catch (err) {
          console.error("שגיאה בשליפת מבחן:", err);
        }
      };

      fetchTest();
    }, [testId]);

    if (!test) return <p>טוען מבחן...</p>;

      


    return (
      
      <div>
          <div>
        <h2>{test.title}</h2>
        {test.questions.map((q, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p><strong>{index + 1}. {q.questionText}</strong></p>
            {q.options.map((opt, i) => (
              <div key={i}>
                <label>
                  <input type="radio" name={`q${index}`} value={opt} />
                  {opt}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
        <h1>Test</h1>
        <button onClick={deleteTest}>מחק מבחן</button>
      </div>
    );
  };

  export default SolveTest;
