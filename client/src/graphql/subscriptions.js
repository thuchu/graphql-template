import { gql } from "@apollo/client";

export const SUBSCRIPTION_MESSAGE_CREATED = gql`
  subscription MessageAdded {
    messageAdded {
      id
      createdAt
      receiverId
      senderId
      text
    }
  }
`;
