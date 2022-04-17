import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import UserCard from "../components/UserCard";
import LogoutIcon from "@mui/icons-material/Logout";
import { QUERY_ALL_USERS } from "../graphql/queries";
import { useQuery } from "@apollo/client";

const SideBar = ({ setLoggedIn }) => {
  const { loading, error, data, refetch } = useQuery(QUERY_ALL_USERS);

  if (loading) {
    return <Typography variant="h6">Loading chats</Typography>;
  }

  if (data) {
    console.log(data);
  }

  if (error) {
    console.log(error);
  }

  return (
    <Box backgroundColor="#f7f7f7" height="100vh" width="250px" padding="10px">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Chat</Typography>
        <LogoutIcon
          onClick={() => {
            setLoggedIn(false);
          }}
        />
      </Stack>
      <Divider />
      {data.users.map((user) => (
        <UserCard key={user.id} item={user} />
      ))}
    </Box>
  );
};

export default SideBar;
