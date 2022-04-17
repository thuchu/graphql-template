import { gql } from "@apollo/client";

export const QUERY_ALL_USERS = gql`
  query getAllUsers {
    users {
      id
      firstName
      lastName
      email
    }
  }
`;

export const QUERY_GET_MESSENGER = gql`
  query MessageByUser($receiverId: Int!) {
    messageByUser(receiverId: $receiverId) {
      id
      text
      receiverId
      senderId
      createdAt
    }
  }
`;
