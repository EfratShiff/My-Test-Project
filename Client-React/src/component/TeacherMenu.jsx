import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const TeacherMenu = () => {
    return(
        <>
        TeacherMenu
        <Button color="inherit" component={Link} to="/CreateTest" sx={{ fontSize: 18 }}>
        ליצירת מבחן
          </Button>
          <Button color="inherit" component={Link} to="/ViewTests" sx={{ fontSize: 18 }}>
         לצפיה במבחנים
          </Button>
          {/* <Button color="inherit" component={Link} to="/ViewTests" sx={{ fontSize: 18 }}>
         לצפיה בתוצאות המבחנים
          </Button> */}
        </>
    )
}
    export default TeacherMenu;