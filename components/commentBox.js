import React from "react";
import styled from "styled-components";
import {Image} from "react-native";
import {getFormattedRegDate} from "../util"
import constants from "../constants"

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 5px;
    margin-top:5px;
    border-bottom-width: 1px;
    border-bottom-color:#E6E6E6;
`;
const UserName = styled.Text`
    font-size: 14px;
    font-weight: 600;
    margin-right: 10px;
`;

const Div = styled.View`
    width: ${constants.width / 2};
`;
const Text = styled.Text`
    font-size: 12px;
`;
const CreateDate = styled.Text`
    position: absolute;
    right: 5px;
`;

const CommentBox = ({text, user,createdAt}) => {

    return(
        <Container>
            <Image
                style={{height: 30, width: 30, borderRadius: 15}}
                source={{uri:user.avatar}}
            />
            <UserName>{user.username}</UserName>
            <Div><Text>{text}</Text></Div>
            <CreateDate>{getFormattedRegDate(createdAt)}</CreateDate>
        </Container>
    )
}

export default CommentBox;
