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
  Divider,
  CircularProgress
} from "@mui/material";
import {
  Timer,
  QuestionMark,
  CheckCircle,
  Assessment,
  Email
} from "@mui/icons-material";

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

  // New state for email functionality
  const [showEmailButton, setShowEmailButton] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSendError, setEmailSendError] = useState(null);
  const [receivedScore, setReceivedScore] = useState(null); // To store score for potential email

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
    if (test && currentQuestionIndex < test.questions.length && (role !== "teacher"&& role!=="manager")) {
      const questionTimeLimit = test.questions[currentQuestionIndex].timeLimit;
      setTimer(questionTimeLimit); // Start timer from the time limit
      setSelectedAnswer(null);

      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev - 1 <= 0) { // Check if time is zero or less
            clearInterval(id);
            handleTimeUp();
          }
          return prev - 1; // Decrement timer
        });
      }, 1000);

      setIntervalId(id);

      return () => {
        clearInterval(id);
        setIntervalId(null); // Clear intervalId state on cleanup
      };
    }
     // Clear interval if component unmounts or test/role changes significantly before quiz ends
    return () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };
  }, [test, currentQuestionIndex, role]); // Added role to dependencies

  // Effect to handle timer reaching 10 seconds for beep and color change
  useEffect(() => {
    if (role !== "teacher" && timer > 0 && timer <= 10) {
        // Play a short beep sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine'; // Sine wave for a simple beep
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volume

            oscillator.start();
            // Stop the sound after a short duration
            oscillator.stop(audioContext.currentTime + 0.1); // Beep for 100ms
        } catch (error) {
            console.error("Error playing sound:", error);
            // Handle cases where audio context is not available or allowed
        }
    }
  }, [timer, role]); // Depend on timer and role

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
        // Do not display score immediately
        setReceivedScore(response.data.Mark); // Store score for email
        console.log("תוצאות נשמרו בהצלחה");
        setShowEmailButton(true); // Show the email button

      } catch (error) {
        console.error("שגיאה בשליחת התוצאות:", error);
        setScoreError("שליחת התוצאה נכשלה ");
      }
    };

    // Trigger sendResults when all questions are answered and results haven\'t been sent yet
    if (test && currentQuestionIndex >= test.questions.length && userAnswers.length === test.questions.length && receivedScore === null && !scoreError) {
      sendResults();
    }
  }, [currentQuestionIndex, test, userAnswers.length, testId, receivedScore, scoreError]); // Added userAnswers.length to dependencies

  // New function to handle sending email
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
      setIntervalId(null); // Clear intervalId state
    }
    
    // רק עבור תלמידים, מורים לא צריכים לעבור אוטומטית
    if (role !== "teacher") {
       // Add a small delay before moving to the next question to allow visual feedback of selection
       setTimeout(() => {
         goToNextQuestion();
       }, 500); // 500ms delay
    }
  };

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    recordAnswer(index); // Call recordAnswer here to save answer and potentially move to next question
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

  // End of test display
  if (currentQuestionIndex >= test.questions.length) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="primary">
            המבחן הסתיים!
          </Typography>
          
          {/* Display message based on score submission status */}
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

          {/* Email sending section */}
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
            
            {role !== "teacher" && test.questions[currentQuestionIndex].timeLimit > 0 && ( // Only show timer chip if time limit > 0
              <Chip
                icon={<Timer />}
                label={`${timer} שניות נותרו`} // Show remaining time
                color={timer <= 10 ? "error" : "success"} // Change color based on time remaining
                variant="filled"
              />
            )}
             {role !== "teacher" && test.questions[currentQuestionIndex].timeLimit === 0 && ( // Show "No time limit" if time limit is 0
              <Chip
                icon={<Timer />}
                label={`ללא הגבלת זמן`}
                color="info"
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
              value={((currentQuestionIndex) / test.questions.length) * 100} // Progress based on completed questions
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {role !== "teacher" && test.questions[currentQuestionIndex].timeLimit > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                זמן נותר התקדמות
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(timer / test.questions[currentQuestionIndex].timeLimit) * 100} // Progress based on time remaining
                color={timer <= 10 ? "error" : "success"} // Match color with the Chip
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

            {/* Disable radio buttons if answer is selected (for student role) */}
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
                      disabled={selectedAnswer !== null && role !== "teacher"} // Disable after selecting answer for student
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