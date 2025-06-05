import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addTest } from "../store/TestSlice";
import { logout } from "../store/UserSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {Box, Button, TextField, Typography, MenuItem,
  Card, CardContent, Stack, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

const CreateTest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const sigCanvasRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const { register, control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      TestName: "",
      LastDate: "",
      LimitTest: "",
      questions: [
        { text: "", answers: ["", "", "", ""], correct: 0, timeLimit: 30 },
      ],
    },
  });

  const { fields, append } = useFieldArray({ control, name: "questions" });

  useEffect(() => {
    if (fields.length === 0) {
      append({ text: "", answers: ["", "", "", ""], correct: 0, timeLimit: 30 });
    }
  }, [append, fields.length]);

  const handleSignatureSave = async () => {
    try {
      const trimmedCanvas = sigCanvasRef.current.getTrimmedCanvas();
      const signatureImage = trimmedCanvas.toDataURL("image/png");
      console.log("חתימה דיגיטלית:", signatureImage);

      const data = getValues();
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      const testData = {
        title: data.TestName,
        lastDate: data.LastDate,
        questions: data.questions.map((q) => ({
          questionText: q.text,
          options: q.answers,
          correctAnswer: q.answers[q.correct],
          timeLimit: parseInt(q.timeLimit),
        })),
        teacherId: decoded.userId,
        signature: signatureImage,
      };

      const response = await axios.post("http://localhost:8080/Test/createTest", testData);
      dispatch(addTest(response.data));
      alert("המבחן נוצר בהצלחה!");
      navigate("/TeacherMenu");
    } catch (error) {
      console.error("שגיאה:", error);
      alert(`שגיאה ביצירת המבחן: ${error?.response?.data || error.message}`);
    } finally {
      setOpenSignatureDialog(false);
    }
  };

  const addQuestion = () => {
    append({ text: "", answers: ["", "", "", ""], correct: 0, timeLimit: 30 });
  };

  const handleTestSubmit = () => {
    setOpenSignatureDialog(true);
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, pl: 6 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            py: 1.5,
            px: 4,
            borderRadius: '8px',
            textTransform: 'none',
            letterSpacing: '0.5px',
            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
            boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
              boxShadow: '0 4px 8px 3px rgba(244, 67, 54, .4)'
            }
          }}
        >
          LogOut
        </Button>
      </Box>
      <Typography variant="h4" align="center" gutterBottom>
        יצירת מבחן
      </Typography>
      <form onSubmit={handleSubmit(handleTestSubmit)}>
        <Stack spacing={2}>
          <TextField label="שם מבחן" {...register("TestName", { required: true })} error={!!errors.TestName} helperText={errors.TestName && "שדה חובה"} />
          <TextField label="תאריך אחרון להגשה" type="datetime-local" InputLabelProps={{ shrink: true }} {...register("LastDate", { required: true })} error={!!errors.LastDate} helperText={errors.LastDate && "שדה חובה"} />
          <Typography variant="h5" mt={4}>שאלות</Typography>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <TextField label={`שאלה ${index + 1}`} {...register(`questions.${index}.text`, { required: true })} error={!!errors.questions?.[index]?.text} helperText={errors.questions?.[index]?.text && "שדה חובה"} />
                  {[0, 1, 2, 3].map((ansIndex) => (
                    <TextField key={ansIndex} label={`תשובה ${ansIndex + 1}`} {...register(`questions.${index}.answers.${ansIndex}`, { required: true })} error={!!errors.questions?.[index]?.answers?.[ansIndex]} helperText={errors.questions?.[index]?.answers?.[ansIndex] && "שדה חובה"} />
                  ))}
                  <TextField select label="בחר תשובה נכונה" defaultValue={field.correct} {...register(`questions.${index}.correct`, { required: true })}>
                    {[0, 1, 2, 3].map((opt) => (
                      <MenuItem key={opt} value={opt}>תשובה {opt + 1}</MenuItem>
                    ))}
                  </TextField>
                  <TextField label="הגבלת זמן לשאלה (שניות)" type="number" {...register(`questions.${index}.timeLimit`, { required: true })} error={!!errors.questions?.[index]?.timeLimit} helperText={errors.questions?.[index]?.timeLimit && "שדה חובה"} />
                </Stack>
              </CardContent>
            </Card>
          ))}
          <Button variant="outlined" onClick={addQuestion}>הוסף שאלה +</Button>
          <Button type="submit" variant="contained" color="primary">שמור מבחן</Button>
        </Stack>
      </form>

      {/* 🔽 חלונית חתימה */}
      <Dialog open={openSignatureDialog} onClose={() => setOpenSignatureDialog(false)}>
        <DialogTitle>חתום על המבחן</DialogTitle>
        <DialogContent>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSignatureSave}>
              שמור חתימה ושלח מבחן
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CreateTest;
