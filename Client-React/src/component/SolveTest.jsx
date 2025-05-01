import axios from "axios";

const SolveTest = () => {
  const deleteTest = async () => {
    try {
      const response = await axios.delete('http://localhost:8080/Test/deleteTest/מבחן מתכונת', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("response:", response);
      alert("המבחן נמחק בהצלחה!");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("שגיאה במחיקת המבחן, אנא נסה שוב מאוחר יותר.");

      console.log(`הייתה שגיאה במחיקת המבחן: ${error.response ? error.response.data : error.message}`);
      console.log("Error details:", error.response);
     console.log( JSON.parse(atob(localStorage.getItem('token').split('.')[1])))
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <button onClick={deleteTest}>מחק מבחן</button>
    </div>
  );
};

export default SolveTest;
