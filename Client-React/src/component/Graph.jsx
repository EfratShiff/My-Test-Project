

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
  alpha
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';

const Graph = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

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
            timeTaken: student.timeTaken
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, gap: 2 }}>
        <PersonIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          הבחינות שלי
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Chip
                    label={`${Math.round(result.score)}%`}
                    sx={{
                      backgroundColor: getScoreBackgroundColor(result.score),
                      color: getScoreColor(result.score),
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      height: 40,
                      borderRadius: 5,
                      border: `2px solid ${getScoreColor(result.score)}`,
                      minWidth: 80
                    }}
                  />

                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                      {result.testName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                      {formatDate(result.date)}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'left', minWidth: 100 }}>
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

      {testResults.length > 0 && (
        <Box sx={{ mt: 6, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
            סטטיסטיקות
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {testResults.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סה"כ מבחנים
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                {Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ממוצע ציונים
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                {Math.max(...testResults.map(r => r.score))}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ציון הגבוה ביותר
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Graph;
















// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';

// const Graph = () => {
//   const [testResults, setTestResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // שליפת userId מה-token (כמו בקוד המקורי)
//   const token = localStorage.getItem('token');
//   let currentUserId;
  
//   try {
//     // פונקציה פשוטה לפענוח JWT (במקום jwtDecode)
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     const decoded = JSON.parse(jsonPayload);
//     currentUserId = decoded.userId;
//   } catch (err) {
//     console.error('Error decoding token:', err);
//     setError('שגיאה בפענוח הטוקן');
//   }

//   useEffect(() => {
//     if (currentUserId) {
//       fetchTestResults();
//     }
//   }, [currentUserId]);

//   const fetchTestResults = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:8080/Test/getAllTest', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const filteredResults = [];

//       response.data.forEach(test => {
//         const student = test.studentResults.find(s => s.studentId === currentUserId);
//         if (student) {
//           filteredResults.push({
//             testName: test.title,
//             date: test.lastDate,
//             score: student.score,
//             correctAnswers: student.correctAnswers,
//             totalQuestions: student.totalQuestions,
//             timeTaken: student.timeTaken
//           });
//         }
//       });

//       const sorted = filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));
//       setTestResults(sorted);
//     } catch (err) {
//       console.error('Error fetching test results:', err);
//       setError('שגיאה בטעינת תוצאות המבחנים');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getScoreColor = (score) => {
//     if (score >= 90) return 'text-green-600 border-green-500 bg-green-50';
//     if (score >= 70) return 'text-orange-600 border-orange-500 bg-orange-50';
//     return 'text-red-600 border-red-500 bg-red-50';
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const time = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
//     const dateFormatted = date.toLocaleDateString('he-IL');
//     return `${time} ${dateFormatted}`;
//   };

//   // נתונים לגרף השוואה - כרגע ריק, אתה תוכל להוסיף לוגיקה לשליפת ממוצע כיתתי
//   const comparisonData = [
//     { name: 'הציון שלי', value: testResults.length > 0 ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length) : 0 },
//     { name: 'ממוצע כיתתי', value: 0 } // כאן תוכל להוסיף את הלוגיקה לשליפת ממוצע כיתתי
//   ];

//   // נתונים לגרף התפלגות ציונים - כרגע ריק, אתה תוכל להוסיף לוגיקה
//   const distributionData = [
//     { range: '0-20', count: 0 },
//     { range: '21-40', count: 0 },
//     { range: '41-60', count: 0 },
//     { range: '61-80', count: 0 },
//     { range: '81-100', count: 0 }
//   ];

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center text-lg">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* גרפים - צד שמאל */}
//         <div className="space-y-6">
//           {/* כותרת לגרפים */}
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
//               <span className="text-white font-bold">📊</span>
//             </div>
//             <h1 className="text-3xl font-bold text-blue-600">השוואה כיתתית</h1>
//           </div>

//           {/* גרף השוואה */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//             <h2 className="text-xl font-semibold text-center mb-4">השוואה לכיתה</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={comparisonData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis 
//                     dataKey="name" 
//                     tick={{ fill: '#374151', fontSize: 12 }}
//                     axisLine={{ stroke: '#d1d5db' }}
//                   />
//                   <YAxis 
//                     tick={{ fill: '#374151', fontSize: 12 }}
//                     axisLine={{ stroke: '#d1d5db' }}
//                     domain={[0, 100]}
//                   />
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: '#ffffff',
//                       border: '1px solid #d1d5db',
//                       borderRadius: 8,
//                       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                     }}
//                   />
//                   <Bar 
//                     dataKey="value" 
//                     fill="#3b82f6"
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <p className="text-center text-sm text-gray-500 mt-2">
//               מתוך: GAVA • נבחנים
//             </p>
//           </div>

//           {/* גרף התפלגות ציונים */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//             <h2 className="text-xl font-semibold text-center mb-4">התפלגות ציונים בכיתה</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={distributionData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis 
//                     dataKey="range" 
//                     tick={{ fill: '#374151', fontSize: 12 }}
//                     axisLine={{ stroke: '#d1d5db' }}
//                   />
//                   <YAxis 
//                     tick={{ fill: '#374151', fontSize: 12 }}
//                     axisLine={{ stroke: '#d1d5db' }}
//                     domain={[0, 10]}
//                   />
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: '#ffffff',
//                       border: '1px solid #d1d5db',
//                       borderRadius: 8,
//                       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                     }}
//                   />
//                   <Bar 
//                     dataKey="count" 
//                     fill="#8b5cf6"
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* המבחנים שלי - צד ימין (הקוד המקורי שלך) */}
//         <div className="space-y-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//               <span className="text-white font-bold">👤</span>
//             </div>
//             <h1 className="text-3xl font-bold text-blue-600">הבחינות שלי</h1>
//           </div>

//           <div className="space-y-4 mb-6">
//             {testResults.length === 0 ? (
//               <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-center text-lg">
//                 עדיין לא ביצעת מבחנים
//               </div>
//             ) : (
//               testResults.map((result, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
//                 >
//                   <div className="flex justify-between items-center flex-wrap gap-4">
//                     <div className={`px-4 py-2 rounded-lg border-2 font-bold text-lg min-w-20 text-center ${getScoreColor(result.score)}`}>
//                       {Math.round(result.score)}%
//                     </div>

//                     <div className="flex-1 text-center">
//                       <h3 className="text-xl font-semibold text-gray-800 mb-1">
//                         {result.testName}
//                       </h3>
//                       <p className="text-blue-600 font-medium">
//                         {formatDate(result.date)}
//                       </p>
//                     </div>

//                     <div className="text-right min-w-24">
//                       {result.correctAnswers && result.totalQuestions && (
//                         <p className="text-gray-600 font-medium">
//                           {result.correctAnswers}/{result.totalQuestions} נכונות
//                         </p>
//                       )}
//                       {result.timeTaken && (
//                         <p className="text-gray-600 font-medium">
//                           זמן: {result.timeTaken}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {testResults.length > 0 && (
//             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//               <div className="bg-blue-50 rounded-lg p-4">
//                 <h2 className="text-xl font-semibold text-center mb-4">סטטיסטיקות</h2>
//                 <div className="flex justify-around flex-wrap gap-4">
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-blue-600">
//                       {testResults.length}
//                     </div>
//                     <p className="text-gray-600 text-sm">
//                       סה"כ מבחנים
//                     </p>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-green-600">
//                       {Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length)}%
//                     </div>
//                     <p className="text-gray-600 text-sm">
//                       ממוצע ציונים
//                     </p>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-orange-600">
//                       {Math.max(...testResults.map(r => r.score))}%
//                     </div>
//                     <p className="text-gray-600 text-sm">
//                       ציון הגבוה ביותר
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Graph;
