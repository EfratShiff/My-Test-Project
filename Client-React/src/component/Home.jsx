import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
  <Button color="inherit" component={Link} to="/Login" sx={{ fontSize: 18 }}>
            להרשמה/התחברות
          </Button>
  </>
  );
}
export default Home;