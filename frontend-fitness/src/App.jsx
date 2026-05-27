import { Box, Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActivitiesPage = () => {
  return (
    <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
      <ActivityForm onActivitiesAdded={() => window.location.reload()} />
      <ActivityList />
    </Box>
  );
};

const App = () => {
  const { token, tokenData, logIn, logOut, isAuthenticated } =
    useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(
        setCredentials({
          token,
          user: tokenData,
        }),
      );
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Button variant="contained" color="secondary" onClick={() => logIn()}>
          Login
        </Button>
      ) : (
        <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/activities" replace />
                ) : (
                  <div>Please login.</div>
                )
              }
            />
          </Routes>
        </Box>
      )}
    </Router>
  );
};

export default App;
