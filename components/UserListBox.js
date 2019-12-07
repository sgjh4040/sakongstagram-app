import React from "react";
import {TouchableOpacity, Image} from "react-native";
import styled from "styled-components";
import {withNavigation} from "react-navigation";
import PropTypes from "prop-types";
import constants from "../constants";

const Box = styled.View`
    flex-direction: row;
    margin: 5px 0 ;
    border-color: black;
    border-bottom-width: 1px;
`;
const UserContainer= styled.View`
    margin-left: 10px;
`
const Bold = styled.Text`
  font-weight: 500;
`;
const Bio = styled.Text`
  font-size: 12px;
`;

const UserListBox = ({navigation, avatar, id, username,bio}) => (
    <TouchableOpacity>
        <Box>
            <Image
                source={{uri: avatar}}
                style={{height: 60, width: 60, borderRadius: 20}}
            />
            <UserContainer>
                <Bold>
                    {username}
                </Bold>
                <Bio>
                    {bio}
                </Bio>
            </UserContainer>

        </Box>
    </TouchableOpacity>

)


UserListBox.propTypes = {
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired
}

export default withNavigation(UserListBox);
