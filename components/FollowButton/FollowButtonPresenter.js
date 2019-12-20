import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../../constants"
import {ActivityIndicator} from "react-native";

const Touchable = styled.TouchableOpacity`
    width:${constants.width/2}
`;

const Container = styled.View`
    background-color: ${props => props.theme.darkBlueColor};
    padding: 10px;
    border-radius: 4px;
    width:100%;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;


export default ({ isFollowing, onPress }) => (
    <Touchable onPress={onPress}>
        <Container>
            <Text>
                {isFollowing ? "팔로우 취소" : "팔로우"}
            </Text>
        </Container>
    </Touchable>
)