import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants"
import {ActivityIndicator} from "react-native";

const Touchable = styled.TouchableOpacity`

`;

const Container = styled.View`
    background-color: ${props => props.theme.darkBlueColor};
    padding: 10px;
    margin: 0px 50px;
    border-radius: 4px;
    width: ${constants.width / 5};
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const AddButton = ({ text, onPress,loading= false }) => (
    <Touchable disabled={loading} onPress={onPress}>
        <Container>
            {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
        </Container>
    </Touchable>
);

AddButton.propTypes = {
    loading: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
};

export default AddButton;

