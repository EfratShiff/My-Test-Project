import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/forgotPassword", { email });
      setMessage(res.data.message);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("שגיאה בשליחת הבקשה");
      }
    }
  };

  return (
    <div>
      <h2>שכחתי סיסמה</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="הכנס כתובת מייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">שלח סיסמה זמנית</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
    