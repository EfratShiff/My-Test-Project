import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTest } from "../store/TestSlice";
import axios from "axios";

const CreateTest = () => {
  const dispatch = useDispatch();
  const Test = useSelector((state) => state.TestSlice);

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
    append({
      text: "",
      answers: ["", "", "", ""],
      correct: 0,
      timeLimit: 30,
    });
  }, [append]);

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));

    dispatch(
      addTest({
        TestName: data.TestName, // שם מבחן
        LastDate: data.LastDate, // תאריך אחרון להגשה
        LimitTest: data.LimitTest, // כמות זמן למבחן
        questions: data.questions.map((question) => ({
          question: question.text,  // השאלה
          answers: question.answers, // התשובות
          correct: question.correct, // אינדקס התשובה הנכונה
          timeLimit: question.timeLimit, // זמן למענה על השאלה
        })),
      })
    );
  };

  const addQuestion = () => {
    append({
      text: "",
      answers: ["", "", "", ""],
      correct: 0,
      timeLimit: 30,
    });
  };

  return (<>
    <h1>hiiiiiiiiiiiii</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("TestName", { required: true })}
        placeholder="שם מבחן"
      />
      {errors.TestName && <span>שדה חובה</span>}
      <br />

      <label>תאריך אחרון להגשה</label>
      <br />
      <input
        {...register("LastDate", { required: true })}
        type="datetime-local"
      />
      {errors.LastDate && <span>שדה חובה</span>}
      <br />

      <input
        {...register("LimitTest", { required: true })}
        placeholder="כמות זמן למבחן"
      />
      {errors.LimitTest && <span>שדה חובה</span>}
      <br />

      <h3>שאלות</h3>
      {fields.map((field, index) => (
        <div
          key={field.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <input
            {...register(`questions.${index}.text`, { required: true })}
            placeholder={`שאלה ${index + 1}`}
          />
          <br />
          {Array(4)
            .fill(0)
            .map((_, ansIndex) => (
              <div key={ansIndex}>
                <input
                  {...register(
                    `questions.${index}.answers.${ansIndex}`,
                    { required: true }
                  )}
                  placeholder={`תשובה ${ansIndex + 1}`}
                />
                <br />
              </div>
            ))}
          <label>בחר תשובה נכונה</label>
          <select
            {...register(`questions.${index}.correct`, { required: true })}
            defaultValue={field.correct}
          >
            <option value={0}>תשובה 1</option>
            <option value={1}>תשובה 2</option>
            <option value={2}>תשובה 3</option>
            <option value={3}>תשובה 4</option>
          </select>
          <br />

          <input
            type="number"
            {...register(`questions.${index}.timeLimit`, { required: true })}
            placeholder="הגבלת זמן לשאלה (שניות)"
          />
          <br />
        </div>
      ))}

      <button type="button" onClick={addQuestion}>
        הוסף שאלה +
      </button>
      <br />
      <br />
      <input type="submit" value="שמור מבחן" />
    </form>
    </>
  );
};

export default CreateTest;
