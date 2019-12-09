import React, {useState, useMemo, useEffect, Suspense} from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import {useQuery, useMutation, useSubscription} from "react-apollo-hooks";
import {ScrollView, TextInput, KeyboardAvoidingView, ActivityIndicator} from "react-native";
import withSuspense from "../../components/withSuspense";

const SEE_ROOM = gql`
    query seeRoom($id:String!){
        seeRoom(id: $id){
            id
            participants{
                username
            }
            messages{
            id
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
const NEW_MESSAGE = gql`
    subscription newMessage($roomId: String!){
        newMessage(roomId: $roomId){
            id
            text
        }
    
    }
`;


const View = styled.View`
    
`;

const Text = styled.Text`
    
`;

const Message = ({navigation}) => {
    const [message, setMessage] = useState("");
    const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
        variables: {
            message,
            roomId: navigation.getParam("roomid")
        }
    });
    const {
        data: {
            seeRoom: {
                messages: oldMessages
            }
        }, refetch, error
    } = useQuery(SEE_ROOM, {
        variables: {
            id: navigation.getParam("roomid")
        },
        suspend: true
    });

    console.log("oldMessages", oldMessages);

    const {data} = useSubscription(NEW_MESSAGE, {
        variables: {
            roomId: navigation.getParam("roomid")
        }
    });
    // refetch();
    const [messages, setMessages] = useState(oldMessages || []);
    const handleNewMessage = () => {
        console.log("handleNewMessage")
        if (data !== undefined) {
            console.log("data!", data);
            const {newMessage} = data;
            setMessages(previous => [...previous, newMessage]);
        }
    };
    useEffect(() => {
        handleNewMessage();
    }, [data]);

    const onChangeText = text => setMessage(text);
    const onSubmit = async () => {
        if (message === "") {
            return;
        }
        try {
            await sendMessageMutation();
            setMessage("");
        } catch (e) {
            console.log(e);
        }
    };


    return (
        <Suspense
            fallback={
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <ActivityIndicator/>
                </View>
            }
        >
            <KeyboardAvoidingView style={{flex: 1}} enabled behavior="padding">
                <ScrollView
                    contentContainerStyle={{
                        paddingVertical: 50,
                        flex: 1,
                        justifyContent: "flex-end"
                    }}
                >

                    {messages.map(m => (
                        <View key={m.id} style={{ marginBottom: 10 }}>
                            <Text>{m.text}</Text>
                        </View>
                    ))}

                    <TextInput
                        placeholder="입력하세요"
                        style={{
                            marginTop: 50,
                            width: "90%",
                            borderRadius: 10,
                            paddingVertical: 15,
                            paddingHorizontal: 10,
                            backgroundColor: "#f2f2f2"
                        }}
                        returnKeyType="send"
                        value={message}
                        onChangeText={onChangeText}
                        onSubmitEditing={onSubmit}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Suspense>
    )
}
export default Message;
