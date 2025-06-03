
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Button, 
    Container, 
    Typography, 
    Paper, 
    Grid, 
    Card, 
    CardContent, 
    CardActions,
    Fade,
    useTheme,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Alert
  } from "@mui/material";
  import { Link } from "react-router-dom";
  import { 
    Create as CreateIcon, 
    Visibility as VisibilityIcon,
    School,
    BarChart as BarChartIcon
  } from "@mui/icons-material";
  import axios from 'axios';
  import { jwtDecode } from 'jwt-decode';
  import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
  const TeacherMenu = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const userName = useSelector((state) => state.User.userName);
  
    const [viewGraph, setViewGraph] = useState(false); 
        const [teacherTests, setTeacherTests] = useState([]);
    const [loadingTests, setLoadingTests] = useState(true); 
    const [testsError, setTestsError] = useState(null); 
    const [selectedTest, setSelectedTest] = useState(null); 
    const [selectedTestAverage, setSelectedTestAverage] = useState(null); 
    const [loadingAverage, setLoadingAverage] = useState(false); 
    const [averageError, setAverageError] = useState(null); 
  
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        navigate('/login');
    };
  
    const menuItems = [
      {
        title: "יצירת מבחן",
        description: "בנה מבחן חדש עם שאלות מותאמות",
        icon: <CreateIcon sx={{ fontSize: 40 }} />,
        link: "/CreateTest",
        gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        hoverGradient: "linear-gradient(135deg, #0e877c 0%, #32d46b 100%)"
      },
      {
        title: "צפיה במבחנים",
        description: "נהל ובדוק את המבחנים הקיימים",
        icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
        link: "/ViewTests",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        hoverGradient: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
      },
      { 
        title: "גרף ממוצעי מבחנים",
        description: "צפה בממוצעי הציונים של התלמידים במבחנים שלך",
        icon: <BarChartIcon sx={{ fontSize: 40 }} />, 
        onClick: () => {
          setViewGraph(true); 
          fetchTeacherTests(); 
        },
        gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)", 
        hoverGradient: "linear-gradient(135deg, #ff8a8e 0%, #fdbefb 99%, #fdbefb 100%)" 
      }
    ];
  
    const fetchTeacherTests = async () => {
      setLoadingTests(true);
      setTestsError(null);
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const currentTeacherId = decoded.userId;

        const response = await axios.get('http://localhost:8080/Test/getAllTest', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const teachersTests = response.data.filter(test => test.teacherId === currentTeacherId);
        setTeacherTests(teachersTests);
        console.log("Fetched teacher's tests:", teachersTests);
      } catch (err) {
        console.error("Error fetching teacher's tests:", err);
        setTestsError("שגיאה בטעינת רשימת המבחנים שלך");
      } finally {
        setLoadingTests(false);
      }
    };

    const handleTestClick = async (test) => {
      setSelectedTest(test);
      setLoadingAverage(true);
      setAverageError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/Test/average/${test._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSelectedTestAverage(response.data.averageScore);
        console.log(`Fetched average for test ${test._id}:`, response.data.averageScore);
      } catch (err) {
        console.error('Error fetching class average:', err);
        setAverageError('שגיאה בטעינת ממוצע הציונים למבחן זה');
        setSelectedTestAverage(null); 
      } finally {
        setLoadingAverage(false);
      }
    };

    const handleBackToList = () => {
      setSelectedTest(null);
      setSelectedTestAverage(null);
      setAverageError(null);
    };
  
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Fade in timeout={800}>
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                background: "linear-gradient(45deg, #11998e 30%, #38ef7d 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              שלום המורה {userName}
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              ברוך הבא למערכת ניהול המבחנים המתקדמת
            </Typography>
            {!viewGraph && (
              <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ mt: 2 }}
              >
                  התנתקות
              </Button>
            )}
          </Box>
        </Fade>

        {!viewGraph ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%' }}>
            <Grid container spacing={4} justifyContent="center">
              {menuItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={5} key={index}>
                  <Fade in timeout={1000 + index * 200}>
                    <Card
                      component={item.link ? Link : 'div'}
                      to={item.link || '#'}
                      onClick={item.onClick}
                      sx={{
                        height: '100%',
                        textDecoration: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 4,
                        background: item.gradient,
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: 'translateY(0)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                          background: item.hoverGradient,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        }
                      }}
                    >
                      <CardContent 
                        sx={{ 
                          color: 'white',
                          textAlign: 'center',
                          py: 6,
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        <Box 
                          sx={{ 
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: alpha('#ffffff', 0.2),
                            backdropFilter: 'blur(10px)',
                            mx: 'auto',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)'
                            }
                          }}
                        >
                          {item.icon}
                        </Box>
                        
                        <Typography 
                          variant="h4" 
                          component="h2" 
                          sx={{ 
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '1.5rem', md: '2rem' }
                          }}
                        >
                          {item.title}
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            opacity: 0.9,
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                          }}
                        >
                          {item.description}
                        </Typography>
                      </CardContent>
          
                      <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                        {item.link ? (
                          <Button
                             variant="contained"
                             size="large"
                             component={Link}
                             to={item.link}
                             sx={{
                                background: item.gradient,
                                color: 'white', 
                                border: '2px solid rgba(255,255,255,1)',
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                fontSize: '1.3rem',
                                fontWeight: 800,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  background: item.hoverGradient,
                                  transform: 'scale(1.08)',
                                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                  color: 'white' 
                                }
                              }}
                          >
                             {item.title}
                          </Button>
                         ) : ( 
                          <Button
                             variant="contained"
                             size="large"
                             onClick={item.onClick}
                             sx={{
                                background: item.gradient,
                                color: 'white', 
                                border: '2px solid rgba(255,255,255,1)',
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                fontSize: '1.3rem',
                                fontWeight: 800,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  background: item.hoverGradient,
                                  transform: 'scale(1.08)',
                                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                  color: 'white' 
                                }
                              }}
                           >
                             {item.title}
                           </Button>
                         )}
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h6" sx={{ color: 'white' }}>📊</Typography>
                    </Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {selectedTest ? `ממוצע ציונים במבחן "${selectedTest.title}"` : 'גרף ממוצעי מבחנים'}
                    </Typography>
                  </Box>
                  {selectedTest ? (
                    <Box sx={{ mb: 4, width: '100%' }}>
                      {loadingAverage ? (
                         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                           <CircularProgress />
                         </Box>
                      ) : averageError ? (
                         <Alert severity="error">{averageError}</Alert>
                      ) : (
                         <Box sx={{ height: 300, width: '100%' }}>
                           <ResponsiveContainer width="100%" height="100%">
                             <BarChart
                               data={[{ name: 'ממוצע כיתתי', score: Math.round(selectedTestAverage) }] }
                               margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                             >
                               <CartesianGrid strokeDasharray="3 3" />
                               <XAxis dataKey="name" />
                               <YAxis domain={[0, 100]} />
                               <Tooltip />
                               <Bar dataKey="score" fill={theme.palette.success.main} radius={[6, 6, 0, 0]} />
                             </BarChart>
                           </ResponsiveContainer>
                         </Box>
                      )}
                       <Box sx={{ textAlign: 'center', mt: 2 }}>
                         <Button variant="outlined" onClick={handleBackToList}>
                           חזרה לרשימת המבחנים
                         </Button>
                       </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 4, width: '100%', textAlign: 'center' }}>
                      {loadingTests ? (
                         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                           <CircularProgress />
                         </Box>
                      ) : testsError ? (
                         <Alert severity="error">{testsError}</Alert>
                      ) : teacherTests.length === 0 ? (
                         <Typography variant="h6" color="text.secondary">
                           עוד לא יצרת מבחנים.
                         </Typography>
                      ) : (
                         <Typography variant="h6" color="text.secondary">
                           בחר מבחן מהרשימה כדי לראות את ממוצע הציונים.
                         </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                 <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center', width: '100%' }}>
                     <Box sx={{ width: 40, height: 40, bgcolor: theme.palette.secondary.main, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>📝</Typography> 
                     </Box>
                      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, textAlign: 'center' }}>
                       המבחנים שיצרתי
                     </Typography>
                   </Box>

                   <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      width: '100%',
                      overflowY: 'auto',
                      maxHeight: '400px', 
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#555',
                        },
                      },
                      pr: 1
                     }}>
                     {loadingTests ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                          <CircularProgress />
                        </Box>
                     ) : testsError ? (
                        <Alert severity="error">{testsError}</Alert>
                     ) : teacherTests.length === 0 ? (
                       <Alert severity="info" sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
                         לא נמצאו מבחנים שיצרת.
                       </Alert>
                     ) : (
                       teacherTests.map((test) => (
                         <Card
                           key={test._id}
                           sx={{
                             borderRadius: 3,
                             boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                             border: '1px solid',
                             borderColor: alpha(theme.palette.divider, 0.1),
                             '&:hover': {
                               transform: 'translateY(-2px)',
                               boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                             },
                             cursor: 'pointer' 
                           }}
                           onClick={() => handleTestClick(test)}
                         >
                           <CardContent sx={{ p: 2 }}>
                             <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, textAlign: 'center' }}>
                               {test.title}
                             </Typography>
                           </CardContent>
                         </Card>
                       ))
                     )}
                   </Box>
                 </Box>
              </Box>
            </Box>
        )}
        <Box
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            zIndex: 1000
          }}
        >
          <Fade in timeout={2000}>
            <Paper
              elevation={8}
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(17, 153, 142, 0.7)'
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(17, 153, 142, 0)'
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(17, 153, 142, 0)'
                  }
                },
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 8px 25px rgba(17, 153, 142, 0.4)'
                }
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>↑</Typography>
            </Paper>
          </Fade>
        </Box>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: -1,
            overflow: 'hidden'
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: Math.random() * 120 + 60,
                height: Math.random() * 120 + 60,
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${
                  ['#11998e', '#38ef7d', '#667eea', '#764ba2', '#4facfe', '#00f2fe'][i]
                }, transparent)`,
                opacity: 0.08,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `teacherFloat${i} ${12 + Math.random() * 8}s ease-in-out infinite`,
                '@keyframes teacherFloat0': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0.08 },
                  '50%': { transform: 'translateY(-25px) rotate(180deg)', opacity: 0.15 }
                },
                '@keyframes teacherFloat1': {
                  '0%, 100%': { transform: 'translateX(0px) rotate(0deg)', opacity: 0.08 },
                  '50%': { transform: 'translateX(25px) rotate(-180deg)', opacity: 0.12 }
                },
                '@keyframes teacherFloat2': {
                  '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: 0.08 },
                  '50%': { transform: 'translateY(-20px) translateX(20px)', opacity: 0.15 }
                },
                '@keyframes teacherFloat3': {
                  '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 0.08 },
                  '50%': { transform: 'scale(1.2) rotate(90deg)', opacity: 0.12 }
                },
                '@keyframes teacherFloat4': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0.08 },
                  '50%': { transform: 'translateY(30px) rotate(-90deg)', opacity: 0.15 }
                },
                '@keyframes teacherFloat5': {
                  '0%, 100%': { transform: 'translateX(0px) scale(1)', opacity: 0.08 },
                  '50%': { transform: 'translateX(-25px) scale(1.3)', opacity: 0.12 }
                }
              }}
            />
          ))}
        </Box>
      </Container>
    );
  };
  export default TeacherMenu;