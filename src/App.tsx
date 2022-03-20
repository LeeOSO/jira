import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuthenticatedApp } from "./authenticated-app";

function App() {
  return (
    <div className="App">
      {/*<ProjectListScreen/>*/}
      {/*<LoginScreen />*/}
      <AuthenticatedApp />
    </div>
  );
}

export default App;
