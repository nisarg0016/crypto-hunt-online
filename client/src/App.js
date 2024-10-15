import {useState, useContext} from 'react'
import LoginWithGoogle from "./pages/Authentication/LoginWithGoogle";
import CTFMainPage from './CTFmain';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext';

function App() {
  const {userDetails } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (userDetails === null) {
      return <Navigate to="/" />
    }

    return children;
  }

  const ProtectedRouteLogin = ({ children }) => {
    if (userDetails === null) {
      return children;
    }

    return <Navigate to="/ctfmain" />
  };
  
  return (
      <Routes>
        <Route path="*" element={<h1>404</h1>}/>
        <Route path="/" element={<ProtectedRouteLogin><LoginWithGoogle /></ProtectedRouteLogin>}>
        </Route>
        <Route path="/ctfmain" element={<ProtectedRoute><CTFMainPage/></ProtectedRoute>} />
      </Routes>
  );
}

export default App;
