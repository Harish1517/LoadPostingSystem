import { useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../components/Home";
import UserContext from "../context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
const IndexPage = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      
      
      {/* Show Home only if user is NOT logged in */}
      <Home />

      <Footer />
    </>
  );
};

export default IndexPage;
