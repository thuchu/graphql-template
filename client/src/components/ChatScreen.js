import {
  AppBar,
  Avatar,
  Box,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import MessageCard from "./MessageCard";
import { QUERY_GET_MESSENGER } from "../graphql/queries";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import SendIcon from "@mui/icons-material/Send";
import { SEND_MESSAGE } from "../graphql/mutations";
import { SUBSCRIPTION_MESSAGE_CREATED } from "../graphql/subscriptions";

const ChatScreen = () => {
  const { id, name } = useParams();
  const [messages, setMessages] = React.useState([]);
  const { loading, data, error } = useQuery(QUERY_GET_MESSENGER, {
    variables: { receiverId: +id },
    onCompleted: (data) => {
      setMessages(data.messageByUser);
    },
  });
  const [text, setText] = React.useState("");

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    // variables: {
    //   receiverId: +id,
    //   message: text,
    // },
    onCompleted: (data) => {
      setMessages([...messages, data.createMessage]);
      setText("");
    },
  });

  const { data: subData } = useSubscription(SUBSCRIPTION_MESSAGE_CREATED, {
    onSubscriptionData({ subscriptionData: {data} }) {
      setMessages([...messages, data.messageAdded]);
    },
  });

  if (error) {
    console.log(error);
  }

  // Using fetch
  // const getAllMessages = () => {
  //   fetch("http://localhost:4000/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization:
  //         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY0OTkyNTI5N30.zUOW5Lzg6RMeTN0_gfCHPgj8rkA7bYFTJK07BIiGnnc",
  //     },
  //     body: JSON.stringify({
  //       query: `
  //       query MessageByUser($receiverId: Int!) {
  //         messageByUser(receiverId: $receiverId) {
  //           id
  //           text
  //           receiverId
  //           senderId
  //           createdAt
  //         }
  //       }`,
  //       variables: {
  //         receiverId: 2,
  //       },
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //     });
  // };

  React.useEffect(() => {
    // getAllMessages();
  }, []);

  return (
    <Box flexGrow={1} sx={{ backgroundColor: "white", boxShadow: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Avatar
            src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
            sx={{ width: "32px", height: "32px" }}
          />
          <Typography variant="h6">{name}</Typography>
        </Toolbar>
      </AppBar>
      <Box
        backgroundColor="#f5f5f5"
        height="80vh"
        padding="10px"
        sx={{ overflow: "auto" }}
      >
        {loading ? (
          <Typography variant="h6">Loading chats</Typography>
        ) : (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              text={message.text}
              date={message.createdAt}
              isRight={message.receiverId == +id}
            />
          ))
        )}
      </Box>
      <Stack direction={"row"}>
        <TextField
          name="message"
          placeholder="Enter your message"
          variant="standard"
          fullWidth
          multiline
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />
        <SendIcon
          fontSize="large"
          onClick={() =>
            // instead of using the mutation, we can use the fetch method
            sendMessage({
              variables: {
                receiverId: +id,
                message: text,
              },
            })
          }
        />
      </Stack>
    </Box>
  );
};

export default ChatScreen;
