import React from "react";
import  {TouchableOpacity, Image} from "react-native";
import styled from "styled-components";
import {withNavigation} from "react-navigation";

const Box = styled.TouchableOpacity`
`;


const View = styled.View`
    
    align-items: center;
`;
const Text = styled.Text`
    
`;

const UserListBox = ({navigation,avatar, username,id})=>(
    <Box onPress={() => navigation.navigate("Message",{toId:id}) } >
        <View>
            <Image
                style={{height: 90, width: 90, borderRadius: 20}}
                source={{uri:avatar}}
            />
            <Text>{username}</Text>
        </View>
    </Box>

)

export default withNavigation(UserListBox);
