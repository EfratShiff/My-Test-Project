// import { use, useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const ViewRezultTest = () => {
//     const [results, setResults] = useState([]);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const decoded = jwtDecode(token);
//        const studentId= decoded.userId;
//         const fetchResults = async () => {
//             try{
//                 const response = await axios.get(`http://localhost:8080/Result/getStudentTestResultByStudentID/${studentId}`);
//                 setResults(response.data.results); // שימי לב שזו הנחת מבנה JSON
//                 console.log("📥 התוצאות שהתקבלו:", response.data);
//                 console.log("📤 נשלח לשרת:", response.data);

//                 const testsWithDetailsPromises = results.map(async (result) => {
//                     const testId = result.testId; // נניח שיש מזהה כזה
//                     const testDetails = await axios.get(`http://localhost:8080/Test/getTest/${testId}`);
//                     alert(testDetails.data);
//                     console.log("📤 נשלח לשרת:", testDetails.data);
//                     return {
//                         ...result,
//                         testDetails: testDetails.data
//                     };
//                 });
//             }
//             catch (error) {
//                 console.error("❌ שגיאה בשליחת התוצאות:", error);
//                 // setScoreError("שליחת התוצאה נכשלה ❌");
//             }
//              };

//              fetchResults();
//       }, []);
//     return (
//     <>
//  <div>
//     <h2>תוצאות מבחנים</h2>

//     {<p style={{ color: "red" }}></p>}

//     {results.length === 0 ? (
//         <p>לא נמצאו תוצאות.</p>
//     ) : (
//         <ul>
//             {results.map((result, index) => (
//                 <li key={index} style={{ marginBottom: "1rem" }}>
//                     <strong>שם מבחן:</strong> {result.testDetails?.name || "ללא שם"}<br />
//                     <strong>תאריך:</strong> {result.submitDate?.date?.substring(0, 10) || "לא זמין"}<br />
//                     <strong>ציון:</strong> {result.Mark ?? "אין ציון"}
//                 </li>
//             ))}
//         </ul>
//     )}
// </div>

//    </>
//     );
//     }
//     export default ViewRezultTest;

// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const ViewRezultTest = () => {
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const decoded = jwtDecode(token);
//     const studentId = decoded.userId;

//     const fetchResults = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/Result/getStudentTestResultByStudentID/${studentId}`
//         );
//         const rawResults = response.data.results || response.data;

//         // 💡 כאן נביא לכל מבחן גם את השם שלו
//         const enrichedResults = await Promise.all(
//           rawResults.map(async (result) => {
//             try {
//               const testRes = await axios.get(
//                 `http://localhost:8080/Test/getTest/${result.TestId}`
//               );
//               console.log("📤 נשלח לשרת:", testRes.data);
              
//               return {
//                 ...result,
//                 testDetails: testRes.data,
                
//               };
//             } catch (err) {
//               console.warn("⚠️ שגיאה בשליפת מבחן:", result.TestId, err);
//               return {
//                 ...result,
//                 testDetails: { name: "שגיאה בשליפה" },
//               };
//             }
//           })
//         );

//         setResults(enrichedResults);
//       } catch (error) {
//         console.error("❌ שגיאה בשליפת תוצאות:", error);
//       }
//     };

//     fetchResults();
//   }, []);

//   return (
//     <ul>
//     {results.map((result, index) => (
//       <li key={index} style={{ marginBottom: "2rem" }}>
//         <h3>{result.testDetails.title || "ללא שם"}</h3>
//         <p>תאריך: {result.submitDate?.substring(0, 10) || "לא זמין"}</p>
//         <p>ציון: {Math.round(result.Mark ?? 0)}</p>
  
//         <ul>
//           {result.testDetails.questions.map((q) => {
//             // למצוא את תשובת התלמיד לשאלה זו
//             const studentAnswer = result.answers.find(
//               (a) => a.questionId === q._id
//             );
  
//             return (
//               <li key={q._id} style={{ marginBottom: "1rem" }}>
//                 <strong>שאלה:</strong> {q.questionText} <br />
//                 <strong>אפשרויות:</strong>{" "}
//                 {q.options.map((opt, i) => {
//                   const isCorrect = opt === q.correctAnswer;
//                   const isSelected = studentAnswer?.selectedOptionIndex === i;
//                   return (
//                     <span
//                       key={i}
//                       style={{
//                         fontWeight: isCorrect ? "bold" : "normal",
//                         color: isSelected
//                           ? isCorrect
//                             ? "green"
//                             : "red"
//                           : "black",
//                         marginRight: "10px",
//                       }}
//                     >
//                       {opt}
//                     </span>
//                   );
//                 })}
//                 <br />
//                 <strong>תשובת סטודנט:</strong>{" "}
//                 {studentAnswer
//                   ? q.options[studentAnswer.selectedOptionIndex]
//                   : "לא ענה"}
//               </li>
//             );
//           })}
//         </ul>
//       </li>
//     ))}
//   </ul>
  
//   );
// };

// export default ViewRezultTest;


import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
// MUI imports
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  List, 
  ListItem, 
  Paper, 
  Chip, 
  Grid, 
  CircularProgress,
  Alert
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import GradeIcon from '@mui/icons-material/Grade';
import QuizIcon from '@mui/icons-material/Quiz';

const ViewRezultTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const studentId = decoded.userId;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/Result/getStudentTestResultByStudentID/${studentId}`
        );
        const rawResults = response.data.results || response.data;

        // 💡 כאן נביא לכל מבחן גם את השם שלו
        const enrichedResults = await Promise.all(
          rawResults.map(async (result) => {
            try {
              const testRes = await axios.get(
                `http://localhost:8080/Test/getTest/${result.TestId}`
              );
              console.log("📤 נשלח לשרת:", testRes.data);
              
              return {
                ...result,
                testDetails: testRes.data,
              };
            } catch (err) {
              console.warn("⚠️ שגיאה בשליפת מבחן:", result.TestId, err);
              return {
                ...result,
                testDetails: { name: "שגיאה בשליפה" },
              };
            }
          })
        );

        setResults(enrichedResults);
      } catch (error) {
        console.error("❌ שגיאה בשליפת תוצאות:", error);
        setError("שגיאה בטעינת תוצאות המבחנים");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Function to render the score with appropriate color
  const renderScore = (score) => {
    const scoreValue = Math.round(score ?? 0);
    let color = "primary";
    
    if (scoreValue >= 90) color = "success";
    else if (scoreValue >= 70) color = "info";
    else if (scoreValue >= 55) color = "warning";
    else color = "error";

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GradeIcon color={color} />
        <Typography variant="h5" color={color}>
          {scoreValue}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
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
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        תוצאות מבחנים
      </Typography>

      {results.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">לא נמצאו תוצאות מבחנים</Typography>
        </Paper>
      ) : (
        <Box>
          {results.map((result, index) => (
            <Card key={index} sx={{ mb: 4, boxShadow: 3 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {result.testDetails.title || "ללא שם"}
                  </Typography>
                  {renderScore(result.Mark)}
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body1">
                        תאריך: {result.submitDate?.substring(0, 10) || "לא זמין"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <QuizIcon sx={{ mr: 1 }} />
                  שאלות ותשובות
                </Typography>

                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                  {result.testDetails.questions?.map((q, qIndex) => {
                    // למצוא את תשובת התלמיד לשאלה זו
                    const studentAnswer = result.answers?.find(
                      (a) => a.questionId === q._id
                    );
                    
                    const isCorrect = studentAnswer && 
                      q.options[studentAnswer.selectedOptionIndex] === q.correctAnswer;

                    return (
                      <Paper 
                        key={q._id || qIndex} 
                        variant="outlined"
                        sx={{ 
                          mb: 2, 
                          p: 2,
                          borderRight: 4, 
                          borderColor: isCorrect ? 'success.main' : 'error.main'
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
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ViewRezultTest;
