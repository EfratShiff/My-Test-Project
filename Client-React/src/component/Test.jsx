import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

const Test = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    // ... existing useEffect and other functions ...

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            
            // בדיקה אם יש תשובות ריקות
            const unansweredQuestions = test.questions.filter((q, index) => !answers[index]);
            if (unansweredQuestions.length > 0) {
                const confirmSubmit = window.confirm(
                    `יש לך ${unansweredQuestions.length} שאלות שלא ענית עליהן. האם אתה בטוח שברצונך להגיש את המבחן?`
                );
                if (!confirmSubmit) return;
            }

            // הצגת הדיאלוג לשאלת המייל
            setShowEmailDialog(true);
        } catch (error) {
            console.error('Error submitting test:', error);
            alert('שגיאה בשליחת המבחן');
        }
    };

    const handleEmailDialogResponse = async (sendEmail) => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            
            const result = {
                testId: test._id,
                answers: answers,
                sendEmail: sendEmail
            };

            await axios.post('http://localhost:8080/Result/createResult', result, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowEmailDialog(false);
            alert('המבחן נשלח בהצלחה!');
            navigate('/ViewRezultTest');
        } catch (error) {
            console.error('Error submitting test:', error);
            alert('שגיאה בשליחת המבחן');
        }
    };

    // ... rest of the component code ...

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* ... existing test UI ... */}

            {/* Email Dialog */}
            <Dialog
                open={showEmailDialog}
                onClose={() => setShowEmailDialog(false)}
            >
                <DialogTitle>שליחת תוצאות למייל</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        האם תרצה לקבל את תוצאות המבחן למייל שלך?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEmailDialogResponse(false)} color="primary">
                        לא, תודה
                    </Button>
                    <Button onClick={() => handleEmailDialogResponse(true)} color="primary" variant="contained">
                        כן, שלח לי למייל
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Test; 