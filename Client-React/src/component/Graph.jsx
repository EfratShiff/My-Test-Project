import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Grid,
  Button
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
import { Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';

const Graph = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const [selectedTest, setSelectedTest] = useState(null);
  const [classAverage, setClassAverage] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  console.log(decoded);
  const currentUserId = decoded.userId;

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/Test/getAllTest', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const filteredResults = [];

      response.data.forEach(test => {
        const student = test.studentResults.find(s => s.studentId === currentUserId);
        if (student) {
          filteredResults.push({
            testName: test.title,
            date: test.lastDate,
            score: student.score,
            correctAnswers: student.correctAnswers,
            totalQuestions: student.totalQuestions,
            timeTaken: student.timeTaken,
            testId: test._id,
          });
        }
      });

      const sorted = filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTestResults(sorted);
    } catch (err) {
      console.error('Error fetching test results:', err);
      setError('שגיאה בטעינת תוצאות המבחנים');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  const getScoreBackgroundColor = (score) => {
    if (score >= 90) return alpha('#4caf50', 0.1);
    if (score >= 70) return alpha('#ff9800', 0.1);
    return alpha('#f44336', 0.1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = date.toLocaleDateString('he-IL');
    return `${time} ${dateFormatted}`;
  };

  const handleTestClick = async (test) => {
    setSelectedTest(test);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/Test/average/${test.testId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClassAverage(response.data.averageScore);
    } catch (err) {
      console.error('Error fetching class average:', err);
      setClassAverage(null);
    }
  };

  const handleBackToAllTests = () => {
    setSelectedTest(null);
    setClassAverage(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ fontSize: '1.1rem' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      py: 6, 
      px: { xs: 2, md: 4 }, 
      width: '100%',
      maxWidth: '100%',
      margin: 0
    }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* עמודה שמאלית: גרף */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center', width: '100%' }}>
              <Box sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ color: 'white' }}>📊</Typography>
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {selectedTest ? `מבחן ב${selectedTest.testName}` : 'סיכום תוצאות'}
              </Typography>
            </Box>
            
            {selectedTest ? (
              <Box sx={{ mb: 4, width: '100%' }}>
                <Box sx={{ height: 200, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[{ name: 'הציון שלי', score: Math.round(selectedTest.score) }, { name: 'ממוצע כיתתי', score: Math.round(classAverage) }] }
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 4, width: '100%', textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  בחר בחינה מהרשימה כדי לראות את הביצועים שלך בהשוואה לכיתה
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        {/* עמודה ימנית: רשימת מבחנים */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center', width: '100%' }}>
              <Box sx={{ width: 40, height: 40, bgcolor: theme.palette.secondary.main, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Typography variant="h6" sx={{ color: 'white' }}>📋</Typography>
              </Box>
               <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, textAlign: 'center' }}>
                הבחינות שלי
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
              {testResults.length === 0 ? (
                <Alert severity="info" sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
                  עדיין לא ביצעת מבחנים
                </Alert>
              ) : (
                testResults.map((result, index) => (
                  <Card
                    key={index}
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.1),
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                      }
                    }}
                    onClick={() => handleTestClick(result)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          label={`${Math.round(result.score)}%`}
                          sx={{
                            backgroundColor: getScoreBackgroundColor(result.score),
                            color: getScoreColor(result.score),
                            fontWeight: 700,
                            fontSize: '1rem',
                            height: 35,
                            borderRadius: 5,
                            border: `2px solid ${getScoreColor(result.score)}`,
                            minWidth: 70
                          }}
                        />

                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                            {result.testName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                            {formatDate(result.date)}
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'left', minWidth: 90 }}>
                          {result.correctAnswers && result.totalQuestions && (
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                              {result.correctAnswers}/{result.totalQuestions} נכונות
                            </Typography>
                          )}
                          {result.timeTaken && (
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                              זמן: {result.timeTaken}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* סטטיסטיקות מתחת לשני העמודות */}
      <Box sx={{ width: '100%', mt: 4 }}>
        {testResults.length > 0 && (
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              סטטיסטיקות
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {testResults.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סה"כ מבחנים שנבחנתי
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                   {testResults.length > 0 ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length) : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ממוצע הציונים שלי
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {testResults.length > 0 ? Math.max(...testResults.map(r => r.score)) : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  הציון שלי הגבוה ביותר
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Graph;
