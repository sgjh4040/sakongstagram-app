import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import {stackStyles} from "./config";
import styles from "../styles";

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
            navigationOptions: {
                title: "사진 선택",
                // headerBackTitle: null
            }
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
