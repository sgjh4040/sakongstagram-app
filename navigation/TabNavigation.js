import React from "react";
import { View} from "react-native";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "../screens/Home";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import MessagesLink from "../components/messagesLink"



const stackFactory = (initialRoute, customConfig) =>
createStackNavigator({
  InitialRoute: {
    screen: initialRoute,
    navigationOptions: { ...customConfig }
  }
});

export default createBottomTabNavigator({
  Home: {
    screen: stackFactory(Home, {
      title: "Home",
      headerRight: (
        <MessagesLink/>
      )
    })
  },
  Search: {
    screen: stackFactory(Search, {
      title: "Search"
    })
  },
  Add: {
    screen: View,
    navigationOptions: {
      tabBarOnPress: ({ navigation }) => {
        console.log("plus")
        navigation.navigate("PhotoNavigation")
      }

    }
  },
  Notifications: {
    screen: stackFactory(Notifications, {
      title: "Notifications"
    })
  },
  Profile: {
    screen: stackFactory(Profile, {
      title: "Profile"
    })
  }
});
