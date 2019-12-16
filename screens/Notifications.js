import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";


const NOTI_QUERY = gql`
{
  seeNotification{
    id
  }
}
`

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const {loading,data,refetch}= useQuery(NOTI_QUERY);
  console.log("data");
  console.log(data);


  return(
    <View>
    <Text>알림</Text>
  </View>
  )
  
};