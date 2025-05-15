// import { use, useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const ViewRezultTest = () => {
//     const [results, setResults] = useState([]);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const decoded = jwtDecode(token);
//        const studentId= decoded.userId;
//         const fetchResults = async () => {
//             try{
//                 const response = await axios.get(`http://localhost:8080/Result/getStudentTestResultByStudentID/${studentId}`);
//                 setResults(response.data.results); // שימי לב שזו הנחת מבנה JSON
//                 console.log("📥 התוצאות שהתקבלו:", response.data);
//                 console.log("📤 נשלח לשרת:", response.data);

//                 const testsWithDetailsPromises = results.map(async (result) => {
//                     const testId = result.testId; // נניח שיש מזהה כזה
//                     const testDetails = await axios.get(`http://localhost:8080/Test/getTest/${testId}`);
//                     alert(testDetails.data);
//                     console.log("📤 נשלח לשרת:", testDetails.data);
//                     return {
//                         ...result,
//                         testDetails: testDetails.data
//                     };
//                 });
//             }
//             catch (error) {
//                 console.error("❌ שגיאה בשליחת התוצאות:", error);
//                 // setScoreError("שליחת התוצאה נכשלה ❌");
//             }
//              };

//              fetchResults();
//       }, []);
//     return (
//     <>
//  <div>
//     <h2>תוצאות מבחנים</h2>

//     {<p style={{ color: "red" }}></p>}

//     {results.length === 0 ? (
//         <p>לא נמצאו תוצאות.</p>
//     ) : (
//         <ul>
//             {results.map((result, index) => (
//                 <li key={index} style={{ marginBottom: "1rem" }}>
//                     <strong>שם מבחן:</strong> {result.testDetails?.name || "ללא שם"}<br />
//                     <strong>תאריך:</strong> {result.submitDate?.date?.substring(0, 10) || "לא זמין"}<br />
//                     <strong>ציון:</strong> {result.Mark ?? "אין ציון"}
//                 </li>
//             ))}
//         </ul>
//     )}
// </div>

//    </>
//     );
//     }
//     export default ViewRezultTest;

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ViewRezultTest = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const studentId = decoded.userId;

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/Result/getStudentTestResultByStudentID/${studentId}`
        );
        const rawResults = response.data.results || response.data;

        // 💡 כאן נביא לכל מבחן גם את השם שלו
        const enrichedResults = await Promise.all(
          rawResults.map(async (result) => {
            try {
              const testRes = await axios.get(
                `http://localhost:8080/Test/getTest/${result.TestId}`
              );
              console.log("📤 נשלח לשרת:", testRes.data);
              
              return {
                ...result,
                testDetails: testRes.data,
                
              };
            } catch (err) {
              console.warn("⚠️ שגיאה בשליפת מבחן:", result.TestId, err);
              return {
                ...result,
                testDetails: { name: "שגיאה בשליפה" },
              };
            }
          })
        );

        setResults(enrichedResults);
      } catch (error) {
        console.error("❌ שגיאה בשליפת תוצאות:", error);
      }
    };

    fetchResults();
  }, []);

  return (
    <ul>
    {results.map((result, index) => (
      <li key={index} style={{ marginBottom: "2rem" }}>
        <h3>{result.testDetails.title || "ללא שם"}</h3>
        <p>תאריך: {result.submitDate?.substring(0, 10) || "לא זמין"}</p>
        <p>ציון: {Math.round(result.Mark ?? 0)}</p>
  
        <ul>
          {result.testDetails.questions.map((q) => {
            // למצוא את תשובת התלמיד לשאלה זו
            const studentAnswer = result.answers.find(
              (a) => a.questionId === q._id
            );
  
            return (
              <li key={q._id} style={{ marginBottom: "1rem" }}>
                <strong>שאלה:</strong> {q.questionText} <br />
                <strong>אפשרויות:</strong>{" "}
                {q.options.map((opt, i) => {
                  const isCorrect = opt === q.correctAnswer;
                  const isSelected = studentAnswer?.selectedOptionIndex === i;
                  return (
                    <span
                      key={i}
                      style={{
                        fontWeight: isCorrect ? "bold" : "normal",
                        color: isSelected
                          ? isCorrect
                            ? "green"
                            : "red"
                          : "black",
                        marginRight: "10px",
                      }}
                    >
                      {opt}
                    </span>
                  );
                })}
                <br />
                <strong>תשובת סטודנט:</strong>{" "}
                {studentAnswer
                  ? q.options[studentAnswer.selectedOptionIndex]
                  : "לא ענה"}
              </li>
            );
          })}
        </ul>
      </li>
    ))}
  </ul>
  
  );
};

export default ViewRezultTest;
