import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {gql} from "apollo-boost";
import {withNavigation} from "react-navigation";
import {Image} from "react-native"
import constants from "../constants";
import NavIcon from "./NavIcon";

const Container = styled.View`
  margin:0 5px 10px 5px;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  padding: 0 3px;
  
`
const Title = styled.Text`
    font-size: 15px;
    flex: 4;
`;
const Touchable = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    height: ${constants.width / 8};

`;
const GoMessage = styled.Text`
    flex: 2;
    font-size: 13px;
`;  

const RoomBox = ({
                     id,
                     navigation,
                     participants = []
                 }) => {
    return (
        <Container>
            <Touchable onPress={() => navigation.navigate("Message", {roomid: id})}>
                <Image
                    source={{uri:participants[0].avatar}}
                    style={{height: 50, width: 50, borderRadius: 20,flex:1}}
                />
                <Title>
                    {participants[0].username}
                </Title>
                <GoMessage>
                    채팅하러 가기
                </GoMessage>
                <NavIcon name="ios-arrow-forward"/>
            </Touchable>
        </Container>
    )

}

RoomBox.propTypes = {
    id: PropTypes.string,
    participants: PropTypes.arrayOf(
        PropTypes.shape({
            id:PropTypes.string.isRequired,
            avatar: PropTypes.string
        })
    )
}

export default withNavigation(RoomBox);
