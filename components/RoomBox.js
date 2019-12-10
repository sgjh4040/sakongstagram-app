import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {gql} from "apollo-boost";
import {withNavigation} from "react-navigation";
import {Image} from "react-native"
import constants from "../constants";

const Container = styled.View`
  margin:0 5px 10px 5px;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  padding: 0 3px;
  
`
const Title = styled.Text`
    font-size: 12px;
`;
const Touchable = styled.TouchableOpacity`

`;

const RoomBox = ({
                     id,
                     navigation,
                     participants = []
                 }) => {
    return (
        <Container>
            <Touchable onPress={() => navigation.navigate("MessageDetail", {roomid: id})}>
                <Image
                    source={{uri:participants[0].avatar}}
                    style={{height: 40, width: 40, borderRadius: 20}}
                />
                <Title>
                    {participants[0].username}
                    {id}
                </Title>
            </Touchable>
        </Container>
    )

}

RoomBox.propTypes = {
    id: PropTypes.string,
    participants: PropTypes.arrayOf(
        PropTypes.shape({
            id:PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired
        })
    )
}

export default withNavigation(RoomBox);
