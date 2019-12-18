import React from "react";
import { TouchableOpacity, Image } from "react-native";
import {withNavigation} from "react-navigation";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Text } from "react-native"

const Card = styled.View`
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const UserCard = ({ navigation,id, username, isFollowing, avatar, isSelf }) => (
    <TouchableOpacity onPress={()=> navigation.navigate("UserDetail",{id,username})}>
        <Card>
            <Image
                style={{ height: 50, width: 50, borderRadius: 20 }}
                source={{ uri: avatar }}
            />
            <Text>{username}</Text>
        </Card>
    </TouchableOpacity>
)

UserCard.propTypes = {
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    avatar: PropTypes.string.isRequired,
    isSelf: PropTypes.bool.isRequired
};

export default withNavigation(UserCard);