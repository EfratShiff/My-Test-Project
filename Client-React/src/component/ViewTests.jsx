import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  Box,  Typography,   Card,  CardContent,  CardHeader,CardActions,   
  Button, 
  Grid, 
  Container, 
  Chip, 
  CircularProgress, 
  Alert, 
  Divider,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const ViewTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [teachersNames, setTeachersNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/Test/getAllTest");
        setTests(response.data);
        setError(null);
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
  const handleClick = (testId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("לא נמצא טוקן, התחבר שוב");
      return; 
      }

    const decoded = jwtDecode(token);
    const role = decoded.role;
    const test = tests.find((test) => test._id === testId);
    if (!test) {
      alert("לא נמצא מבחן עם מזהה זה.");
      return;
    }
    const currentDate = new Date();
    const lastDate = new Date(test.lastDate);
    if (role === "teacher") {
      navigate(`/SolveTest/${testId}`);
      return;     }
    if (lastDate < currentDate) {
      alert("המבחן עבר את תאריך ההגשה. תלמיד לא יכול לגשת למבחן.");
      return;    }
    navigate(`/SolveTest/${testId}`);
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
  const [isEditingTest, setIsEditingTest] = useState(null);
  const [newTestTitle, setNewTestTitle] = useState("");
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
  const updateTestTitle = async (testId) => {
    if (!newTestTitle.trim()) {
      alert("שם המבחן לא יכול להיות ריק");
      return;
    }
    try {
      const currentTest = tests.find(test => test._id === testId);
      alert(currentTest)
      if (!currentTest) {
        throw new Error("לא נמצא מבחן לעדכון");
      }
      console.log("מבחן נוכחי שנמצא:", currentTest);
      console.log("ID של המבחן:", currentTest._id);
      const response = await axios.put(`http://localhost:8080/Test/updateTest/${currentTest._id}`, {
        title: newTestTitle,
        _id: currentTest._id 
         });
      console.log("תגובה מהשרת:", response.data);
      if (response.data) {
        setTests(prevTests => prevTests.map(test => 
          test._id === testId ? { ...test, title: newTestTitle } : test
        ));
        setIsEditingTest(null);
        setNewTestTitle("");
      } else {
        throw new Error("לא התקבלה תשובה מהשרת");
      }
    } catch (error) {
      console.error("פרטי השגיאה:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        data: error.config?.data
      });
      
      if (error.response) {
        alert(`שגיאה בעדכון שם המבחן: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        alert("לא התקבלה תשובה מהשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        alert(`שגיאה בעדכון שם המבחן: ${error.message}`);
      }
    }
  };
  const startEditingTest = (test) => {
    setIsEditingTest(test._id);
    setNewTestTitle(test.title);
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
            sx={{ mb: 2 }}
          >
            {teacher.name}
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
                    zIndex: isMiddleCard ? 1 : 0
                  }} 
                  onClick={isEditingTest === test._id ? undefined : () => handleClick(test._id)}
                >
                  <CardHeader
                    title={
                      isEditingTest === test._id ? (
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={newTestTitle}
                          onChange={(e) => setNewTestTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          sx={{ mb: 1 }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight="bold" noWrap>
                            {test.title}
                          </Typography>
                          {userIsTeacher && (
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingTest(test);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      )
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
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ p: 2, justifyContent: isEditingTest === test._id ? 'space-between' : 'center' }}>
                    {isEditingTest === test._id ? (
                      <>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          startIcon={<CancelIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingTest(null);
                          }}
                          sx={{ flex: 1, mr: 1 }}
                        >
                          ביטול
                        </Button>
                        <Button 
                          variant="contained" 
                          color="success" 
                          startIcon={<SaveIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTestTitle(test._id);
                          }}
                          sx={{ flex: 1 }}
                        >
                          שמור
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="contained" 
                        fullWidth
                        color={isExpired ? "inherit" : "primary"}
                        disabled={isExpired && !userIsTeacher}
                        startIcon={isExpired ? <WarningIcon /> : <DoneIcon />}
                        sx={{ 
                          fontWeight: 'bold',
                          py: 1,
                          height: '42px' 
                        }}
                      >
                        {isExpired ? (userIsTeacher ? 'צפה במבחן' : 'המבחן סגור') : 'פתח מבחן'}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};
export default ViewTests;