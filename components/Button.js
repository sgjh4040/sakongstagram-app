import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants"

const Touchable = styled.TouchableOpacity`
    width:${constants.width / 2}
`;

const Container = styled.View`
    background-color: ${props => props.style.color};
    padding: 10px;
    border-radius: 4px;
    width:100%;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const Button = ({ text, onPress, style }) => (
    <Touchable onPress={onPress}>
        <Container style={style}>
            <Text>{text}</Text>
        </Container>
    </Touchable>
);

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object
};

export default Button;

