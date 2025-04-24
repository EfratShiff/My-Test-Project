import { createSlice } from '@reduxjs/toolkit';
const initVal = {
  TestArr: [
    {
      TestName: "", // שם מבחן
      LastDate: "", // תאריך אחרון להגשה
      LimitTest: "", // כמות זמן למבחן
      questions: [{ question: "", answers: [""], correct: 0, timeLimit: 30 }] // שאלות
    }
  ]
};

const TestSlice = createSlice({
  name: "Test",
  initialState: initVal,
  reducers: {
    addTest: (state, action) => {
      const { TestName, LastDate, LimitTest, questions } = action.payload;
      // אם לא נמסרו שאלות, נשתמש בערך ברירת מחדל
      const newTest = {TestName, LastDate,LimitTest,questions: questions || 
        [{ question: "", answers: [""], correct: 0, timeLimit: 30 }]
      };
      state.TestArr.push(newTest);
    }
  }
});

//update
export const { addTest } = TestSlice.actions;
export default TestSlice.reducer;
