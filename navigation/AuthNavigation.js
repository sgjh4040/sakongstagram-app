import {createAppContainer} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import Signup from "../screens/Auth/Signup";
import Confirm from "../screens/Auth/Confirm";
import Login from "../screens/Auth/Login";
import AuthHome from "../screens/Auth/AuthHome";

const AuthNavigation = createStackNavigator(
    {
        Login:{
            screen: Login,
            navigationOptions:{
                headerShown: false,
                headerBackTitle: null
            }
        },
        Confirm,
        Signup:{
            screen: Signup,
            navigationOptions:{
                title:"회원가입"
            }
        },
        AuthHome,


    }
);

export default createAppContainer(AuthNavigation)
