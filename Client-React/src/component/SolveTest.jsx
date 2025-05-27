
import { useNavigate, useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  LinearProgress,
  Paper,
  Container,
  Alert,
  Chip,
  Divider
} from "@mui/material";
import {
  Timer,
  QuestionMark,
  CheckCircle,
  Assessment
} from "@mui/icons-material";

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
        console.log(" טעינת מבחן לפי מזהה:", testId);
        const response = await axios.get(`http://localhost:8080/Test/getTest/${testId}`);
        console.log(" מבחן נטען:", response.data);
        setTest(response.data);
      } catch (err) {
        console.error(" שגיאה בטעינת מבחן:", err);
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
            // כשנגמר הזמן, נרשום -1 כתשובה ונעבור לשאלה הבאה
            handleTimeUp();
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

        console.log("נשלח לשרת:", body);

        const response = await axios.post("http://localhost:8080/Result/createResultTest", body);
        setScore(response.data.Mark);
        alert(response.data.Mark)  
        const email = localStorage.getItem('email');
        if (email)alert( email);else alert("לא נמצא מייל");
        alert(testId)
        try {
              const res = await axios.post("http://localhost:8080/User/SendMark", { email ,testId});
            alert("נשלח מייל לסטודנט עם התוצאות");
             } catch (err) {
                alert("שגיאה בשליחת הבקשה");
            }

        alert("תוצאות נשלחו בהצלחה");
      } catch (error) {
        console.error("שגיאה בשליחת התוצאות:", error);
        setScoreError("שליחת התוצאה נכשלה ");
      }
    };

    if (test && currentQuestionIndex >= test.questions.length && userAnswers.length > 0) {
      sendResults();
    }
  }, [currentQuestionIndex, test, userAnswers, testId]);

  // פונקציה חדשה לטיפול בפקיעת זמן
  const handleTimeUp = () => {
    console.log("הזמן נגמר - רושם -1 כתשובה");
    recordAnswer(-1);
  };

  // פונקציה לרישום תשובה (משותפת לבחירה ופקיעת זמן)
  const recordAnswer = (answerIndex) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        questionId: test.questions[currentQuestionIndex]._id,
        selectedOptionIndex: answerIndex,
      };
      console.log("נרשמה תשובה:", {
        questionIndex: currentQuestionIndex,
        answerIndex: answerIndex,
        questionId: test.questions[currentQuestionIndex]._id
      });
      return newAnswers;
    });

    // נקה את הטיימר אם הוא עדיין פועל
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    goToNextQuestion();
  };

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    recordAnswer(index);
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (!test) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            טוען מבחן...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Container>
    );
  }

  if (currentQuestionIndex >= test.questions.length) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="primary">
            המבחן הסתיים!
          </Typography>
          
          {scoreError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {scoreError}
            </Alert>
          ) : score !== null ? (
            <Box sx={{ mb: 3 }}>
              <Assessment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h5" color="info.main">
                הציון שלך: {score}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                טוען ציון...
              </Typography>
              <LinearProgress />
            </Box>
          )}
          
          <Button 
            variant="contained" 
            size="large" 
            onClick={continueSolveTest}
            sx={{ mt: 2 }}
          >
            להמשך פתרון מבחנים
          </Button>
        </Paper>
      </Container>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const timeProgress = test.questions[currentQuestionIndex].timeLimit > 0 
    ? (timer / test.questions[currentQuestionIndex].timeLimit) * 100 
    : 0;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom color="primary" textAlign="center">
            {test.title}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Chip 
              icon={<QuestionMark />}
              label={`שאלה ${currentQuestionIndex + 1} מתוך ${test.questions.length}`}
              color="primary"
              variant="outlined"
            />
            
            {role !== "teacher" && (
              <Chip 
                icon={<Timer />}
                label={`${timer} שניות`}
                color={timeProgress > 80 ? "error" : timeProgress > 60 ? "warning" : "success"}
                variant="filled"
              />
            )}
          </Box>

          {/* Progress bars */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              התקדמות במבחן
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {role !== "teacher" && test.questions[currentQuestionIndex].timeLimit > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                זמן נותר
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={timeProgress} 
                color={timeProgress > 80 ? "error" : timeProgress > 60 ? "warning" : "success"}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Question Card */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              {currentQuestion.questionText}
            </Typography>

            <RadioGroup
              value={selectedAnswer !== null ? selectedAnswer : ''}
              name={`q-${currentQuestionIndex}`}
            >
              {currentQuestion.options.map((opt, i) => (
                <FormControlLabel
                  key={i}
                  value={i}
                  control={
                    <Radio 
                      checked={selectedAnswer === i}
                      onChange={() => handleAnswerClick(i)}
                      sx={{ 
                        '&.Mui-checked': {
                          color: 'primary.main',
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      {opt}
                    </Typography>
                  }
                  sx={{
                    border: '1px solid',
                    borderColor: selectedAnswer === i ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    margin: 1,
                    padding: 1,
                    backgroundColor: selectedAnswer === i ? 'primary.light' : 'transparent',
                    '&:hover': {
                      backgroundColor: selectedAnswer === i ? 'primary.light' : 'grey.50',
                      borderColor: 'primary.main',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default SolveTest;