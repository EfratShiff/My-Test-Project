import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  List,
  Paper, 
  Chip, 
  Grid, 
  CircularProgress,
  Alert,
  CardHeader,
  CardActions,
  Button,
  Avatar,
  IconButton,
  Fade,
  Stack,
  LinearProgress,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import GradeIcon from '@mui/icons-material/Grade';
import QuizIcon from '@mui/icons-material/Quiz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';

const ViewRezultTest = () => {
  const { testId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const studentId = decoded.userId;

    const fetchResults = async () => {
      try {
        setLoading(true);
        let response;
        
        if (testId) {
          // אם יש מזהה מבחן, נביא רק את התוצאות של המבחן הספציפי
          response = await axios.get(`http://localhost:8080/Result/getStudentTestResult/${testId}/${studentId}`);
          setResults([response.data]);
        } else {
          // אחרת, נביא את כל התוצאות
          response = await axios.get(`http://localhost:8080/Result/getStudentTestResultByStudentID/${studentId}`);
          const rawResults = response.data.results || response.data;

          const enrichedResults = await Promise.all(
            rawResults.map(async (result) => {
              try {
                const testRes = await axios.get(`http://localhost:8080/Test/getTest/${result.TestId}`);
                console.log("נשלח לשרת:", testRes.data);
                
                let teacherDetails = null;
                if (testRes.data.teacherId) {
                  try {
                    const teacherRes = await axios.get(`http://localhost:8080/User/getUser/${testRes.data.teacherId}`);
                    teacherDetails = teacherRes.data;
                  } catch (teacherErr) {
                    console.warn("שגיאה בשליפת מורה:", testRes.data.teacherId, teacherErr);
                    teacherDetails = { firstName: "לא זמין", lastName: "" };
                  }
                }
                
                return {
                  ...result,
                  testDetails: testRes.data,
                  teacherDetails: teacherDetails,
                };
              } catch (err) {
                console.warn("שגיאה בשליפת מבחן:", result.TestId, err);
                return {
                  ...result,
                  testDetails: { name: "שגיאה בשליפה" },
                  teacherDetails: { firstName: "לא זמין", lastName: "" },
                };
              }
            })
          );
          setResults(enrichedResults);
        }
      } catch (error) {
        console.error("שגיאה בשליפת תוצאות:", error);
        setError("שגיאה בטעינת תוצאות המבחנים");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId]);

  const handleOpenDialog = (result) => {
    setSelectedResult(result);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedResult(null);
  };

  const renderScore = (score) => {
    const scoreValue = Math.round(score ?? 0);
    let color = "primary";
    
    if (scoreValue >= 90) color = "success";
    else if (scoreValue >= 70) color = "info";
    else if (scoreValue >= 55) color = "warning";
    else color = "error";

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
        <GradeIcon color={color} />
        <Typography variant="h5" color={color}>
          {scoreValue}
        </Typography>
      </Box>
    );
  };

  const renderScoreBadge = (score) => {
    const scoreValue = Math.round(score ?? 0);
    let color = "primary";
    
    if (scoreValue >= 90) color = "success";
    else if (scoreValue >= 70) color = "info";
    else if (scoreValue >= 55) color = "warning";
    else color = "error";

    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress 
          variant="determinate" 
          value={scoreValue} 
          size={60} 
          thickness={5} 
          color={color} 
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            fontSize={16}
            fontWeight="bold"
          >
            {scoreValue}
          </Typography>
        </Box>
      </Box>
    );
  };

  const getAchievementIcon = (score) => {
    const scoreValue = Math.round(score ?? 0);
    
    if (scoreValue >= 95) {
      return <EmojiEventsIcon sx={{ color: 'gold', fontSize: 28 }} />;
    } else if (scoreValue >= 85) {
      return <EmojiEventsIcon sx={{ color: 'silver', fontSize: 24 }} />;
    } else if (scoreValue >= 70) {
      return <EmojiEventsIcon sx={{ color: '#CD7F32', fontSize: 22 }} />;
    } else {
      return <SchoolIcon color="action" fontSize="small" />;
    }
  };

  const renderTestAvatar = (questions) => {
    const count = questions?.length || 0;
    return (
      <Avatar sx={{ bgcolor: 'primary.main' }}>
        {count}
      </Avatar>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 10 }}>
        <CircularProgress size={60} thickness={5} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          טוען תוצאות מבחנים...
        </Typography>
        <LinearProgress sx={{ width: '50%', mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" dir="rtl" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, background: 'linear-gradient(to right, #e0f7fa, #f5f5f5)' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {testId ? 'תוצאות המבחן' : 'תוצאות מבחנים'}
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          {testId ? 'צפייה בתוצאות המבחן הנוכחי' : 'צפייה בכל תוצאות המבחנים שלך'}
        </Typography>
      </Paper>

      {results.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">לא נמצאו תוצאות מבחנים</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {results.map((result, index) => (
            <Grid item xs={12} key={index}>
              <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }}>
                <Card sx={{ 
                  boxShadow: 3, 
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 6,
                  }
                }}>
                  <CardHeader
                    avatar={renderTestAvatar(result.testDetails?.questions)}
                    action={
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        {getAchievementIcon(result.Mark)}
                        {renderScoreBadge(result.Mark)}
                      </Box>
                    }
                    title={
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {result.testDetails?.title || "ללא שם"}
                      </Typography>
                    }
                    subheader={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <EventIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {result.submitDate?.substring(0, 10) || "לא זמין"}
                        </Typography>
                        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                          <FormatListNumberedIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {result.testDetails?.questions?.length || 0} שאלות
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  
                  <CardActions>
                    <Button 
                      startIcon={<VisibilityIcon />} 
                      onClick={() => handleOpenDialog(result)}
                      color="primary"
                      variant="outlined"
                      fullWidth
                    >
                      הצג פרטים מלאים
                    </Button>
                  </CardActions>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        dir="rtl"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QuizIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {selectedResult?.testDetails?.title || "פרטי מבחן"}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {selectedResult && (
            <>
              <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body1">
                        תאריך הגשה: {selectedResult.submitDate?.substring(0, 10) || "לא זמין"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormatListNumberedIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body1">
                        מספר שאלות: {selectedResult.testDetails?.questions?.length || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      {getAchievementIcon(selectedResult.Mark)}
                      {renderScoreBadge(selectedResult.Mark)}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <QuizIcon sx={{ mr: 1 }} />
                שאלות ותשובות
              </Typography>
              <Stack spacing={2}>
                {selectedResult.testDetails?.questions?.map((q, qIndex) => {
                  const studentAnswer = selectedResult.answers?.find(
                    (a) => a.questionId === q._id
                  );
                  const isCorrect = studentAnswer && 
                    q.options[studentAnswer.selectedOptionIndex] === q.correctAnswer;
                  const borderColor = isCorrect ? 'success.main' : 'error.main';
                  const bgColor = isCorrect ? 'rgba(76, 175, 80, 0.04)' : 'rgba(244, 67, 54, 0.04)';
                  return (
                    <Fade in={true} key={q._id || qIndex} timeout={500} style={{ transitionDelay: `${qIndex * 100}ms` }}>
                      <Paper 
                        variant="outlined"
                        sx={{ 
                          p: 2,
                          borderRadius: 2,
                          borderRight: 4, 
                          borderColor: borderColor,
                          bgcolor: bgColor
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          שאלה {qIndex + 1}: {q.questionText}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
                          אפשרויות:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                          {q.options?.map((opt, i) => {
                            const isCorrectAnswer = opt === q.correctAnswer;
                            const isSelected = studentAnswer?.selectedOptionIndex === i;
                            return (
                              <Chip
                                key={i}
                                label={opt}
                                variant={isSelected ? "filled" : "outlined"}
                                color={
                                  isSelected 
                                    ? (isCorrectAnswer ? "success" : "error") 
                                    : (isCorrectAnswer ? "success" : "default")
                                }
                                size="medium"
                                icon={
                                  isSelected && isCorrectAnswer 
                                    ? <CheckCircleIcon /> 
                                    : (isSelected ? <CancelIcon /> : undefined)
                                }
                              />
                            );
                          })}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            תשובת סטודנט:
                          </Typography>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {studentAnswer
                              ? q.options[studentAnswer.selectedOptionIndex]
                              : "לא ענה"}
                          </Typography>
                          {isCorrect ? (
                            <CheckCircleIcon color="success" fontSize="small" sx={{ ml: 1 }} />
                          ) : (
                            <CancelIcon color="error" fontSize="small" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </Paper>
                    </Fade>
                  );
                })}
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewRezultTest;