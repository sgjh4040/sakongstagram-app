import React from "react";
import {View} from "react-native";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from "../screens/Tabs/Home";
import Search from "../screens/Tabs/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Tabs/Profile";
import MessagesLink from "../components/messagesLink"
import {Platform} from "react-native";
import NavIcon from "../components/NavIcon";
import Detail from "../screens/Detail";
import styles from "../styles";
import {stackStyles} from "./config";
import UserDetail from "../screens/UserDetail";
import PhotoNavigation from "./PhotoNavigation";
import Message from "../screens/Messages/Message";

const stackFactory = (initialRoute, customConfig) =>
    createStackNavigator(
        {
            InitialRoute: {
                screen: initialRoute,
                navigationOptions: {
                    ...customConfig
                }
            },
            Detail: {
                screen: Detail,
                navigationOptions: {
                    headerTintColor: styles.blackColor,
                    title: "Photo"
                }
            },
            UserDetail:{
                screen: UserDetail,
                navigationOptions: ({ navigation }) => ({
                    title: navigation.getParam("username")
                })
            },
            MessageDetail:{
                screen: Message
            }
        },
        {
            defaultNavigationOptions: {
                // headerBackTitle: null,
                headerTintColor: styles.blackColor,
                headerStyle: {...stackStyles}
            }
        }
    );

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
            screen: stackFactory(Search, {
                // headerBackTitle: null
            }),
            navigationOptions: {
                tabBarIcon: ({focused}) => (
                    <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-search" : "md-search"}/>
                )
            }
        },
        Add: {
            screen: View,
            // screen:  stackFactory(PhotoNavigation, {
            //     // headerBackTitle: null
            //  x   headerShown: false
            // }),
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
        // initialRouteName: "검색",
        tabBarOptions: {
            showLabel: false,
            tabStyle: {
                backgroundColor: "#EFEEEF"
            }
        }
    }
);
