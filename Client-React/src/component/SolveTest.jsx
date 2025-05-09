
  // import { useParams } from "react-router-dom";
  // import { useEffect, useState } from "react";
  // import axios from "axios";


  // const SolveTest = () => {
  //   const { testId } = useParams();
  //   const [test, setTest] = useState(null);
  //   const deleteTest = async () => {
  //     try {
  //       const response = await axios.delete('http://localhost:8080/Test/deleteTest/בדיקה', {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`
  //         }
  //       });

  //       console.log("response:", response);
  //       alert("המבחן נמחק בהצלחה!");
  //     } catch (error) {
  //       console.error("Error deleting test:", error);
  //       alert("שגיאה במחיקת המבחן, אנא נסה שוב מאוחר יותר.");

  //       console.log(`הייתה שגיאה במחיקת המבחן: ${error.response ? error.response.data : error.message}`);
  //       console.log("Error details:", error.response);
  //     console.log( JSON.parse(atob(localStorage.getItem('token').split('.')[1])))
  //     }
  //   };
  
  //   useEffect(() => {
  //     const fetchTest = async () => {
  //       try {
  //         console.log("שולף מבחן עם ID:", testId); // בדיקה חשובה
  //         const response = await axios.get(`http://localhost:8080/Test/getTest/${testId}`);
  //         console.log("קיבלתי מבחן:", response.data);
  //         setTest(response.data);
  //       } catch (err) {
  //         console.error("שגיאה בשליפת מבחן:", err);
  //       }
  //     };

  //     fetchTest();
  //   }, [testId]);

  //   if (!test) return <p>טוען מבחן...</p>;

      


  //   return (
      
  //     <div>
  //         <div>
  //       <h2>{test.title}</h2>
  //       {test.questions.map((q, index) => (
  //         <div key={index} style={{ marginBottom: "20px" }}>
  //           <p><strong>{index + 1}. {q.questionText}</strong></p>
  //           {q.options.map((opt, i) => (
  //             <div key={i}>
  //               <label>
  //                 <input type="radio" name={`q${index}`} value={opt} />
  //                 {opt}
  //               </label>
  //             </div>
  //           ))}
  //         </div>
  //       ))}
  //     </div>
  //       <h1>Test</h1>
  //       <button onClick={deleteTest}>מחק מבחן</button>
  //     </div>
  //   );
  // };

  // export default SolveTest;


  import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SolveTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(""); // שומר את הבחירה הנוכחית

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/Test/getTest/${testId}`);
        setTest(response.data);
      } catch (err) {
        console.error("שגיאה בשליפת מבחן:", err);
      }
    };

    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (test && currentQuestionIndex < test.questions.length) {
      const questionTimeLimit = test.questions[currentQuestionIndex].timeLimit;
      setTimer(0);
      setSelectedAnswer(""); // מאפס את הבחירה

      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev + 1 >= questionTimeLimit) {
            clearInterval(id);
            goToNextQuestion();
          }
          return prev + 1;
        });
      }, 1000);

      setIntervalId(id);

      return () => clearInterval(id);
    }
  }, [test, currentQuestionIndex]);

  const handleAnswerClick = (value) => {
    setSelectedAnswer(value);
    clearInterval(intervalId);
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (!test) return <p>טוען מבחן...</p>;
  if (currentQuestionIndex >= test.questions.length) return <p>המבחן הסתיים!</p>;

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div>
      <h2>{test.title}</h2>
      <p>שאלה {currentQuestionIndex + 1} מתוך {test.questions.length}</p>
      <p>טיימר: {timer} שניות</p>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>{currentQuestion.questionText}</strong></p>
        {currentQuestion.options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name={`q-${currentQuestionIndex}`} // שם ייחודי לכל שאלה
                value={opt}
                checked={selectedAnswer === opt}
                onChange={() => handleAnswerClick(opt)}
              />
              {opt}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolveTest;

