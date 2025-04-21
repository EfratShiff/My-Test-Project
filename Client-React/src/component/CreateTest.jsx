import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";

const CreateTest = () => {
  useEffect(() => {
    append({
      question: "",
      answers: ["", "", "", ""],
      correct: 0,
      timeLimit: 30
    });
  }, []);

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
      questions: [],
    }
  });

  const { fields, append } = useFieldArray({
    control,
    name: "questions"
  });

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  const addQuestion = () => {
    append({
      text: "",
      answers: ["", "", "", ""],
      correct: 0,
      timeLimit: 30
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("TestName", { required: true })} placeholder="שם מבחן" />
        {errors.TestName && <span>שדה חובה</span>}<br/>

        <label>תאריך אחרון להגשה</label><br/>
        <input {...register("LastDate", { required: true })} type="datetime-local" />
        {errors.LastDate && <span>שדה חובה</span>}<br/>

        <input {...register("LimitTest", { required: true })} placeholder="כמות זמן למבחן" />
        {errors.LimitTest && <span>שדה חובה</span>}<br/>

        <h3>שאלות</h3>
        {fields.map((field, index) => (
          <div key={field.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <input
              {...register(`questions.${index}.text`, { required: true })}
              placeholder={`שאלה ${index + 1}`}
            /><br/>
            {Array(4).fill(0).map((_, ansIndex) => (
              <div key={ansIndex}>
                <input
                  {...register(`questions.${index}.answers.${ansIndex}`, { required: true })}
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
            /><br/>
          </div>
        ))}

        <button type="button" onClick={addQuestion}>הוסף שאלה +</button><br/><br/>
        <input type="submit" value="שמור מבחן" />
      </form>
    </>
  );
};

export default CreateTest;
