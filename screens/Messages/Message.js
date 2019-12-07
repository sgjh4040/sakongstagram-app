import React, {useState, useMemo} from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import {useQuery} from "react-apollo-hooks";
import {
    ScrollView,
    TextInput,
    KeyboardAvoidingView
} from "react-native";
const SEE_ROOM = gql`
    query seeRoom($id:String!){
        seeRoom(id: $id){
            id
            participants{
                username
            }
            messages{
            text
            }
        }
    }
`;
const SEND_MESSAGE = gql`
  mutation sendMessage($roomId:String, $message:String!, $toId:String) {
    sendMessage(roomId: $roomId message: $message toId: $toId) {
      id
      text
    }
  }
`;

const View = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;

`;

const Text = styled.Text``;

export default ({navigation}) => {
    const {data} = useQuery(SEE_ROOM,{
        variables:{
            id: navigation.getParam("roomid")
        }
    });
    console.log(data);

    return (
        <View>
            <Text>Message</Text>
        </View>
    )

}
