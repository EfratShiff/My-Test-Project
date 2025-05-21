// import { Button } from "@mui/material";
// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <>
//   <Button color="inherit" component={Link} to="/Login" sx={{ fontSize: 18 }}>
//             להרשמה/התחברות
//           </Button>
//   </>
//   );
// }
// export default Home;



import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [symbols, setSymbols] = useState([]);
  
  // יוצר סמל מתמטי אקראי
  const createSymbol = () => {
    // רשימת סמלים, מספרים ואותיות
    const mathItems = [
      // מספרים
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      // סמלים מתמטיים
      "π", "∑", "∫", "√", "∞", "+", "-", "×", "÷", "=", "<", ">",
      // אותיות יווניות
      "α", "β", "Δ", "λ", "μ", "φ", "Ω", "γ", "θ", "σ",
      // אותיות באנגלית
      "A", "B", "C", "x", "y", "z", "f", "n", "i", "j",
      // סמלים נוספים
      "∂", "∇", "∀", "∃", "∈", "∉", "⊂", "⊃", "∪", "∩", "≠", "≈"
    ];
    
    // מסלול תנועה
    const pattern = Math.floor(Math.random() * 3); // 0: אנכי, 1: אופקי, 2: אלכסוני
    
    return {
      id: Math.random().toString(36),
      value: mathItems[Math.floor(Math.random() * mathItems.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 24 + 12,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 1.5 + 0.5, // מהירות מתונה יותר
      direction: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.5 ? '#ffffff' : '#3b82f6', // לבן או כחול באופן אקראי
      pattern: pattern, // מסלול התנועה
      angle: pattern === 2 ? (Math.random() * 60 + 15) * (Math.random() > 0.5 ? 1 : -1) : 0 // זווית לתנועה אלכסונית
    };
  };
  
  // אתחול הסמלים בטעינה
  useEffect(() => {
    const initialSymbols = Array(50).fill().map(() => createSymbol());
    setSymbols(initialSymbols);
    
    // אנימציה ועדכון מיקום הסמלים
    const interval = setInterval(() => {
      setSymbols(prevSymbols => 
        prevSymbols.map(symbol => {
          let newX = symbol.x;
          let newY = symbol.y;
          
          // עדכון מיקום בהתאם לדפוס התנועה
          switch(symbol.pattern) {
            case 0: // תנועה אנכית
              newY += symbol.speed * symbol.direction * 0.1;
              if (newY > 100) newY = 0;
              if (newY < 0) newY = 100;
              break;
            case 1: // תנועה אופקית
              newX += symbol.speed * symbol.direction * 0.1;
              if (newX > 100) newX = 0;
              if (newX < 0) newX = 100;
              break;
            case 2: // תנועה אלכסונית
              const radian = symbol.angle * (Math.PI / 180);
              newX += Math.cos(radian) * symbol.speed * 0.1;
              newY += Math.sin(radian) * symbol.speed * 0.1;
              
              // טיפול בגבולות המסך
              if (newX > 100) newX = 0;
              if (newX < 0) newX = 100;
              if (newY > 100) newY = 0;
              if (newY < 0) newY = 100;
              break;
          }
          
          return {
            ...symbol,
            x: newX,
            y: newY
          };
        })
      );
    }, 50);
    
    // ניקוי
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      {/* שכבת הרקע עם האנימציה */}
      <div style={styles.backgroundLayer}>
        {symbols.map(symbol => (
          <div
            key={symbol.id}
            style={{
              ...styles.symbol,
              left: `${symbol.x}%`,
              top: `${symbol.y}%`,
              fontSize: `${symbol.size}px`,
              opacity: symbol.opacity,
              color: symbol.color, // שימוש בצבע האקראי (לבן או כחול)
            }}
          >
            {symbol.value}
          </div>
        ))}
      </div>
      
      {/* תוכן מרכזי */}
      <div style={styles.contentBox}>
        <h1 style={styles.heading}>ברוכים הבאים</h1>
        <p style={styles.paragraph}>הכלי החכם למבחן המושלם</p>
        
        <Link to="/Login" style={styles.button}>
          להרשמה/התחברות
        </Link>
      </div>
    </div>
  );
};

// סגנונות מוגדרים באופן ישיר בקובץ (ללא תלות ב-Tailwind)
const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#1a202c',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    zIndex: 0,
    userSelect: 'none',
  },
  symbol: {
    position: 'absolute',
    textShadow: '0 0 8px rgba(0, 100, 255, 0.6)',
  },
  contentBox: {
    zIndex: 10,
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    maxWidth: '80%',
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#000000',
  },
  paragraph: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: '#000000',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.25rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
    display: 'inline-block'
  }
};

export default Home;