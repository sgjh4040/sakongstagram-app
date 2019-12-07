import React, {useState, useMemo} from "react";
import styled from "styled-components";
import {
    ScrollView,
    TextInput,
    KeyboardAvoidingView
} from "react-native";
import gql from "graphql-tag";
import {useQuery, useMutation, useSubscription} from "react-apollo-hooks";

const SEE_ROOM = gql`
    query seeRoom($id:String!){
        seeRoom(id: $id){
            id
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
const NEW_MESSAGE = gql`
    subscription newMessage($roomId: String!){
        newMessage(roomId: $roomId){
            id
        }
    
    }
`;


const View = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;

`;

const Text = styled.Text``;

export default () => {
    const [message, setMessage] = useState("");
    const sendMessageMutation = useMutation(SEND_MESSAGE, {
        variables: {
            message
        }
    });
    const {data} = useSubscription(NEW_MESSAGE);
    const handleNewMessage = () => {

    }



    return (
        <View>
            <Text>Message</Text>
        </View>
    )
};
