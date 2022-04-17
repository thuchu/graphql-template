import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { LOGIN_USER, SIGNUP_USER } from "../graphql/mutations";

const AuthScreen = ({ setLoggedIn }) => {
  const [signupUser, { data: signupData, loading: l1, error: e1 }] =
    useMutation(SIGNUP_USER);

  const [loginUser, { data: loginData, loading: l2, error: e2 }] = useMutation(
    LOGIN_USER,
    {
      onCompleted(data) {
        console.log(data);
        localStorage.setItem("jwt", data.signinUser.token);
        setLoggedIn(true);
      },
    }
  );
  const [formData, setFormData] = React.useState({});
  const [showLogin, setShowLogin] = React.useState(true);
  const authFrom = React.createRef(null);

  // if (loginData) {

  if (l1 || l2) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="h6">LoadingAuthentication...</Typography>
      </Box>
    );
  }

  const onChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (showLogin) {
      loginUser({
        variables: {
          userSignin: formData,
        },
      });
    } else {
      signupUser({
        variables: {
          newUser: formData,
        },
      });
    }
    console.log(formData);
  };

  return (
    <Box
      ref={authFrom}
      component="form"
      onSubmit={onSubmitHandler}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card variant="outlined" sx={{ padding: "10px" }}>
        <Stack spacing={2} sx={{ width: "400px" }} direction="column">
          {signupData && (
            <Alert severity="success">
              {signupData.signupUser.firstName} Signed Up
            </Alert>
          )}
          {e1 && <Alert severity="error">{e1.message}</Alert>}
          {e2 && <Alert severity="error">{e2.message}</Alert>}

          <Typography variant="h5">
            Please {showLogin ? "Login" : "Signup"}
          </Typography>
          {!showLogin && (
            <>
              <TextField
                name="firstName"
                label="First Name"
                variant="standard"
                onChange={onChangeHandler}
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="standard"
                onChange={onChangeHandler}
                required
              />
            </>
          )}

          <TextField
            type="email"
            name="email"
            label="Email"
            variant="standard"
            onChange={onChangeHandler}
            required
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            variant="standard"
            onChange={onChangeHandler}
            required
          />
          <Typography
            textAlign="center"
            variant="subtitle1"
            onClick={() => {
              setFormData({});
              setShowLogin(!showLogin);
              authFrom.current.reset();
            }}
          >
            {showLogin ? "Signup?" : "Login"}
          </Typography>
          <Button variant="outlined" type="submit">
            Submit
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AuthScreen;
