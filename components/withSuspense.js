import React, { Suspense } from "react";
import { View, ActivityIndicator } from "react-native";

export default function withSuspense(Component) {
    return class extends React.Component {
        render() {
            const { navigation } = this.props;
            console.log('navigation',navigation.getParam("roomid"));
            const roomid = navigation.getParam("roomid");
            const toId = navigation.getParam("toId");
            return (
                <Suspense
                    fallback={
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <ActivityIndicator />
                        </View>
                    }
                >
                    <Component roomid={roomid} toId={toId} />
                </Suspense>
            );
        }
    };
}
