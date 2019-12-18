import React from "react";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../fragment";
import Loader from "../components/Loader";
import { ScrollView } from "react-native";
import UserProfile from "../components/UserProfile";

const GET_USER = gql`
  query seeUser($id: String!) {
    seeUser(id: $id) {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
    const { loading, data } = useQuery(GET_USER, {
        variables: { id: navigation.getParam("id") }
    });
    console.log("userDetail:",data);
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
