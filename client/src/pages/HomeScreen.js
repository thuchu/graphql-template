import React from "react";
import { Box, Stack, Typography, Button, TextField, Card } from "@mui/material";
import SideBar from "../components/SideBar";
import { Route, Routes } from "react-router-dom";
import Welcome from "../components/Welcome";
import ChatScreen from "../components/ChatScreen";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />}></Route>
      <Route path="/:id/:name" element={<ChatScreen />}></Route>
    </Routes>
  );
};

export default class HomeScreen extends React.Component {
  render() {
    return (
      <Box display="flex">
        <SideBar setLoggedIn={this.props.setLoggedIn}/>
        <AllRoutes />
      </Box>
    );
  }
}
