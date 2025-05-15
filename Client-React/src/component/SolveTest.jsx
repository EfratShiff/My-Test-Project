import { useNavigate, useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SolveTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [scoreError, setScoreError] = useState(null);
  const role = localStorage.getItem("role");
    const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        console.log("📡 טעינת מבחן לפי מזהה:", testId);
        const response = await axios.get(`http://localhost:8080/Test/getTest/${testId}`);
        console.log("🧾 מבחן נטען:", response.data);
        setTest(response.data);
      } catch (err) {
        console.error("❌ שגיאה בטעינת מבחן:", err);
      }
    };

    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (test && currentQuestionIndex < test.questions.length && role !== "teacher") {
      const questionTimeLimit = test.questions[currentQuestionIndex].timeLimit;
      setTimer(0);
      setSelectedAnswer(null);

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

  const continueSolveTest = () => {
    navigate("/ViewTests");
    
  }
  useEffect(() => {
    const sendResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);

        const body = {
          TestId: testId,
          studentId: decoded.userId,
          answers: userAnswers,
        };

        console.log("📤 נשלח לשרת:", body);

        const response = await axios.post("http://localhost:8080/Result/createResultTest", body);
        setScore(response.data.Mark);
        alert("תוצאות נשלחו בהצלחה");
      } catch (error) {
        console.error("❌ שגיאה בשליחת התוצאות:", error);
        setScoreError("שליחת התוצאה נכשלה ❌");
      }
    };

    if (test && currentQuestionIndex >= test.questions.length && userAnswers.length > 0) {
      sendResults();
    }
  }, [currentQuestionIndex, test, userAnswers, testId]);

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);

    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        questionId: test.questions[currentQuestionIndex]._id,
        selectedOptionIndex: index,
      };
      return newAnswers;
    });

    clearInterval(intervalId);
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (!test) return <p>טוען מבחן...</p>;

  if (currentQuestionIndex >= test.questions.length) {
    return (
      <div>
        <h2>המבחן הסתיים!</h2>
        {scoreError ? (
          <p style={{ color: "red" }}>{scoreError}</p>
        ) : score !== null ? (
          <p>הציון שלך: {score}</p> 
        ) : (
          <p>טוען ציון...</p>
        )}
        <button onClick={continueSolveTest}>להמשך פתרון מבחנים</button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div>
      <h2>{test.title}</h2>
      <p>שאלה {currentQuestionIndex + 1} מתוך {test.questions.length}</p>
      <p>⏳ טיימר: {timer} שניות</p>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>{currentQuestion.questionText}</strong></p>
        {currentQuestion.options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name={`q-${currentQuestionIndex}`}
                value={i}
                checked={selectedAnswer === i}
                onChange={() => handleAnswerClick(i)}
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
