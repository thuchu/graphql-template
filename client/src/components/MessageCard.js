import { Typography, Box } from "@mui/material";
import React from "react";

const MessageCard = ({ text, date, isRight }) => {
  return (
    <Box display="flex" justifyContent={`${isRight && 'end'}`}>
      <Box>
        <Typography variant="subtitle2" backgroundColor="white" padding="5px">
          {text}
        </Typography>
        <Typography variant="caption">{new Date(date).toLocaleTimeString()}</Typography>
      </Box>
    </Box>
  );
};
export default MessageCard;
