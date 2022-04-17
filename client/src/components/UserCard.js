import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <Stack
      className="user-card"
      direction="row"
      spacing={2}
      sx={{ py: 1 }}
      onClick={() => navigate(`/${item.id}/${item.firstName} ${item.lastName}`)}
    >
      <Avatar
        src={`https://avatars.dicebear.com/api/initials/${item.firstName} ${item.lastName}.svg`}
        sx={{ width: "32px", height: "32px" }}
      />
      <Typography variant="subtitle2">
        {item.firstName} {item.lastName}
      </Typography>
    </Stack>
  );
};

export default UserCard;
