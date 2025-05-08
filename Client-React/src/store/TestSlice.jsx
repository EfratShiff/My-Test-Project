import { createSlice } from '@reduxjs/toolkit';
const initVal = {
  TestArr: [
    {
      TestName: "", 
      LastDate: "", 
      LimitTest: "", 
      questions: [{ question: "", answers: [""], correct: 0, timeLimit: 30 }]
    }
  ]
};

const TestSlice = createSlice({
  name: "Test",
  initialState: initVal,
  reducers: {
    addTest: (state, action) => {
      const { TestName, LastDate, LimitTest, questions} = action.payload;
      const newTest = {TestName, LastDate,LimitTest,questions: questions || 
        [{ question: "", answers: [""], correct: 0, timeLimit: 30 }]
      };
      state.TestArr.push(newTest);
    }
  }
});


export const { addTest } = TestSlice.actions;
export default TestSlice.reducer;
