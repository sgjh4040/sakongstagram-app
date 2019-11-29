import React from "react";
import {View} from "react-native";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from "../screens/Tabs/Home";
import Search from "../screens/Tabs/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import MessagesLink from "../components/messagesLink"
import {Platform} from "react-native";
import NavIcon from "../components/NavIcon";


const stackFactory = (initialRoute, customConfig) =>
    createStackNavigator({
        InitialRoute: {
            screen: initialRoute,
            navigationOptions: {...customConfig, headerStyle: {backgroundColor: "#EFEEEF"}}
        }
    });

export default createBottomTabNavigator({
        홈: {
            screen: stackFactory(Home, {
                headerRight: <MessagesLink/>,
                headerTitle: <NavIcon name="logo-instagram" size={36}/>
            }),
            navigationOptions: {
                tabBarIcon: ({focused}) => (
                    <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-home" : "md-home"}/>
                )
            }
        },
        검색: {
            screen: stackFactory(Search),
            navigationOptions: {
                tabBarIcon: ({focused}) => (
                    <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-search" : "md-search"}/>
                )
            }
        },
        Add: {
            screen: View,
            navigationOptions: {
                tabBarOnPress: ({navigation}) =>
                    navigation.navigate("PhotoNavigation"),
                tabBarIcon: ({focused}) => (
                    <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-add" : "md-add"}/>
                )
            }
        },
        Notifications: {
            screen: stackFactory(Notifications, {
                title: "Notifications"
            }),
            navigationOptions: {
                tabBarIcon: ({focused}) => (
                    <NavIcon
                        focused={focused}
                        name={
                            Platform.OS === "ios"
                                ? focused
                                ? "ios-heart"
                                : "ios-heart-empty"
                                : focused
                                ? "md-heart"
                                : "md-heart-empty"
                        }
                    />
                )
            }
        },
        프로필: {
            screen: stackFactory(Profile, {
                title: "프로필"
            }),
            navigationOptions: {
                tabBarIcon: ({focused}) => (
                    <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-person" : "md-person"}/>
                )
            }
        }
    },
    {
        initialRouteName:"검색",
      tabBarOptions:{
        showLabel: false,
        tabStyle:{
          backgroundColor: "#EFEEEF"
        }
      }
    }
);
