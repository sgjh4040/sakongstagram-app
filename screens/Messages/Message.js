import React, { useState, useMemo, useEffect, Suspense } from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import { Image, ScrollView, TextInput, KeyboardAvoidingView, ActivityIndicator } from "react-native";
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
                avatar
                username
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
                avatar
                username
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
                avatar
                username
            }
        }
    
    }
`;


const View = styled.View`
    
`;
const ColumnView = styled.View`
    flex-direction: column
`;
const MessageContainer = styled.View`
    flex-direction: row;
    align-self: ${props => props.align};
    align-items: flex-end;
    
`;

const MessageBubble = styled.View`
  background-color: white;
  box-shadow:  0 5px 15px rgba(0, 0, 0, 0.15);
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-right:10px;
  max-width: ${constants.width / 1.3}
`;

const Text = styled.Text`
`;
const UserNameText = styled.Text`
    margin-bottom: 3px;
`;
const DateText = styled.Text`
    color:#7E8E9B;
    margin-bottom: 10px;
    font-size: 12px;
    margin-left: 10px;
    margin-right: 10px;
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

            <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="height" keyboardVerticalOffset="2">
                <ScrollView
                    contentContainerStyle={{
                        paddingVertical: 80,
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center"

                    }}
                >

                    {loading ? <Text></Text> : messages.map(m =>
                        (m.from.id == me.id) ? (
                            <MessageContainer key={m.id} align={"flex-end"}>
                                <DateText>
                                    {moment.getDateFormat(m.createdAt)}
                                </DateText>
                                <MessageBubble align={"flex-end"}>
                                    <Text>
                                        {m.text}
                                    </Text>

                                </MessageBubble>
                            </MessageContainer>) : (
                                <MessageContainer key={m.id} align={"flex-start"}>
                                    <Image
                                        style={{ height: 30, width: 30, borderRadius: 15, marginBottom: 25, marginRight: 10 }}
                                        source={{ uri: m.from.avatar }}
                                    />
                                    <ColumnView>
                                        <UserNameText>
                                            {m.from.username}
                                        </UserNameText>
                                        <MessageBubble key={m.id} align={"flex-start"}>
                                            <Text style={{ marginBottom: 5 }}>{m.text}</Text>
                                        </MessageBubble>
                                    </ColumnView>
                                    <DateText>
                                        {moment.getDateFormat(m.createdAt)}
                                    </DateText>
                                </MessageContainer>
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
