import React from "react";
import "./App.css";
import HomeScreen from "./pages/HomeScreen";
import AuthScreen from "./pages/AuthScreen";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(
    localStorage.getItem("jwt") ? true : false
  );

  return (
    <>
      {loggedIn ? (
        <HomeScreen setLoggedIn={setLoggedIn} />
      ) : (
        <AuthScreen setLoggedIn={setLoggedIn} />
      )}
    </>
  );
}

export default App;
