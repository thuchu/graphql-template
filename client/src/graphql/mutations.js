import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
  mutation SignupUser($newUser: UserInput!) {
    signupUser(newUser: $newUser) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation SigninUser($userSignin: UserSigninInput!) {
    signinUser(userSignin: $userSignin) {
      token
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation CreateMessage($receiverId: Int!, $message: String!) {
    createMessage(receiverId: $receiverId, message: $message) {
      id
      receiverId
      senderId
      text
      createdAt
    }
  }
`;
