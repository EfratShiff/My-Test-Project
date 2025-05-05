


  import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addTest } from "../store/TestSlice";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Card,
  CardContent,
  Stack
} from "@mui/material";

const CreateTest = () => {
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      TestName: "",
      LastDate: "",
      LimitTest: "",
      questions: [
        {
          text: "",
          answers: ["", "", "", ""],
          correct: 0,
          timeLimit: 30,
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        text: "",
        answers: ["", "", "", ""],
        correct: 0,
        timeLimit: 30,
      });
    }
  }, [append, fields.length]);

  const onSubmit = async (data) => {
    const testData = {
      title: data.TestName,
      questions: data.questions.map((question) => ({
        questionText: question.text,
        options: question.answers,
        correctAnswer: question.answers[question.correct],
      })),
      teacherId: "67e529e2364706b1db3763dc",
      timeLimit: parseInt(data.LimitTest),
    };
    alert(JSON.stringify(testData, null, 2));
    try {
      const response = await axios.post('http://localhost:8080/Test/createTest', testData);
      console.log("Test created:", response.data);
      dispatch(addTest(response.data));
      alert("המבחן נוצר בהצלחה!");
    } catch (error) {
      console.error("Error creating test:", error);
      alert(`הייתה שגיאה ביצירת המבחן: ${error.response ? error.response.data : error.message}`);
    }
  };

  const addQuestion = () => {
    append({
      text: "",
      answers: ["", "", "", ""],
      correct: 0,
      timeLimit: 30,
    });
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        יצירת מבחן
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="שם מבחן"
            {...register("TestName", { required: true })}
            error={!!errors.TestName}
            helperText={errors.TestName && "שדה חובה"}
          />

          <TextField
            label="תאריך אחרון להגשה"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            {...register("LastDate", { required: true })}
            error={!!errors.LastDate}
            helperText={errors.LastDate && "שדה חובה"}
          />

          <TextField
            label="כמות זמן למבחן (בדקות)"
            type="number"
            {...register("LimitTest", { required: true })}
            error={!!errors.LimitTest}
            helperText={errors.LimitTest && "שדה חובה"}
          />

          <Typography variant="h5" mt={4}>
            שאלות
          </Typography>

          {fields.map((field, index) => (
            <Card key={field.id} variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label={`שאלה ${index + 1}`}
                    {...register(`questions.${index}.text`, { required: true })}
                    error={!!errors.questions?.[index]?.text}
                    helperText={errors.questions?.[index]?.text && "שדה חובה"}
                  />

                  {Array(4)
                    .fill(0)
                    .map((_, ansIndex) => (
                      <TextField
                        key={ansIndex}
                        label={`תשובה ${ansIndex + 1}`}
                        {...register(`questions.${index}.answers.${ansIndex}`, { required: true })}
                        error={!!errors.questions?.[index]?.answers?.[ansIndex]}
                        helperText={errors.questions?.[index]?.answers?.[ansIndex] && "שדה חובה"}
                      />
                    ))}

                  <TextField
                    select
                    label="בחר תשובה נכונה"
                    defaultValue={field.correct}
                    {...register(`questions.${index}.correct`, { required: true })}
                  >
                    {[0, 1, 2, 3].map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        תשובה {opt + 1}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="הגבלת זמן לשאלה (שניות)"
                    type="number"
                    {...register(`questions.${index}.timeLimit`, { required: true })}
                    error={!!errors.questions?.[index]?.timeLimit}
                    helperText={errors.questions?.[index]?.timeLimit && "שדה חובה"}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}

          <Button variant="outlined" onClick={addQuestion}>
            הוסף שאלה +
          </Button>

          <Button type="submit" variant="contained" color="primary">
            שמור מבחן
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateTest;
