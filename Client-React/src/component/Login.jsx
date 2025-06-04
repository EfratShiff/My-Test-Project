import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserName } from '../store/UserSlice';
import { Box, Container, TextField, Button, Typography, Paper, Grid, Divider, Alert,IconButton, 
    InputAdornment, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle} from '@mui/material';
import {Visibility, VisibilityOff, School, LockOutlined, ErrorOutline, AdminPanelSettings} from '@mui/icons-material';
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [dialogState, setDialogState] = useState({
        forgotPassword: false,
        tempPassword: false,
        changePassword: false
    });
    const [tempPasswordEmail, setTempPasswordEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const mainForm = useForm();
    const adminForm = useForm();
    const forgotForm = useForm();
    const tempForm = useForm();
    const setUserData = (data, email) => {
        const { token, role, name } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
        dispatch(setUserName(name));
    };
    const navigateByRole = (role) => {
        const routes = {
            manager: '/ManagerMenu',
            student: '/StudentMenu',
            teacher: '/TeacherMenu'
        };
        navigate(routes[role] || '/');
    };
    const resetErrors = () => {
        setPasswordError("");
        setUserNotFound(false);
        setShowAdminLogin(false);
    };
    const updateDialog = (type, value) => {
        setDialogState(prev => ({ ...prev, [type]: value }));
    };
    const onLoginSubmit = async (data) => {
        try {
            resetErrors();
            const res = await axios.post('http://localhost:8080/User/getUser', data);
            if (res.data.token) {
                setUserData(res.data, data.email);
                navigateByRole(res.data.role);
            }
        } catch (err) {
            const message = err.response?.data?.error;
            if (message === "Invalid password") {
                setPasswordError("הסיסמה שגויה, נסה שוב.");
                mainForm.setValue("password", "");
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
            if (res.data.token) {
                setUserData(res.data, data.adminUseremail);
                navigate('/ManagerMenu');
            }
        } catch (err) {
            alert("שגיאה בכניסת מנהל: " + (err.response?.data?.error || "בעיה כללית"));
        }
    };
    const sendTempPassword = async (data) => {
        try {
            await axios.post('http://localhost:8080/Email/forgot-password', { email: data.forgotEmail });
            setTempPasswordEmail(data.forgotEmail);
            updateDialog('forgotPassword', false);
            updateDialog('tempPassword', true);
        } catch (err) {
            alert("שגיאה בשליחת סיסמה זמנית: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };
    const verifyTempPassword = async (data) => {
        try {
            const res = await axios.post('http://localhost:8080/Email/verify-temp-password', {
                email: tempPasswordEmail,
                tempPassword: data.tempPassword
            });
            if (res.data.success) {
                setUserData(res.data, res.data.email);
                updateDialog('tempPassword', false);
                updateDialog('changePassword', true);
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
            await axios.post('http://localhost:8080/Email/change-password', {
                email: tempPasswordEmail,
                newPassword: newPassword
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert("הסיסמה שונתה בהצלחה!");
            updateDialog('changePassword', false);
            setTempPasswordEmail("");
            setNewPassword("");
            setConfirmNewPassword("");
            navigateByRole(localStorage.getItem('role'));
        } catch (err) {
            alert("שגיאה בשינוי הסיסמה: " + (err.response?.data?.error || "שגיאה כללית"));
        }
    };
    const renderPasswordField = (name, label, register, errors, form) => (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id={name}
            name={name}
            label={label}
            type={showPassword ? 'text' : 'password'}
            error={!!errors[name] || (name === 'password' && !!passwordError)}
            helperText={
                errors[name] ? "יש להזין סיסמה" :
                    name === 'password' && passwordError ? passwordError : ""
            }
            {...register(name, { required: true })}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
    return (
        <Container component="main" maxWidth="sm" dir="rtl">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%' }}>
                    {!showAdminLogin ? (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <School sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                                    כניסה למערכת ניהול מבחנים
                                </Typography>
                            </Box>
                            <form onSubmit={mainForm.handleSubmit(onLoginSubmit)}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="אימייל"
                                    error={!!mainForm.formState.errors.email}
                                    helperText={mainForm.formState.errors.email ? "יש להזין אימייל" : ""}
                                    {...mainForm.register("email", { required: true })}
                                />
                                {renderPasswordField("password", "סיסמה", mainForm.register, mainForm.formState.errors, mainForm)}
                                {userNotFound && (
                                    <Alert severity="error" icon={<ErrorOutline />} sx={{ mt: 2, mb: 2 }}>
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
                                            onClick={() => updateDialog('forgotPassword', true)}
                                        >
                                            שכחתי סיסמה
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                            {userNotFound && (
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
                            <form onSubmit={adminForm.handleSubmit(onAdminLoginSubmit)}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="adminUseremail"
                                    name="adminUseremail"
                                    label="אימייל מנהל"
                                    error={!!adminForm.formState.errors.adminUseremail}
                                    helperText={adminForm.formState.errors.adminUseremail ? "יש להזין אימייל" : ""}
                                    {...adminForm.register("adminUseremail", { required: true })}
                                />
                                {renderPasswordField("adminPassword", "סיסמת מנהל", adminForm.register, adminForm.formState.errors, adminForm)}
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={6}>
                                        <Button fullWidth variant="outlined" onClick={() => setShowAdminLogin(false)}>
                                            חזרה
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button type="submit" fullWidth variant="contained" color="secondary">
                                            כניסה כמנהל
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </>
                    )}
                </Paper>
            </Box>
            <Dialog open={dialogState.forgotPassword} onClose={() => updateDialog('forgotPassword', false)}>
                <DialogTitle>איפוס סיסמה</DialogTitle>
                <form onSubmit={forgotForm.handleSubmit(sendTempPassword)}>
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
                            defaultValue={mainForm.watch("email") || ""}
                            error={!!forgotForm.formState.errors.forgotEmail}
                            helperText={forgotForm.formState.errors.forgotEmail ? "יש להזין אימייל" : ""}
                            {...forgotForm.register("forgotEmail", { required: true })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => updateDialog('forgotPassword', false)}>ביטול</Button>
                        <Button type="submit" variant="contained" color="primary">
                            שלח סיסמה זמנית
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={dialogState.tempPassword} onClose={() => {
                updateDialog('tempPassword', false);
                setTempPasswordEmail("");
            }}>
                <DialogTitle>אימות סיסמה זמנית</DialogTitle>
                <form onSubmit={tempForm.handleSubmit(verifyTempPassword)}>
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
                            error={!!tempForm.formState.errors.tempPassword}
                            helperText={tempForm.formState.errors.tempPassword ? "יש להזין סיסמה זמנית" : ""}
                            {...tempForm.register("tempPassword", { required: true })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            updateDialog('tempPassword', false);
                            setTempPasswordEmail("");
                        }}>ביטול</Button>
                        <Button onClick={() => {
                            updateDialog('tempPassword', false);
                            updateDialog('forgotPassword', true);
                        }}>שלח סיסמה חדשה</Button>
                        <Button type="submit" variant="contained" color="primary">
                            אמת סיסמה
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={dialogState.changePassword} onClose={() => updateDialog('changePassword', false)}>
                <DialogTitle>שינוי סיסמה</DialogTitle>
                <DialogContent>
                    <DialogContentText>אנא הזן סיסמה חדשה</DialogContentText>
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
                    <Button onClick={() => updateDialog('changePassword', false)}>ביטול</Button>
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