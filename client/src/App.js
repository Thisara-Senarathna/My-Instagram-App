//App.js
import "./App.css";
import Navbar from "./components/navbar";
import Approutes from "./routes/routes";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext";

function App() {
  return (
    <>
      
      <BrowserRouter>
      <UserProvider>
        <Navbar />
        <Approutes />
      </UserProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
