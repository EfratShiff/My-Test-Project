import { Button } from "@mui/material";
import { Box } from "lucide-react";
import { Link } from "react-router-dom";

const AppBar = () => {

return(
    <>
          <Button color="inherit" component={Link} to="/Login" sx={{ fontSize: 18 }}>
            להרשמה/התחברות
          </Button>
          <Button color="inherit" component={Link} to="/CreateTest" sx={{ fontSize: 18 }}>
           יצירת מבחן
          </Button>
          <Button color="inherit" component={Link} to="/SolveTest" sx={{ fontSize: 18 }}>
           לפתור מבחן
          </Button>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: 18 }}>
            בית
          </Button>
    </>
)
}
export default AppBar;