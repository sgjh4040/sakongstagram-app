import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import styled from "styled-components";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import {stackStyles} from "./config";
import styles from "../styles";
import React from "react";
import NavIcon from "../components/NavIcon";



const BackButton = styled.TouchableOpacity`
    margin-left: 10px;
`;

const PhotoTabs = createMaterialTopTabNavigator(
    {


        Select: {
            screen: SelectPhoto,
            navigationOptions: {
                tabBarLabel: "Select"
            }
        },
        Take: {
            screen: TakePhoto,
            navigationOptions: {
                tabBarLabel: "Take"
            }
        },

    },
    {
        tabBarPosition: "bottom",
        tabBarOptions: {
            indicatorStyle: {
                backgroundColor: styles.blackColor,
                marginBottom: 20
            },
            labelStyle: {
                color: styles.blackColor,
                fontWeight: "600"
            },
            style: {
                paddingBottom: 20,
                ...stackStyles
            }
        }

    }
);

export default createStackNavigator({
        Tabs: {
            screen: PhotoTabs,
            navigationOptions:({ navigation }) => ({
                title: "사진 선택",
                headerLeft:<BackButton onPress={()=>navigation.navigate("TabNavigation")}><NavIcon name="ios-arrow-back"/></BackButton>
              })
        },
        Upload: {
            screen: UploadPhoto,
            navigationOptions: {
                title: "업로드"
            }
        }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                ...stackStyles

            },
            headerTintColor: styles.blackColor
        }
    }
);
