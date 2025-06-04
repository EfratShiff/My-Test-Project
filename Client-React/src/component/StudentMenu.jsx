import React from 'react';
import { useSelector } from 'react-redux';
import { Box,Button,Container,Typography,Paper, Grid, Card, CardContent, CardActions,
    Fade,useTheme,alpha} from "@mui/material";
  import { Link, useNavigate } from "react-router-dom";
  import { Quiz as QuizIcon, Assessment as AssessmentIcon,BarChart as BarChartIcon
  } from "@mui/icons-material";

  const StudentMenu = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const userName = useSelector((state) => state.User.userName);

    const menuItems = [
      {
        title: "פתרון מבחן",
        description: "התחל מבחן חדש",
        icon: <QuizIcon sx={{ fontSize: 40 }} />,
        link: "/ViewTests",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        hoverGradient: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
      },
      {
        title: "תוצאות המבחנים",
        description: "צפה בביצועים והישגים שלך",
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        link: "/ViewRezultTest", 
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        hoverGradient: "linear-gradient(135deg, #e081e9 0%, #e3455a 100%)"
      },
      {
        title: "צפיה בגרף תוצאות",
        description: "צפה בגרף התקדמות הציונים שלך",
        icon: <BarChartIcon sx={{ fontSize: 40 }} />,
        link: "/Graph",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        hoverGradient: "linear-gradient(135deg, #3d8bfe 0%, #00d4fe 100%)"
      }
    ];
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        navigate('/login');
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
              שלום לתלמיד/ה {userName}
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
              ברוך הבא למערכת המבחנים
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
               <Button
                 variant="outlined"
                 color="error"
                 onClick={handleLogout}
                 sx={{ fontSize: 18 }}
               >
                 התנתקות
               </Button>
            </Box>
          </Box>
        </Fade>
        <Grid container spacing={4} justifyContent="center">
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Card
                  component={Link}
                  to={item.link}
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
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {item.title}
                    </Typography>  
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#ffffff',
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        fontWeight: 600,
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        background: 'rgba(255,255,255,0.9)',
                        color: '#1a1a1a',
                        border: '2px solid rgba(255,255,255,1)',
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#ffffff',
                          transform: 'scale(1.08)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                          color: '#000'
                        }
                      }}
                    >
                      {item.title}
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
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
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(255, 107, 107, 0.7)'
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(255, 107, 107, 0)'
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(255, 107, 107, 0)'
                  }
                },
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)'
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
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${
                  ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][i]
                }, transparent)`,
                opacity: 0.1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float${i} ${10 + Math.random() * 10}s ease-in-out infinite`,
                '@keyframes float0': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0.1 },
                  '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: 0.2 }
                },
                '@keyframes float1': {
                  '0%, 100%': { transform: 'translateX(0px) rotate(0deg)', opacity: 0.1 },
                  '50%': { transform: 'translateX(20px) rotate(-180deg)', opacity: 0.15 }
                },
                '@keyframes float2': {
                  '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: 0.1 },
                  '50%': { transform: 'translateY(-15px) translateX(15px)', opacity: 0.2 }
                },
                '@keyframes float3': {
                  '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 0.1 },
                  '50%': { transform: 'scale(1.1) rotate(90deg)', opacity: 0.15 }
                },
                '@keyframes float4': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0.1 },
                  '50%': { transform: 'translateY(25px) rotate(-90deg)', opacity: 0.2 }
                },
                '@keyframes float5': {
                  '0%, 100%': { transform: 'translateX(0px) scale(1)', opacity: 0.1 },
                  '50%': { transform: 'translateX(-20px) scale(1.2)', opacity: 0.15 }
                }
              }}
            />
          ))}
        </Box>
      </Container>
    );
  };
  export default StudentMenu;