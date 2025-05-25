import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Alert, 
  IconButton, 
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  School, 
  LockOutlined,
  ErrorOutline,
  AdminPanelSettings
} from '@mui/icons-material';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [showTempPasswordInput, setShowTempPasswordInput] = useState(false);
    const [tempPasswordEmail, setTempPasswordEmail] = useState("");
    const [email, setEmail] = useState(""); 
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm();

    const {
        register: registerAdmin,
        handleSubmit: handleAdminSubmit,
        formState: { errors: adminErrors }
    } = useForm();

    const {
        register: registerNewUser,
        handleSubmit: handleAddUser,
        reset: resetAddUser,
        formState: { errors: addUserErrors }
    } = useForm();

    const {
        register: registerDeleteUser,
        handleSubmit: handleDeleteUser,
        reset: resetDeleteUser
    } = useForm();

    const {
        register: registerForgotPassword,
        handleSubmit: handleForgotPasswordSubmit,
        formState: { errors: forgotPasswordErrors }
    } = useForm();

    const {
        register: registerTempPassword,
        handleSubmit: handleTempPasswordSubmit,
        formState: { errors: tempPasswordErrors }
    } = useForm();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        if (token && role === 'manager') {
            setIsManager(true);
        }
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onLoginSubmit = async (data) => {
        try {
            setPasswordError("");
            setUserNotFound(false);
            setShowAdminLogin(false);
            const res = await axios.post('http://localhost:8080/User/getUser', data);
            const token = res.data.token;
            const role = res.data.role;
            const email = data.email; 
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('email', email);
                setEmail(email); 
                alert("התחברת בהצלחה!");

                if (role === 'manager') {
                    alert("ברוך הבא מנהל!");
                    setIsManager(true);
                    navigate('/ManagerMenu');
                } else if (role === 'student') {
                    alert("ברוך הבא תלמיד!");
                    navigate('/StudentMenu');
                }
                else if (role === 'teacher') {
                    alert("ברוך הבא מורה!");
                    navigate('/TeacherMenu');
                }
            }
        } catch (err) {
            const message = err.response?.data?.error;

            if (message === "Invalid password") {
                setPasswordError("הסיסמה שגויה, נסה שוב.");
                setValue("password", "");
            } else if (message === "User not found") {
                setUserNotFound(true);
            } else {
                alert("שגיאה: " + (message || "בעיה כללית"));
            }
        }
    };
    const onAdminLoginSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:8080/User/getUser', {
                name: "מנהל",
                email: data.adminUseremail,
                password: data.adminPassword,
                roleToCheck: "manager"
            });
            const token = res.data.token;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', 'manager');
                localStorage.setItem('email', email);
                setIsManager(true);
                alert("ברוך הבא מנהל!");
                navigate('/ManagerMenu');
            }
        } catch (err) {
            alert("שגיאה בכניסת מנהל: " + (err.response?.data?.error || "בעיה כללית"));
        }
    };
    const addUser = async (data) => {
        alert(JSON.stringify(data));
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/User/createUser', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("המשתמש נוסף בהצלחה");
            resetAddUser();
        } catch (err) {
            alert("שגיאה בהוספת המשתמש: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };

    const deleteUser = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/User/deleteUser/${data.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("המשתמש נמחק בהצלחה");
            resetDeleteUser();
        } catch (err) {
            alert("שגיאה במחיקת המשתמש: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setIsManager(false);
        navigate('/login');
    };

    const sendTempPasswordToEmail = async (data) => {
        console.log("sendTempPasswordToEmail called with:", data);
        try {
            const emailToSend = data.forgotEmail;
            console.log("Email to send:", emailToSend);
            const requestData = { email: emailToSend };
            console.log("Sending request:", requestData);
            const res = await axios.post('http://localhost:8080/User/forgot-password', requestData);
            console.log("Response received:", res.data);
            alert("סיסמה זמנית נשלחה למייל שלך. בדוק את הדוא\"ל והזן את הסיסמה הזמנית.");
            setTempPasswordEmail(emailToSend); 
            setShowForgotPassword(false);
            setShowTempPasswordInput(true); 
        } catch (err) {
            console.error("Error details:", err);
            console.error("Error response:", err.response);
            alert("שגיאה בשליחת סיסמה זמנית: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };
    const verifyTempPassword = async (data) => {
        try {
            const requestData = { 
                email: tempPasswordEmail,
                tempPassword: data.tempPassword 
            };
            const res = await axios.post('http://localhost:8080/User/verify-temp-password', requestData);
            
            if (res.data.success) {
                const token = res.data.token;
                const role = res.data.role;
                const email = res.data.email;
                
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('email', email);
                
                setShowTempPasswordInput(false);
                setShowChangePassword(true);
            }
        } catch (err) {
            alert("סיסמה זמנית שגויה או פגה תוקפה. נסה שוב או בקש סיסמה חדשה.");
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            alert("הסיסמאות החדשות אינן תואמות");
            return;
        }

        if (newPassword.length < 6) {
            alert("הסיסמה החדשה חייבת להכיל לפחות 6 תווים");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/User/change-password', {
                email: tempPasswordEmail,
                newPassword: newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("הסיסמה שונתה בהצלחה!");
            setShowChangePassword(false);
            setTempPasswordEmail("");
            setNewPassword("");
            setConfirmNewPassword("");
            
            // ניתוב למסך המתאים לפי התפקיד
            const role = localStorage.getItem('role');
            if (role === 'manager') {
                navigate('/ManagerMenu');
            } else if (role === 'student') {
                navigate('/StudentMenu');
            } else if (role === 'teacher') {
                navigate('/TeacherMenu');
            }
        } catch (err) {
            alert("שגיאה בשינוי הסיסמה: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };

    return (
        <Container component="main" maxWidth="sm" dir="rtl">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {!isManager ? (
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%' }}>
                        {!showAdminLogin ? (
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                    <School sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                                    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                                        כניסה למערכת ניהול מבחנים
                                    </Typography>
                                </Box>
                                
                                <form onSubmit={handleSubmit(onLoginSubmit)}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="אימייל"
                                        error={!!errors.email}
                                        helperText={errors.email ? "יש להזין אימייל" : ""}
                                        {...register("email", { required: true })}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="סיסמה"
                                        type={showPassword ? 'text' : 'password'}
                                        error={!!errors.password || !!passwordError}
                                        helperText={
                                            errors.password 
                                                ? "יש להזין סיסמה" 
                                                : passwordError 
                                                    ? passwordError 
                                                    : ""
                                        }
                                        {...register("password", { required: true })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {userNotFound && (
                                        <Alert 
                                            severity="error" 
                                            icon={<ErrorOutline />}
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            המשתמש אינו קיים במערכת
                                        </Alert>
                                    )}
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                sx={{ borderRadius: 2 }}
                                                startIcon={<LockOutlined />}
                                            >
                                                התחברות
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                variant="text"
                                                color="primary"
                                                onClick={() => {
                                                    console.log("Opening forgot password dialog");
                                                    setShowForgotPassword(true);
                                                }}
                                            >
                                                שכחתי סיסמה
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                                
                                {userNotFound && !showForgotPassword && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Divider sx={{ my: 2 }}>
                                            <Typography variant="body2" color="text.secondary">או</Typography>
                                        </Divider>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => setShowAdminLogin(true)}
                                            startIcon={<AdminPanelSettings />}
                                        >
                                            כניסה כמנהל
                                        </Button>
                                    </Box>
                                )}
                            </>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                    <AdminPanelSettings sx={{ fontSize: 50, color: 'secondary.main', mb: 1 }} />
                                    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                                        כניסת מנהל
                                    </Typography>
                                </Box>
                                
                                <form onSubmit={handleAdminSubmit(onAdminLoginSubmit)}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="adminUseremail"
                                        name="adminUseremail"
                                        label="אימייל מנהל"
                                        error={!!adminErrors.adminUseremail}
                                        helperText={adminErrors.adminUseremail ? "יש להזין אימייל" : ""}
                                        {...registerAdmin("adminUseremail", { required: true })}
                                    />
                                    
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="adminPassword"
                                        name="adminPassword"
                                        label="סיסמת מנהל"
                                        type={showPassword ? 'text' : 'password'}
                                        error={!!adminErrors.adminPassword}
                                        helperText={adminErrors.adminPassword ? "יש להזין סיסמה" : ""}
                                        {...registerAdmin("adminPassword", { required: true })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => setShowAdminLogin(false)}
                                            >
                                                חזרה
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="secondary"
                                            >
                                                כניסה כמנהל
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </>
                        )}
                    </Paper>
                ) : (
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <AdminPanelSettings sx={{ fontSize: 50, color: 'secondary.main', mb: 1 }} />
                            <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                                ממשק ניהול
                            </Typography>
                            
                            <Box sx={{ width: '100%', mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    הוספת משתמש חדש
                                </Typography>
                                <form onSubmit={handleAddUser(addUser)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="newUserName"
                                                name="name"
                                                label="שם מלא"
                                                variant="outlined"
                                                {...registerNewUser("name", { required: true })}
                                                error={!!addUserErrors.name}
                                                helperText={addUserErrors.name ? "נדרש שם" : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="newUserEmail"
                                                name="email"
                                                label="אימייל"
                                                variant="outlined"
                                                {...registerNewUser("email", { required: true })}
                                                error={!!addUserErrors.email}
                                                helperText={addUserErrors.email ? "נדרש אימייל" : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="newUserPassword"
                                                name="password"
                                                label="סיסמה"
                                                type="password"
                                                variant="outlined"
                                                {...registerNewUser("password", { required: true })}
                                                error={!!addUserErrors.password}
                                                helperText={addUserErrors.password ? "נדרשת סיסמה" : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth variant="outlined" error={!!addUserErrors.role}>
                                                <InputLabel id="role-select-label">תפקיד</InputLabel>
                                                <Select
                                                    labelId="role-select-label"
                                                    id="role-select"
                                                    label="תפקיד"
                                                    {...registerNewUser("role", { required: true })}
                                                    defaultValue=""
                                                >
                                                    <MenuItem value="student">תלמיד</MenuItem>
                                                    <MenuItem value="teacher">מורה</MenuItem>
                                                    <MenuItem value="manager">מנהל</MenuItem>
                                                </Select>
                                                {addUserErrors.role && <FormHelperText>יש לבחור תפקיד</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                            >
                                                הוסף משתמש
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>

                            <Divider sx={{ width: '100%', mb: 4 }} />
                            
                            <Box sx={{ width: '100%', mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    מחיקת משתמש
                                </Typography>
                                <form onSubmit={handleDeleteUser(deleteUser)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="deleteUserEmail"
                                                name="email"
                                                label="אימייל המשתמש למחיקה"
                                                variant="outlined"
                                                {...registerDeleteUser("email", { required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                            >
                                                מחק משתמש
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                            
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={logout}
                                fullWidth
                            >
                                התנתקות
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Box>
            <Dialog open={showForgotPassword} onClose={() => setShowForgotPassword(false)}>
                <DialogTitle>איפוס סיסמה</DialogTitle>
                <form onSubmit={handleForgotPasswordSubmit((data) => {
                    console.log("Forgot password form submitted with data:", data);
                    sendTempPasswordToEmail(data);
                })}>
                    <DialogContent>
                        <DialogContentText>
                            אנא הזן את כתובת האימייל שלך ונשלח לך סיסמה זמנית
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="forgotEmail"
                            name="forgotEmail"
                            label="אימייל"
                            type="email"
                            fullWidth
                            variant="outlined"
                            defaultValue={watch("email") || ""}
                            error={!!forgotPasswordErrors.forgotEmail}
                            helperText={forgotPasswordErrors.forgotEmail ? "יש להזין אימייל" : ""}
                            {...registerForgotPassword("forgotEmail", { required: true })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowForgotPassword(false)}>ביטול</Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            onClick={() => console.log("Send temp password button clicked!")}
                        >
                            שלח סיסמה זמנית
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={showTempPasswordInput} onClose={() => {
                setShowTempPasswordInput(false);
                setTempPasswordEmail("");
            }}>
                <DialogTitle>אימות סיסמה זמנית</DialogTitle>
                <form onSubmit={handleTempPasswordSubmit((data) => {
                    verifyTempPassword(data);
                })}>
                    <DialogContent>
                        <DialogContentText>
                            הזן את הסיסמה הזמנית שנשלחה אליך במייל: {tempPasswordEmail}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="tempPassword"
                            name="tempPassword"
                            label="סיסמה זמנית"
                            type="text"
                            fullWidth
                            variant="outlined"
                            error={!!tempPasswordErrors.tempPassword}
                            helperText={tempPasswordErrors.tempPassword ? "יש להזין סיסמה זמנית" : ""}
                            {...registerTempPassword("tempPassword", { required: true })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setShowTempPasswordInput(false);
                            setTempPasswordEmail("");
                        }}>ביטול</Button>
                        <Button onClick={() => {
                            setShowTempPasswordInput(false);
                            setShowForgotPassword(true);
                        }}>שלח סיסמה חדשה</Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                        >
                            אמת סיסמה
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={showChangePassword} onClose={() => setShowChangePassword(false)}>
                <DialogTitle>שינוי סיסמה</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        אנא הזן סיסמה חדשה
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="סיסמה חדשה"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={newPassword.length > 0 && newPassword.length < 6}
                        helperText={newPassword.length > 0 && newPassword.length < 6 ? "הסיסמה חייבת להכיל לפחות 6 תווים" : ""}
                    />
                    <TextField
                        margin="dense"
                        label="אימות סיסמה חדשה"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        error={confirmNewPassword.length > 0 && newPassword !== confirmNewPassword}
                        helperText={confirmNewPassword.length > 0 && newPassword !== confirmNewPassword ? "הסיסמאות אינן תואמות" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowChangePassword(false)}>ביטול</Button>
                    <Button 
                        onClick={handleChangePassword}
                        variant="contained" 
                        color="primary"
                        disabled={!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword || newPassword.length < 6}
                    >
                        שנה סיסמה
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
export default Login;

