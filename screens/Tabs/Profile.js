import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../../fragment";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserProfile from "../../components/UserProfile";

export const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;


export default ({ navigation }) => {
    const { loading,refetch, data } = useQuery(ME);
    useEffect(() => {
      refetch();
    }, [])
    return (
        <ScrollView>
            {loading ? <Loader /> : data && data.me && <UserProfile {...data.me} navigation={navigation} />}
        </ScrollView>
    );
};
