// // import React, { useState } from "react";
// // import {
// //   Button, Typography,

// //   Container,
// //   Paper,
// //   Grid,
// //   TextField,
// //   Box,
// //   Card,
// //   CardContent,
// //   CardActions,
// //   Divider,
// //   FormControl,
// //   FormHelperText,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   AppBar,
// //   Toolbar,
// //   IconButton,
// //   CircularProgress
// // } from "@mui/material";
// // import {
// //   Person as PersonIcon,
// //   School as SchoolIcon,
// //   Delete as DeleteIcon,
// //   Add as AddIcon,
// //   Assessment as AssessmentIcon,
// //   People as PeopleIcon,
// //   ArrowBack as ArrowBackIcon
// // } from "@mui/icons-material";
// // import axios from "axios";
// // import { useForm } from "react-hook-form";
// // import { Link } from "react-router-dom";

// // const ManagerMenu = () => {
// //   const [actionType, setActionType] = useState("");
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [showUsers, setShowUsers] = useState(false);
// //   const [deleteEmail, setDeleteEmail] = useState("");
// //   const [deletePassword, setDeletePassword] = useState("");

// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     setValue,
// //     getValues,
// //     formState: { errors }
// //   } = useForm();

// //   const fetchAllUsers = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");
// //       const response = await axios.get('http://localhost:8080/User/getAllUsers', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       setUsers(response.data);
// //       setShowUsers(true);
// //     } catch (error) {
// //       console.error("Error fetching users:", error);
// //       alert("שגיאה בטעינת המשתמשים");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const onSubmit = async (data) => {
// //     console.log("Form submitted with data:", data);
// //     const token = localStorage.getItem("token");
// //     try {
// //       if (actionType.startsWith("add")) {
// //         const role = actionType === "add-teacher" ? "teacher" : "student";
// //         console.log("מנסה להוסיף משתמש:", { ...data, role });

// //         // בדיקת תקינות הנתונים
// //         if (!data.name || !data.email || !data.password) {
// //           throw new Error("כל השדות הם שדות חובה");
// //         }

// //         if (data.password.length < 6) {
// //           throw new Error("הסיסמה חייבת להכיל לפחות 6 תווים");
// //         }

// //         if (!data.email.includes('@')) {
// //           throw new Error("כתובת אימייל לא תקינה");
// //         }

// //         data.role = role;
// //         console.log("שולח לשרת:", data);

// //         const response = await axios.post('http://localhost:8080/User/createUser', data, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         });

// //         console.log("תגובה מהשרת:", response.data);

// //         if (response.data) {
// //           alert(`המשתמש בתפקיד ${role} נוסף בהצלחה`);
// //           reset();
// //           setActionType("");
// //           // Refresh users list after adding new user
// //           fetchAllUsers();
// //         }
// //       }
// //       else if (actionType.startsWith("delete")) {
// //         const role = actionType === "delete-teacher" ? "teacher" : "student";
// //         const formData = getValues();
// //         console.log("Form data before delete:", formData);
// //         console.log("Email from form:", formData.email);
// //         console.log("Password from form:", formData.password);

// //         try {
// //           // וידוא שהאימייל והסיסמה קיימים
// //           if (!formData.email || !formData.password) {
// //             throw new Error("חסרים פרמטרים נדרשים");
// //           }

// //           const response = await axios.delete('http://localhost:8080/User/deleteUser', {
// //             data: {
// //               email: formData.email,
// //               password: formData.password
// //             },
// //             headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
          
// //           console.log("Delete response:", response.data);
// //           alert(`המשתמש בתפקיד ${role} נמחק בהצלחה`);
// //           // Refresh users list after deleting user
// //           fetchAllUsers();
// //           reset();
// //           setActionType("");
// //         } catch (error) {
// //           console.error("Error details:", {
// //             message: error.message,
// //             response: error.response?.data,
// //             status: error.response?.status,
// //             formData: formData
// //           });

// //           if (error.response) {
// //             alert(`שגיאה במחיקת המשתמש: ${error.response.data.message || 'שגיאה לא ידועה'}`);
// //           } else {
// //             alert("שגיאה במחיקת המשתמש. אנא נסה שוב מאוחר יותר.");
// //           }
// //         }
// //       }
// //     } catch (err) {
// //       console.error("פרטי השגיאה:", {
// //         message: err.message,
// //         response: err.response?.data,
// //         status: err.response?.status
// //       });

// //       if (err.response) {
// //         // השגיאה הגיעה מהשרת
// //         alert("שגיאה בהוספת המשתמש: " + (err.response.data.message || err.response.data.error || "שגיאה כללית"));
// //       } else if (err.request) {
// //         // הבקשה נשלחה אבל לא התקבלה תשובה
// //         alert("לא התקבלה תשובה מהשרת. אנא נסה שוב מאוחר יותר.");
// //       } else {
// //         // שגיאה אחרת
// //         alert("שגיאה בהוספת המשתמש: " + err.message);
// //       }
// //     }
// //   };

// //   const handleDelete = async (e) => {
// //     e.preventDefault();
// //     console.log("Delete attempt with:", {
// //       email: deleteEmail,
// //       password: deletePassword,
// //       actionType: actionType
// //     });

// //     if (!deleteEmail || !deletePassword) {
// //       alert("נא למלא את כל השדות");
// //       return;
// //     }

// //     try {
// //       const url = `http://localhost:8080/User/deleteUser/${encodeURIComponent(deleteEmail)}/${encodeURIComponent(deletePassword)}`;
// //       console.log("Sending delete request to:", url);

// //       const response = await axios.delete(url, {
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });

// //       console.log("Delete response:", response.data);
// //       alert(`המשתמש נמחק בהצלחה`);
// //       fetchAllUsers();
// //       setDeleteEmail("");
// //       setDeletePassword("");
// //       setActionType("");
// //     } catch (error) {
// //       console.error("Error details:", {
// //         message: error.message,
// //         response: error.response?.data,
// //         status: error.response?.status,
// //         url: error.config?.url,
// //         data: error.config?.data
// //       });

// //       if (error.response) {
// //         alert(`שגיאה במחיקת המשתמש: ${error.response.data.message || 'שגיאה לא ידועה'}`);
// //       } else {
// //         alert("שגיאה במחיקת המשתמש. אנא נסה שוב מאוחר יותר.");
// //       }
// //     }
// //   };

// //   const showForm = !!actionType;

// //   return (
// //     <Box sx={{ flexGrow: 1, direction: "rtl" }}>
// //       <AppBar position="static" color="primary" sx={{ mb: 4 }}>
// //         <Toolbar>
// //           <IconButton edge="start" color="inherit" aria-label="back" component={Link} to="/" sx={{ mr: 2 }}>
// //             <ArrowBackIcon />
// //           </IconButton>
// //           <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
// //             ברוך הבא מנהל
// //           </Typography>
// //         </Toolbar>
// //       </AppBar>

// //       <Container maxWidth="lg">
// //         <Grid container spacing={4}>
// //           <Grid item xs={12} md={6}>
// //             <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
// //               <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
// //                 ניהול משתמשים
// //               </Typography>
// //               <Grid container spacing={2}>
// //                 <Grid item xs={12} sm={6}>
// //                   <Button
// //                     variant="contained"
// //                     color="primary"
// //                     fullWidth
// //                     startIcon={<AddIcon />}
// //                     endIcon={<PersonIcon />}
// //                     onClick={() => setActionType("add-teacher")}
// //                     sx={{ py: 1.5 }}
// //                   >
// //                     הוספת מורה
// //                   </Button>
// //                 </Grid>
// //                 <Grid item xs={12} sm={6}>
// //                   <Button
// //                     variant="contained"
// //                     color="primary"
// //                     fullWidth
// //                     startIcon={<AddIcon />}
// //                     endIcon={<SchoolIcon />}
// //                     onClick={() => setActionType("add-student")}
// //                     sx={{ py: 1.5 }}
// //                   >
// //                     הוספת תלמידה
// //                   </Button>
// //                 </Grid>
// //                 <Grid item xs={12} sm={6}>
// //                   <Button
// //                     variant="outlined"
// //                     color="error"
// //                     fullWidth
// //                     startIcon={<DeleteIcon />}
// //                     endIcon={<PersonIcon />}
// //                     onClick={() => setActionType("delete-teacher")}
// //                     sx={{ py: 1.5 }}
// //                   >
// //                     מחיקת מורה
// //                   </Button>
// //                 </Grid>
// //                 <Grid item xs={12} sm={6}>
// //                   <Button
// //                     variant="outlined"
// //                     color="error"
// //                     fullWidth
// //                     startIcon={<DeleteIcon />}
// //                     endIcon={<SchoolIcon />}
// //                     onClick={() => setActionType("delete-student")}
// //                     sx={{ py: 1.5 }}
// //                   >
// //                     מחיקת תלמידה
// //                   </Button>
// //                 </Grid>
// //               </Grid>
// //             </Paper>

// //             <Paper elevation={3} sx={{ p: 3 }}>
// //               <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
// //                 צפייה במידע
// //               </Typography>
// //               <Grid container spacing={2}>
// //                 <Grid item xs={12} sm={6}>
// //                   <Button
// //                     variant="contained"
// //                     color="secondary"
// //                     fullWidth
// //                     startIcon={<AssessmentIcon />}
// //                     component={Link}
// //                     to="/exams"
// //                     sx={{ py: 1.5 }}
// //                   >
// //                     צפייה במבחנים
// //                   </Button>
// //                 </Grid>
// //                 <Grid item xs={12} sm={6}>
// //                   <Button
// //                     variant="contained"
// //                     color="secondary"
// //                     fullWidth
// //                     startIcon={<PeopleIcon />}
// //                     onClick={fetchAllUsers}
// //                     sx={{ py: 1.5 }}
// //                   >
// //                     צפייה בכל המשתמשים
// //                   </Button>
// //                 </Grid>
// //               </Grid>
// //             </Paper>
// //           </Grid>

// //           <Grid item xs={12} md={6}>
// //             {showForm && (
// //               <Card elevation={3}>
// //                 <CardContent>
// //                   <Typography variant="h6" gutterBottom align="center">
// //                     {actionType.includes("add") ? "הוספת" : "מחיקת"}{" "}
// //                     {actionType.includes("teacher") ? "מורה" : "תלמידה"}
// //                   </Typography>
// //                   <Divider sx={{ mb: 3 }} />

// //                   {actionType.includes("delete") ? (
// //                     <form onSubmit={handleDelete}>
// //                       <Grid container spacing={3}>
// //                         <Grid item xs={12}>
// //                           <TextField
// //                             fullWidth
// //                             label="אימייל"
// //                             variant="outlined"
// //                             type="email"
// //                             value={deleteEmail}
// //                             onChange={(e) => {
// //                               console.log("Email changed to:", e.target.value);
// //                               setDeleteEmail(e.target.value);
// //                             }}
// //                             required
// //                           />
// //                         </Grid>

// //                         <Grid item xs={12}>
// //                           <TextField
// //                             fullWidth
// //                             label="סיסמה"
// //                             variant="outlined"
// //                             type="password"
// //                             value={deletePassword}
// //                             onChange={(e) => {
// //                               console.log("Password changed to:", e.target.value);
// //                               setDeletePassword(e.target.value);
// //                             }}
// //                             required
// //                           />
// //                         </Grid>

// //                         <Grid item xs={12} sx={{ mt: 2 }}>
// //                           <Button
// //                             type="submit"
// //                             variant="contained"
// //                             color="error"
// //                             fullWidth
// //                             size="large"
// //                           >
// //                             מחק
// //                           </Button>
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                           <Button
// //                             variant="outlined"
// //                             fullWidth
// //                             onClick={() => {
// //                               setDeleteEmail("");
// //                               setDeletePassword("");
// //                               setActionType("");
// //                             }}
// //                           >
// //                             ביטול
// //                           </Button>
// //                         </Grid>
// //                       </Grid>
// //                     </form>
// //                   ) : (
// //                     <form onSubmit={handleSubmit(onSubmit)}>
// //                       <Grid container spacing={3}>
// //                         <Grid item xs={12}>
// //                           <TextField
// //                             fullWidth
// //                             label="שם"
// //                             variant="outlined"
// //                             type="text"
// //                             {...register("name", {
// //                               required: "שדה חובה"
// //                             })}
// //                             error={!!errors.name}
// //                             helperText={errors.name?.message}
// //                           />
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                           <TextField
// //                             fullWidth
// //                             label="אימייל"
// //                             variant="outlined"
// //                             type="email"
// //                             {...register("email", {
// //                               required: "שדה חובה",
// //                               pattern: {
// //                                 value: /^\S+@\S+\.\S+$/,
// //                                 message: "אימייל לא תקין"
// //                               }
// //                             })}
// //                             error={!!errors.email}
// //                             helperText={errors.email?.message}
// //                           />
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                           <TextField
// //                             fullWidth
// //                             label="סיסמה"
// //                             variant="outlined"
// //                             type="password"
// //                             {...register("password", {
// //                               required: "שדה חובה",
// //                               minLength: {
// //                                 value: 6,
// //                                 message: "הסיסמה חייבת להכיל לפחות 6 תווים",
// //                               },
// //                             })}
// //                             error={!!errors.password}
// //                             helperText={errors.password?.message}
// //                           />

// //                         </Grid>

// //                         <Grid item xs={12} sx={{ mt: 2 }}>
// //                           <Button
// //                             type="submit"
// //                             variant="contained"
// //                             color={actionType.includes("add") ? "primary" : "error"}
// //                             fullWidth
// //                             size="large"
// //                           >
// //                             {actionType.includes("add") ? "הוסף" : "מחק"}
// //                           </Button>
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                           <Button
// //                             variant="outlined"
// //                             fullWidth
// //                             onClick={() => {
// //                               reset();
// //                               setActionType("");
// //                             }}
// //                           >
// //                             ביטול
// //                           </Button>
// //                         </Grid>
// //                       </Grid>
// //                     </form>
// //                   )}
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {loading && (
// //               <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
// //                 <CircularProgress />
// //               </Box>
// //             )}

// //             {showUsers && !loading && (
// //               <Paper sx={{ mt: showForm ? 4 : 0, p: 2 }}>
// //                 <Typography variant="h6" gutterBottom>
// //                   רשימת משתמשים:
// //                 </Typography>
// //                 <TableContainer>
// //                   <Table>
// //                     <TableHead>
// //                       <TableRow>
// //                         <TableCell>שם</TableCell>
// //                         <TableCell>אימייל</TableCell>
// //                         <TableCell>תפקיד</TableCell>
// //                       </TableRow>
// //                     </TableHead>
// //                     <TableBody>
// //                       {users.map((user, index) => (
// //                         <TableRow key={index}>
// //                           <TableCell>{user.name}</TableCell>
// //                           <TableCell>{user.email}</TableCell>
// //                           <TableCell>{user.role}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </TableContainer>
// //               </Paper>
// //             )}
// //           </Grid>
// //         </Grid>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default ManagerMenu;




// import React, { useState } from "react";
// import {
//   Button,
//   Typography,
//   Container,
//   Paper,
//   Grid,
//   TextField,
//   Box,
//   Card,
//   CardContent,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   AppBar,
//   Toolbar,
//   IconButton,
//   CircularProgress
// } from "@mui/material";
// import {
//   Person as PersonIcon,
//   School as SchoolIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Assessment as AssessmentIcon,
//   People as PeopleIcon,
//   ArrowBack as ArrowBackIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";

// const ManagerMenu = () => {
//   const [actionType, setActionType] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showUsers, setShowUsers] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm();

//   const fetchAllUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get('http://localhost:8080/User/getAllUsers', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setUsers(response.data);
//       setShowUsers(true);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       alert("שגיאה בטעינת המשתמשים");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data) => {
//     const token = localStorage.getItem("token");
//     try {
//       if (actionType.startsWith("add")) {
//         const role = actionType === "add-teacher" ? "teacher" : "student";
//         data.role = role;
        
//         // וידוא תקינות הנתונים רק בעת הוספת משתמש
//         if (!data.name || !data.email || !data.password) {
//           throw new Error("כל השדות הם שדות חובה");
//         }

//         if (data.password.length < 6) {
//           throw new Error("הסיסמה חייבת להכיל לפחות 6 תווים");
//         }

//         if (!data.email.includes('@')) {
//           throw new Error("כתובת אימייל לא תקינה");
//         }
        
//         await axios.post('http://localhost:8080/User/createUser', data, {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         alert(`המשתמש בתפקיד ${role} נוסף בהצלחה`);
//         fetchAllUsers(); // רענון רשימת המשתמשים לאחר הוספה
//       }
//       else if (actionType.startsWith("delete")) {
//         const role = actionType === "delete-teacher" ? "teacher" : "student";
        
//         // בעת מחיקה אין צורך בולידציה מעבר לכך שהשדות הוזנו
//         if (!data.email || !data.password) {
//           throw new Error("יש להזין אימייל וסיסמה כדי למחוק משתמש");
//         }
        
//         // מחיקה לפי אימייל וסיסמה
//         await axios.delete(`http://localhost:8080/User/deleteUser/${data.email}/${data.password}`);
        
//         alert(`המשתמש בתפקיד ${role} נמחק בהצלחה`);
//         fetchAllUsers(); // רענון רשימת המשתמשים לאחר מחיקה
//       }
//       reset();
//       setActionType("");
//     } catch (err) {
//       console.error("Error details:", err);
      
//       if (err.response) {
//         alert("שגיאה: " + (err.response.data.message || err.response.data.error || "שגיאה כללית"));
//       } else if (err.request) {
//         alert("לא התקבלה תשובה מהשרת. אנא נסה שוב מאוחר יותר.");
//       } else {
//         alert("שגיאה: " + err.message);
//       }
//     }
//   };

//   // הגדר אפשרויות ולידציה שונות בהתאם לסוג הפעולה
//   const getValidationOptions = (field) => {
//     // אם זו הוספת משתמש - נפעיל את כל הולידציות
//     if (actionType.startsWith("add")) {
//       switch (field) {
//         case "name":
//           return {
//             required: "שדה חובה"
//           };
//         case "email":
//           return {
//             required: "שדה חובה",
//             pattern: {
//               value: /^\S+@\S+\.\S+$/,
//               message: "אימייל לא תקין"
//             }
//           };
//         case "password":
//           return {
//             required: "שדה חובה",
//             minLength: {
//               value: 6,
//               message: "הסיסמה חייבת להכיל לפחות 6 תווים"
//             }
//           };
//         default:
//           return {};
//       }
//     } 
//     // אם זו מחיקת משתמש - רק נוודא שהשדות הוזנו, ללא ולידציה נוספת
//     else {
//       return {
//         required: "שדה חובה"
//       };
//     }
//   };

//   const showForm = !!actionType;

//   return (
//     <Box sx={{ flexGrow: 1, direction: "rtl" }}>
//       <AppBar position="static" color="primary" sx={{ mb: 4 }}>
//         <Toolbar>
//           <IconButton edge="start" color="inherit" aria-label="back" component={Link} to="/" sx={{ mr: 2 }}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
//             ברוך הבא מנהל
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="lg">
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={6}>
//             <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
//               <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
//                 ניהול משתמשים
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     startIcon={<AddIcon />}
//                     endIcon={<PersonIcon />}
//                     onClick={() => setActionType("add-teacher")}
//                     sx={{ py: 1.5 }}
//                   >
//                     הוספת מורה
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     startIcon={<AddIcon />}
//                     endIcon={<SchoolIcon />}
//                     onClick={() => setActionType("add-student")}
//                     sx={{ py: 1.5 }}
//                   >
//                     הוספת תלמידה
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     fullWidth
//                     startIcon={<DeleteIcon />}
//                     endIcon={<PersonIcon />}
//                     onClick={() => setActionType("delete-teacher")}
//                     sx={{ py: 1.5 }}
//                   >
//                     מחיקת מורה
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     fullWidth
//                     startIcon={<DeleteIcon />}
//                     endIcon={<SchoolIcon />}
//                     onClick={() => setActionType("delete-student")}
//                     sx={{ py: 1.5 }}
//                   >
//                     מחיקת תלמידה
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>

//             <Paper elevation={3} sx={{ p: 3 }}>
//               <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
//                 צפייה במידע
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     fullWidth
//                     startIcon={<AssessmentIcon />}
//                     component={Link}
//                     to="/ViewTests"
//                     sx={{ py: 1.5 }}
//                   >
//                     צפייה במבחנים
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     fullWidth
//                     startIcon={<PeopleIcon />}
//                     onClick={fetchAllUsers}
//                     sx={{ py: 1.5 }}
//                   >
//                     צפייה בכל המשתמשים
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             {showForm && (
//               <Card elevation={3}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom align="center">
//                     {actionType.includes("add") ? "הוספת" : "מחיקת"}{" "}
//                     {actionType.includes("teacher") ? "מורה" : "תלמידה"}
//                   </Typography>
//                   <Divider sx={{ mb: 3 }} />

//                   <form onSubmit={handleSubmit(onSubmit)}>
//                     <Grid container spacing={3}>
//                       {actionType.includes("add") && (
//                         <Grid item xs={12}>
//                           <TextField
//                             fullWidth
//                             label="שם"
//                             variant="outlined"
//                             {...register("name", getValidationOptions("name"))}
//                             error={!!errors.name}
//                             helperText={errors.name?.message}
//                           />
//                         </Grid>
//                       )}
                      
//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="אימייל"
//                           variant="outlined"
//                           type="text" // שינוי מ-email ל-text כדי למנוע ולידציה מובנית של הדפדפן
//                           {...register("email", getValidationOptions("email"))}
//                           error={!!errors.email}
//                           helperText={errors.email?.message}
//                         />
//                       </Grid>
                      
//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="סיסמה"
//                           variant="outlined"
//                           type="password"
//                           {...register("password", getValidationOptions("password"))}
//                           error={!!errors.password}
//                           helperText={errors.password?.message}
//                         />
//                       </Grid>

//                       <Grid item xs={12} sx={{ mt: 2 }}>
//                         <Button
//                           type="submit"
//                           variant="contained"
//                           color={actionType.includes("add") ? "primary" : "error"}
//                           fullWidth
//                           size="large"
//                         >
//                           {actionType.includes("add") ? "הוסף" : "מחק"}
//                         </Button>
//                       </Grid>
//                       <Grid item xs={12}>
//                         <Button
//                           variant="outlined"
//                           fullWidth
//                           onClick={() => {
//                             reset();
//                             setActionType("");
//                           }}
//                         >
//                           ביטול
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </form>
//                 </CardContent>
//               </Card>
//             )}

//             {loading && (
//               <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                 <CircularProgress />
//               </Box>
//             )}

//             {showUsers && !loading && (
//               <Paper sx={{ mt: showForm ? 4 : 0, p: 2 }}>
//                 <Typography variant="h6" gutterBottom>
//                   רשימת משתמשים:
//                 </Typography>
//                 <TableContainer>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>שם</TableCell>
//                         <TableCell>אימייל</TableCell>
//                         <TableCell>תפקיד</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {users.map((user, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{user.name}</TableCell>
//                           <TableCell>{user.email}</TableCell>
//                           <TableCell>{user.role}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Paper>
//             )}
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default ManagerMenu;



import React, { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Box,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const ManagerMenu = () => {
  const [actionType, setActionType] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:8080/User/getAllUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
      setShowUsers(true);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("שגיאה בטעינת המשתמשים");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    try {
      if (actionType.startsWith("add")) {
        const role = actionType === "add-teacher" ? "teacher" : "student";
        data.role = role;
        
        // וידוא תקינות הנתונים רק בעת הוספת משתמש
        if (!data.name || !data.email || !data.password) {
          throw new Error("כל השדות הם שדות חובה");
        }

        if (data.password.length < 6) {
          throw new Error("הסיסמה חייבת להכיל לפחות 6 תווים");
        }

        if (!data.email.includes('@')) {
          throw new Error("כתובת אימייל לא תקינה");
        }
        
        await axios.post('http://localhost:8080/User/createUser', data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        alert(`המשתמש בתפקיד ${role} נוסף בהצלחה`);
        fetchAllUsers(); // רענון רשימת המשתמשים לאחר הוספה
      }
      else if (actionType === "delete-user") {
        // בעת מחיקה אין צורך בולידציה מעבר לכך שהשדות הוזנו
        if (!data.email || !data.password) {
          throw new Error("יש להזין אימייל וסיסמה כדי למחוק משתמש");
        }
        
        // מחיקה לפי אימייל וסיסמה
        await axios.delete("http://localhost:8080/User/deleteUser", {
  data: {
    email: data.email,
    password: data.password
  }
});

        alert(`המשתמש נמחק בהצלחה`);
        fetchAllUsers(); // רענון רשימת המשתמשים לאחר מחיקה
      }
      reset();
      setActionType("");
    } catch (err) {
      console.error("Error details:", err);
      
      if (err.response) {
        alert("שגיאה: " + (err.response.data.message || err.response.data.error || "שגיאה כללית"));
      } else if (err.request) {
        alert("לא התקבלה תשובה מהשרת. אנא נסה שוב מאוחר יותר.");
      } else {
        alert("שגיאה: " + err.message);
      }
    }
  };

  // הגדר אפשרויות ולידציה שונות בהתאם לסוג הפעולה
  const getValidationOptions = (field) => {
    // אם זו הוספת משתמש - נפעיל את כל הולידציות
    if (actionType.startsWith("add")) {
      switch (field) {
        case "name":
          return {
            required: "שדה חובה"
          };
        case "email":
          return {
            required: "שדה חובה",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "אימייל לא תקין"
            }
          };
        case "password":
          return {
            required: "שדה חובה",
            minLength: {
              value: 6,
              message: "הסיסמה חייבת להכיל לפחות 6 תווים"
            }
          };
        default:
          return {};
      }
    } 
    // אם זו מחיקת משתמש - רק נוודא שהשדות הוזנו, ללא ולידציה נוספת
    else {
      return {
        required: "שדה חובה"
      };
    }
  };

  const showForm = !!actionType;

  return (
    <Box sx={{ flexGrow: 1, direction: "rtl" }}>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" component={Link} to="/" sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            ברוך הבא מנהל
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                ניהול משתמשים
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<AddIcon />}
                    endIcon={<PersonIcon />}
                    onClick={() => setActionType("add-teacher")}
                    sx={{ py: 1.5 }}
                  >
                    הוספת מורה
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<AddIcon />}
                    endIcon={<SchoolIcon />}
                    onClick={() => setActionType("add-student")}
                    sx={{ py: 1.5 }}
                  >
                    הוספת תלמידה
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={() => setActionType("delete-user")}
                    sx={{ py: 1.5 }}
                  >
                    מחיקת משתמש
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                צפייה במידע
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<AssessmentIcon />}
                    component={Link}
                    to="/ViewTests"
                    sx={{ py: 1.5 }}
                  >
                    צפייה במבחנים
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<PeopleIcon />}
                    onClick={fetchAllUsers}
                    sx={{ py: 1.5 }}
                  >
                    צפייה בכל המשתמשים
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            {showForm && (
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    {actionType.includes("add") ? "הוספת" : "מחיקת"}{" "}
                    {actionType === "add-teacher" ? "מורה" : 
                     actionType === "add-student" ? "תלמידה" : "משתמש"}
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                      {actionType.includes("add") && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="שם"
                            variant="outlined"
                            {...register("name", getValidationOptions("name"))}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        </Grid>
                      )}
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="אימייל"
                          variant="outlined"
                          type="text" // שינוי מ-email ל-text כדי למנוע ולידציה מובנית של הדפדפן
                          {...register("email", getValidationOptions("email"))}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="סיסמה"
                          variant="outlined"
                          type="password"
                          {...register("password", getValidationOptions("password"))}
                          error={!!errors.password}
                          helperText={errors.password?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color={actionType.includes("add") ? "primary" : "error"}
                          fullWidth
                          size="large"
                        >
                          {actionType.includes("add") ? "הוסף" : "מחק"}
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => {
                            reset();
                            setActionType("");
                          }}
                        >
                          ביטול
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            )}

            {showUsers && !loading && (
              <Paper sx={{ mt: showForm ? 4 : 0, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  רשימת משתמשים:
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>שם</TableCell>
                        <TableCell>אימייל</TableCell>
                        <TableCell>תפקיד</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ManagerMenu;