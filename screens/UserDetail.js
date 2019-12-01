import React from "react";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../fragment";
import Loader from "../components/Loader";
import { ScrollView } from "react-native";
import UserProfile from "../components/UserProfile";

const GET_USER = gql`
  query seeUser($username: String!) {
    seeUser(username: $username) {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
    console.log("UserDetail open")
    const { loading, data } = useQuery(GET_USER, {
        variables: { username: navigation.getParam("username") }
    });
    return (
        <ScrollView>
            {loading ? (
                <Loader />
            ) : (
                data && data.seeUser && <UserProfile {...data.seeUser} />
            )}
        </ScrollView>
    );
};
