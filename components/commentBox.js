import React from "react";
import styled from "styled-components";
import {Image} from "react-native";


const Container = styled.View`
    flex-direction: row;
    align-items: center;
`;
const UserName = styled.Text`
    font-size: 14px;
    font-weight: 600;
`;


const Text = styled.Text`
    font-size: 12px;
    text-align: right;
`;

const CommentBox = ({text, user}) => {

    return(
        <Container>
            <Image
                style={{height: 40, width: 40, borderRadius: 20}}
                source={{uri:user.avatar}}
            />
            <UserName>{user.username}</UserName>
            <Text>{text}</Text>
        </Container>
    )
}

export default CommentBox;
