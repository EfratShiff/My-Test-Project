import { useNavigate, useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {Box,Typography,Card,CardContent,RadioGroup,FormControlLabel,Radio,Button,
  LinearProgress,Paper,Container,Alert,Chip,Divider,CircularProgress} from "@mui/material";
import { Timer, QuestionMark, CheckCircle, Email,  NavigateBefore, NavigateNext} from "@mui/icons-material";

const SolveTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [scoreError, setScoreError] = useState(null);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [showEmailButton, setShowEmailButton] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSendError, setEmailSendError] = useState(null);
  const [receivedScore, setReceivedScore] = useState(null); 
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
    if (test && currentQuestionIndex < test.questions.length) {
      if (role === "teacher" || role === "manager") {
        // עבור מורה או מנהל, נסמן את התשובה הנכונה מראש
        const currentQuestion = test.questions[currentQuestionIndex];
        const correctAnswerIndex = currentQuestion.options.findIndex(
          option => option === currentQuestion.correctAnswer
        );
        setSelectedAnswer(correctAnswerIndex);
      } else {
        // עבור תלמיד, נפעיל את הטיימר כרגיל
        const questionTimeLimit = test.questions[currentQuestionIndex].timeLimit;
        setTimer(questionTimeLimit);
        setSelectedAnswer(null);
        const id = setInterval(() => {
          setTimer((prev) => {
            if (prev - 1 <= 0) {
              clearInterval(id);
              handleTimeUp();
            }
            return prev - 1;
          });
        }, 1000);
        setIntervalId(id);
        return () => {
          clearInterval(id);
          setIntervalId(null);
        };
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [test, currentQuestionIndex, role]);
  useEffect(() => {
    if (role !== "teacher" && role !== "manager" && timer > 0 && timer <= 10) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine'; 
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); 
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1); 
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }
  }, [timer, role]); 
  useEffect(() => {
    if (role === "teacher" || role === "manager") {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, role]);
  const continueSolveTest = () => {
    if(role === "teacher" ) 
    navigate("/TeacherMenu");
    else if(role === "manager") 
      navigate("/ManagerMenu");
    else 
    {navigate("/StudentMenu"); 
  }}
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
        setReceivedScore(response.data.Mark); 
        console.log("תוצאות נשמרו בהצלחה");
        setShowEmailButton(true); 
      } catch (error) {
        console.error("שגיאה בשליחת התוצאות:", error);
        setScoreError("שליחת התוצאה נכשלה ");
      }
    };
    if (test && currentQuestionIndex >= test.questions.length && userAnswers.length === test.questions.length && receivedScore === null && !scoreError && role !== "teacher" && role !== "manager") {
      sendResults();
    }
  }, [currentQuestionIndex, test, userAnswers.length, testId, receivedScore, scoreError, role]); // Added role to dependencies
  const handleSendEmailClick = async () => {
    setSendingEmail(true);
    setEmailSendError(null);
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    console.log("מתחיל שליחת מייל...");
    console.log("אימייל מהלוקל סטורג':", email);
    console.log("מזהה מבחן:", testId);
    if (!email) {
      setEmailSendError("שגיאה: כתובת מייל לא נמצאה");
      setSendingEmail(false);
      return;
    }
    if (receivedScore === null) {
        setEmailSendError("שגיאה: הציון לא זמין עדיין.");
        setSendingEmail(false);
        return;
    }
    try {
      console.log("שולח בקשה לשרת עם הנתונים:", { email, testId });
      const res = await axios.post("http://localhost:8080/Email/SendMark", { 
        email, 
        testId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("תגובה מהשרת:", res.data);
      setEmailSent(true);
    } catch (err) {
      console.error("פרטי השגיאה המלאים:", err);
      console.error("תגובת השרת:", err.response?.data);
      setEmailSendError(err.response?.data?.message || "שגיאה בשליחת המייל עם הציון");
    } finally {
      setSendingEmail(false);
    }
  };
  const handleTimeUp = () => {
    console.log("הזמן נגמר - רושם -1 כתשובה");
    recordAnswer(-1);
  };
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
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null); 
    }
    if (role !== "teacher" && role !== "manager") {
       setTimeout(() => {
         goToNextQuestion();
       }, 500); 
    }
  };
  const handleAnswerClick = (index) => {
    // רק תלמידים יכולים לבחור תשובות
    if (role !== "teacher" && role !== "manager") {
      setSelectedAnswer(index);
      recordAnswer(index);
    }
  };
  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };
  const handleNavigateNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handleNavigatePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleFinishTest = () => {
    continueSolveTest();
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
  if (currentQuestionIndex >= test.questions.length && role !== "teacher" && role !== "manager") {
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
          ) : (
             <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                המבחן נשלח לבדיקה, התוצאות נשמרו.
              </Typography>
             </Box>
          )}
          {!scoreError && showEmailButton && (
            <Box sx={{ mt: 3, mb: 3 }}>
                {emailSendError && (
                     <Alert severity="error" sx={{ mb: 2 }}>
                         {emailSendError}
                     </Alert>
                 )}
                 {emailSent ? (
                     <Typography variant="body1" color="success.main">
                         מייל עם הציון נשלח בהצלחה!
                     </Typography>
                 ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            האם לשלוח לך את הציון למייל?
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSendEmailClick}
                            disabled={sendingEmail}
                            startIcon={sendingEmail ? <CircularProgress size={20} color="inherit" /> : <Email />}
                        >
                            {sendingEmail ? 'שולח...' : 'שלח ציון למייל'}
                        </Button>
                    </>
                 )}
            </Box>
          )}
          <Button 
            variant="contained" 
            size="large" 
            onClick={continueSolveTest}
            sx={{ mt: 2 }}
          >
            חזרה לתפריט
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {test.title}
          </Typography>
          {(role === "teacher" || role === "manager") && (
            <Alert severity="info" sx={{ mb: 2 }}>
              מצב צפייה - התשובות הנכונות מסומנות
            </Alert>
          )}
        </Box>
        
        {role !== "teacher" && role !== "manager" && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              שאלה {currentQuestionIndex + 1} מתוך {test.questions.length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Timer sx={{ mr: 1 }} />
              <Typography variant="body1">
                זמן נותר: {timer} דקות
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(timer / test.questions[currentQuestionIndex].timeLimit) * 100} 
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {test.questions[currentQuestionIndex].questionText}
            </Typography>
            <RadioGroup>
              {test.questions[currentQuestionIndex].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={
                    <Radio
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswerClick(index)}
                      disabled={role === "teacher" || role === "manager"}
                      sx={{
                        '&.Mui-checked': {
                          color: role === "teacher" || role === "manager" ? 'success.main' : 'primary.main'
                        }
                      }}
                    />
                  }
                  label={option}
                  sx={{
                    bgcolor: (role === "teacher" || role === "manager") && 
                             option === test.questions[currentQuestionIndex].correctAnswer ? 
                             'success.light' : 'transparent',
                    borderRadius: 1,
                    p: 1,
                    mb: 1
                  }}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<NavigateBefore />}
            onClick={handleNavigatePrevious}
            disabled={currentQuestionIndex === 0}
          >
            שאלה קודמת
          </Button>
          
          {currentQuestionIndex < test.questions.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<NavigateNext />}
              onClick={handleNavigateNext}
            >
              שאלה הבאה
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleFinishTest}
            >
              סיים צפייה
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
export default SolveTest;