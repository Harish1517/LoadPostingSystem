import Link from "next/link";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="home-container">
      {user ? (
        <h1>Hi {user.name} 👋</h1>
      ) : (
        <>
          <h1>Load Posting System 🚚</h1>
          <p>A Platform for Shippers & Truckers</p>

          <div className="btn-group">
            <Link href="/login">
              <button>Login</button>
            </Link>
            <Link href="/register">
              <button>Register</button>
            </Link>
          </div>
        </>
      )}

      <style jsx>{`
        .home-container {
          text-align: center;
          margin-top: 100px;
        }

        h1 {
          font-size: 40px;
          font-weight: bold;
        }

        p {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .btn-group button {
          margin: 10px;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Home;
