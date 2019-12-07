import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {gql} from "apollo-boost";
import {withNavigation} from "react-navigation";

const Container = styled.View`
  margin-bottom: 40px;
`
const Title = styled.Text`
    font-size: 12px;
`;
const Touchable = styled.TouchableOpacity`

`;

const RoomBox = ({
                     id,
                     navigation
                 }) => {

    return (
        <Container>
            <Touchable onPress={() => navigation.navigate("MessageDetail",{roomid:id})}>
                <Title>
                    {id}
                </Title>
            </Touchable>
        </Container>
    )

}

export default withNavigation(RoomBox);
