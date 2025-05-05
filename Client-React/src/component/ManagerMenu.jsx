import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ManagerMenu = () => {
    return(
        <>
        ברוך הבא מנהל <br />
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: 18 }}>
            הוספת מורה
          </Button>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: 18 }}>
            הוספת תלמידה
          </Button>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: 18 }}>
            מחיקת מורה
          </Button>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: 18 }}>
            מחיקת תלמידה
          </Button>
        </>
    )
}
export default ManagerMenu;