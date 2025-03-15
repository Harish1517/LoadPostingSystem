import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "../context/UserContext";
import Navbar from "../components/Navbar";
import "../styles/index.css"

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/css/bootstrap.min.css");
  }, []); // Ensures Bootstrap loads after hydration

  return (
    <UserProvider>
      <Navbar />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
