import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Box, Typography, Card, CardContent, CardHeader, CardActions,Button,Grid,Container,Chip,
  CircularProgress,Alert,Divider,Paper,TextField,IconButton,Dialog,DialogActions,
  DialogContent,DialogContentText,DialogTitle,MenuItem} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CloseIcon from "@mui/icons-material/Close";
import { Stack, Fade } from "@mui/material";
const ViewTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [teachersNames, setTeachersNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedTest, setEditedTest] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
  questionText: '',options: ['', '', '', ''], correctAnswer: '',timeLimit: 0});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const isTeacher = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.role === "teacher";
    } catch (error) {
      console.error("שגיאה בפענוח הטוקן:", error);
      return false;
    }
  };
  const getCurrentTeacherId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error("שגיאה בפענוח הטוקן:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Test/getAllTest', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("Test data:", response.data);
        setTests(response.data);
        setError(null);
        if (isTeacher()) {
          const currentTeacherId = getCurrentTeacherId();
          if (currentTeacherId) {
            setSelectedTeacher(currentTeacherId);
          }
        }
      } catch (error) {
        setError("שגיאה בטעינת מבחנים");
        console.error("Error fetching tests", error);
      } finally {
        setLoading(false);
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
  const handleTestClick = (test) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('נא להתחבר מחדש');
      return;
    }
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    const role = decoded.role;
    if (role === 'teacher' || role === 'manager') {
      navigate(`/SolveTest/${test._id}`);
      return;
    }
    const hasAlreadyTakenTest = test.studentResults?.some(result =>
      result.studentId && (result.studentId === userId || result.studentId.toString() === userId)
    );
    if (hasAlreadyTakenTest) {
      return;
    }
    const now = new Date();
    const endDate = new Date(test.lastDate);
    if (now > endDate) {
      return;
    }
    navigate(`/SolveTest/${test._id}`);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedResult(null);
  };
  const getTestStatus = (test, userId) => {
    const now = new Date();
    const endDate = new Date(test.lastDate);
    const isExpired = now > endDate;
    // בדיקה אם המשתמש הנוכחי כבר נבחן במבחן
    const currentUserHasTakenTest = test.studentResults?.some(result =>
      result.studentId && (result.studentId === userId || result.studentId.toString() === userId)
    );
    if (currentUserHasTakenTest) {
      return {
        status: 'completed',
        color: '#f5f5f5',
        borderColor: '#9e9e9e',
        text: 'כבר נבחנת במבחן זה',
        buttonText: 'מבחן הושלם',
        buttonColor: 'secondary',
        disabled: true
      };
    }
    else if (isExpired) {
      return {
        status: 'expired',
        color: '#ffebee',
        borderColor: '#f44336',
        text: 'המבחן הסתיים',
        buttonText: 'המבחן הסתיים',
        buttonColor: 'error',
        disabled: true
      };
    } else {
      return {
        status: 'available',
        color: 'white',
        borderColor: '#e0e0e0',
        text: 'מבחן זמין',
        buttonText: 'התחל מבחן',
        buttonColor: 'primary',
        disabled: false
      };
    }
  };
  const getRemainingTime = (lastDate) => {
    const now = new Date();
    const deadline = new Date(lastDate);
    const diff = deadline - now;
    if (diff <= 0) return "הזמן תם";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) {
      return `${days} ימים ו-${hours} שעות`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} שעות ו-${minutes} דקות`;
    }
  };
  const getCardStyle = (isExpired) => {
    return {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
      },
      border: isExpired ? '1px solid #ffcdd2' : '1px solid #e0e0e0',
      backgroundColor: isExpired ? '#fff8f8' : '#ffffff'
    };
  };
  const canEditTest = (test) => {
    const currentTeacherId = getCurrentTeacherId();
    return isTeacher() && currentTeacherId === test.teacherId;
  };
  const handleEditTest = (test) => {
    if (!canEditTest(test)) {
      alert("אין לך הרשאה לערוך מבחן זה");
      return;
    }
    setEditedTest({ ...test });
    setEditDialogOpen(true);
  };
  const handleSaveTest = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/Test/updateTest/${editedTest._id}`, editedTest);
      if (response.data) {
        setTests(prevTests => prevTests.map(test =>
          test._id === editedTest._id ? response.data : test
        ));
        setEditDialogOpen(false);
        setEditedTest(null);
        alert("המבחן עודכן בהצלחה!");
      }
    } catch (error) {
      console.error("שגיאה בעדכון מבחן:", error);
      alert(`שגיאה בעדכון המבחן: ${error.response?.data?.message || error.message}`);
    }
  };
  const handleAddQuestion = () => {
    setEditedTest(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion }]
    }));
    setNewQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      timeLimit: 0
    });
  };
  const handleRemoveQuestion = (index) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };
  const handleQuestionChange = (index, field, value) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optionIndex ? value : opt)
        } : q
      )
    }));
  };
  const getUniqueTeachers = () => {
    const uniqueTeacherIds = [...new Set(tests.map(test => test.teacherId))];
    return uniqueTeacherIds.map(id => ({
      id,
      name: teachersNames[id] || "טעינה..."
    })).filter(teacher => teacher.id);
  };
  const getFilteredTests = () => {
    if (!selectedTeacher) return tests;
    return tests.filter(test => test.teacherId === selectedTeacher);
  };
  const handleDeleteClick = (test, e) => {
    e.stopPropagation();
    if (!canEditTest(test)) {
      alert("אין לך הרשאה למחוק מבחן זה");
      return;
    }
    setTestToDelete(test);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("לא נמצא טוקן, התחבר שוב");
        return;
      }
      console.log("מנסה למחוק מבחן עם מזהה:", testToDelete._id);
      console.log("טוקן:", token);
      const response = await axios.delete(`http://localhost:8080/Test/deleteTest/${testToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("תגובה מהשרת:", response.data);
      if (response.data) {
        setTests(prevTests => prevTests.filter(test => test._id !== testToDelete._id));
        setDeleteDialogOpen(false);
        setTestToDelete(null);
        alert("המבחן נמחק בהצלחה!");
      }
    } catch (error) {
      console.error("שגיאה במחיקת מבחן:", error);
      console.error("פרטי השגיאה:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      alert(`שגיאה במחיקת המבחן: ${error.response?.data?.message || error.message}`);
    }
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" flexDirection="column">
        <CircularProgress size={60} />
        <Typography variant="h6" mt={2}>טוען מבחנים...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }
  const uniqueTeachers = getUniqueTeachers();
  const filteredTests = getFilteredTests();
  const currentTeacherId = getCurrentTeacherId();
  return (
    <Container maxWidth="lg" dir="rtl" sx={{ mt: 4, mb: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          מבחנים זמינים
        </Typography>
        <Divider variant="middle" sx={{
          width: '80px',
          mx: 'auto',
          borderBottomWidth: 3,
          borderColor: 'primary.main',
          mb: 2
        }} />
        <Typography variant="subtitle1" color="text.secondary">
          לחץ על מבחן כדי לפתוח אותו
        </Typography>
      </Box>
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        <Button
          variant={selectedTeacher === null ? "contained" : "outlined"}
          color="primary"
          onClick={() => setSelectedTeacher(null)}
          sx={{ mb: 2 }}
        >
          כל המבחנים
        </Button>
        {uniqueTeachers.map((teacher) => (
          <Button
            key={teacher.id}
            variant={selectedTeacher === teacher.id ? "contained" : "outlined"}
            color="primary"
            onClick={() => setSelectedTeacher(teacher.id)}
            sx={{
              mb: 2,
              ...(teacher.id === currentTeacherId && selectedTeacher === teacher.id && {
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                border: '2px solid',
                borderColor: 'primary.main'
              })
            }}
          >
            {teacher.name}
            {teacher.id === currentTeacherId && ' (אני)'}
          </Button>
        ))}
      </Box>
      {filteredTests.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: '#f5f5f5'
          }}
        >
          <MenuBookIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            {selectedTeacher ? 'אין מבחנים זמינים למורה זה' : 'אין מבחנים זמינים כרגע'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredTests.map((test, index) => {
            const token = localStorage.getItem('token');
            const decoded = token ? jwtDecode(token) : null;
            const userId = decoded?.userId;
            const testStatus = getTestStatus(test, userId);
            const currentDate = new Date();
            const lastDate = new Date(test.lastDate);
            const isExpired = lastDate < currentDate;
            const remainingTime = getRemainingTime(test.lastDate);
            const userIsTeacher = isTeacher();
            const isMiddleCard = index === Math.floor(filteredTests.length / 2);
            return (
              <Grid
                item
                xs={12}
                sm={isMiddleCard ? 8 : 6}
                md={isMiddleCard ? 6 : 4}
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Card
                  sx={{
                    ...getCardStyle(isExpired),
                    width: isMiddleCard ? '100%' : '100%',
                    transform: isMiddleCard ? 'scale(1.05)' : 'none',
                    zIndex: isMiddleCard ? 1 : 0,
                    bgcolor: testStatus.color,
                    border: `2px solid ${testStatus.borderColor}`,
                    position: 'relative'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestClick(test);
                  }}
                >
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {test.title}
                        </Typography>
                        {canEditTest(test) && (
                          <Box>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTest(test);
                              }}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => handleDeleteClick(test, e)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    }
                    action={
                      <Chip
                        icon={isExpired ? <WarningIcon /> : <AccessTimeIcon />}
                        label={isExpired ? "מבחן סגור" : remainingTime}
                        color={isExpired ? "error" : "success"}
                        variant="filled"
                        sx={{ fontWeight: 'medium' }}
                      />
                    }
                    sx={{ pb: 1 }}
                  />
                  <CardContent sx={{ pt: 0, flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={1.5}>
                      <PersonIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {teachersNames[test.teacherId] || "טעינה..."}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        מועד אחרון: {lastDate.toLocaleString('he-IL')}
                      </Typography>
                    </Box>
                    <Alert
                      severity={testStatus.status === 'completed' ? 'success' :
                        testStatus.status === 'expired' ? 'error' : 'info'}
                      sx={{ mt: 2 }}
                    >
                      {testStatus.text}
                    </Alert>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      color={testStatus.buttonColor}
                      disabled={testStatus.disabled}
                      sx={{
                        fontWeight: 'bold',
                        py: 1,
                        height: '42px'
                      }}
                    >
                      {testStatus.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>עריכת מבחן</DialogTitle>
        <DialogContent>
          {editedTest && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="כותרת המבחן"
                value={editedTest.title}
                onChange={(e) => setEditedTest(prev => ({ ...prev, title: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="תאריך אחרון להגשה"
                type="datetime-local"
                value={new Date(editedTest.lastDate).toISOString().slice(0, 16)}
                onChange={(e) => setEditedTest(prev => ({ ...prev, lastDate: new Date(e.target.value) }))}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>שאלות</Typography>
              {editedTest.questions.map((question, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">שאלה {index + 1}</Typography>
                    <IconButton onClick={() => handleRemoveQuestion(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <TextField
                    fullWidth
                    label="טקסט השאלה"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  {question.options.map((option, optionIndex) => (
                    <TextField
                      key={optionIndex}
                      fullWidth
                      label={`תשובה ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                  <TextField
                    select
                    fullWidth
                    label="תשובה נכונה"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                    sx={{ mb: 1 }}
                  >
                    {question.options.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    type="number"
                    label="זמן לשאלה (בדקות)"
                    value={question.timeLimit}
                    onChange={(e) => handleQuestionChange(index, 'timeLimit', parseInt(e.target.value))}
                  />
                </Paper>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddQuestion}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                הוסף שאלה
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleSaveTest} variant="contained" color="primary">
            שמור שינויים
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>אישור מחיקת מבחן</DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את המבחן "{testToDelete?.title}"?
            פעולה זו אינה ניתנת לביטול
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            מחק
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        dir="rtl"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuBookIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {selectedResult?.testDetails?.title || "פרטי מבחן"}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Dialog>
    </Container>
  );
};
export default ViewTests;