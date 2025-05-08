import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const StudentMenu = () => {
    return(
        <>
        StudentMenu


        <Button color="inherit" component={Link} to="/ViewTests" sx={{ fontSize: 18 }}>
              לפתרון מבחן
          </Button> 
        <Button color="inherit" component={Link} to="/ViewTests" sx={{ fontSize: 18 }}>
            לצפיה בתוצאות המבחנים
          </Button>
        </>
    )
}
    export default StudentMenu;