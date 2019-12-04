import React from "react";
import  {TouchableOpacity, Image} from "react-native";
import styled from "styled-components";
import {withNavigation} from "react-navigation";

const View = styled.View`
`;
const Text = styled.Text`
`

const UserListBox = ({navigation,list = [], id})=>(
    <TouchableOpacity >
        <View>
            <Text>test</Text>
        </View>
    </TouchableOpacity>

)

export default withNavigation(UserListBox);
