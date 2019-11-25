import React from "react";
import { View } from "react-native";
import {  useLogIn, useLogOut } from "../AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";
import TabNavigation from "../navigation/TabNavigation"
import MainNavigation from "../navigation/MainNavigation"

export default () => {
    // const isLoggedIn = useIsLoggedIn();
    isLoggedIn = false;
    const logIn = useLogIn();
    const logOut = useLogOut();
    return (
        <View style={{ flex: "1" }}>
             {isLoggedIn ? <MainNavigation /> : <AuthNavigation />}
        </View>
    );
}