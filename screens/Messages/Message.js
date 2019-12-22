import React, { useState, useMemo, useEffect, Suspense } from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import { ScrollView, TextInput, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import withSuspense from "../../components/withSuspense";
import { getDateFormat, getYearMonth } from "../../util"
import * as moment from "../../util"
import constants from "../../constants"


const ME = gql`
    {
        me{
            id
        }
    }
`;


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
            createdAt
            from{
                id
            }
            }
        }
    }
`;
const SEND_MESSAGE = gql`
  mutation sendMessage($roomId:String, $message:String!, $toId:String) {
    sendMessage(roomId: $roomId message: $message toId: $toId) {
      id
      text
      room{
        id
        messages{
            id
            text
            from{
                id
            }
        }
      }
    }
  }
`;
const NEW_MESSAGE = gql`
    subscription newMessage($roomId: String!){
        newMessage(roomId: $roomId){
            id
            text
            from{
                id
            }
        }
    
    }
`;


const View = styled.View`
    
`;
const MessageContainer = styled.View`
    flex-direction: row;
    align-self: ${props => props.align};
    align-items: flex-end;
    max-width: ${constants.width/1.1}
`;

const MessageBubble = styled.View`
  background-color: white;
  box-shadow:  0 5px 15px rgba(0, 0, 0, 0.15);
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600;
  margin-bottom: 10px;
  align-self: ${props => props.align};
`;

const Text = styled.Text`
`;
const DateText = styled.Text`
    margin-bottom: 10px;
`;


const Message = ({ roomid, toId }) => {
    const [roomId, setRoomid] = useState(roomid);
    const { data: {
        me
    } } = useQuery(ME);
    let oldMessages = [];
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
        variables: {
            message,
            roomId: roomId,
            toId: toId
        }
    });
    if (roomid != undefined) {
        const {
            data: {
                seeRoom: {
                    messages
                }
            }, refetch, error
        } = useQuery(SEE_ROOM, {
            variables: {
                id: roomId
            },
            suspend: true
        });
        console.log(messages);
        oldMessages = messages;
        refetch();
    }


    const { data } = useSubscription(NEW_MESSAGE, {
        variables: {
            roomId: roomId
        }
    });

    const [messages, setMessages] = useState(oldMessages || []);
    const handleNewMessage = () => {
        console.log("handleNewMessage")
        if (data !== undefined) {
            const { newMessage } = data;
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

            const { data: { sendMessage }, loading } = await sendMessageMutation();
            setLoading(loading);
            setRoomid(sendMessage.room.id);
            if (messages.length == 0) {
                setMessages([...sendMessage.room.messages]);
            }
            setMessage("");
            console.log("sendMessage", sendMessage);
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
                    <ActivityIndicator />
                </View>
            }
        >

            <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
                <ScrollView
                    contentContainerStyle={{
                        paddingVertical: 50,
                        flex: 1,
                        justifyContent: "flex-end"
                    }}
                >

                    {loading ? <Text></Text> : messages.map(m =>
                        (m.from.id == me.id) ? (
                            <MessageContainer align={"flex-end"}>
                                <DateText>
                                {moment.getDateFormat(m.createdAt)}
                                </DateText>
                                <MessageBubble key={m.id} align={"flex-end"}>
                                    <Text>
                                        {m.text}
                                    </Text>

                                </MessageBubble>
                            </MessageContainer>) : (
                                <MessageBubble key={m.id} align={"flex-start"}>
                                    <Text>{m.text}</Text>
                                </MessageBubble>
                            )
                    )}

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
export default withSuspense(Message);
