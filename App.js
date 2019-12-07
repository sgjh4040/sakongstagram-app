import React, {useState, useEffect} from 'react';
import {View} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import {AppLoading} from "expo";
import * as Font from 'expo-font';
import {Asset} from 'expo-asset'
import {AsyncStorage} from 'react-native';
import {persistCache} from 'apollo-cache-persist';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {getMainDefinition} from 'apollo-utilities';
import {ApolloProvider} from "react-apollo-hooks";
import apolloClientOptions from "./apollo";
import styles from "./styles";
import {ThemeProvider} from "styled-components"
import NavController from "./components/NavController"
import {AuthProvider} from "./AuthContext"
import {WebSocketLink} from "apollo-link-ws";
import {split, ApolloLink, Observable} from 'apollo-link';
import { setContext } from 'apollo-link-context';

// Create an http link:
const httpLink = new HttpLink({
    uri: 'http://localhost:4000',
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect: true
    }
});
const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token =await AsyncStorage.getItem('jwt');
    console.log('token2',token);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});


const link = split(
    // split based on operation type
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

export default function App() {
    const [loaded, setLoaded] = useState(false);
    const [client, setClient] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const preLoad = async () => {
        try {
            await Font.loadAsync({
                ...Ionicons.font
            });
            await Asset.loadAsync([require("./assets/logo.png")])
            const cache = new InMemoryCache();
            await persistCache({
                cache,
                storage: AsyncStorage,
            });
            const client = new ApolloClient({
                cache,
                ...apolloClientOptions
            });
            // AsyncStorage.setItem('isLoggedIn','false');
            const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
            console.log('isLoggedIn', isLoggedIn);
            const token = await AsyncStorage.getItem("jwt");
            console.log('token', token);

            if (!isLoggedIn || isLoggedIn === "false") {
                setIsLoggedIn(false);
            } else {
                setIsLoggedIn(true);
            }

            setLoaded(true);
            setClient(client);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        preLoad();
    }, [])


    return loaded && client && isLoggedIn !== null ? (
        <ApolloProvider client={client}>
            <ThemeProvider theme={styles}>
                <AuthProvider isLoggedIn={isLoggedIn}>
                    <NavController/>
                </AuthProvider>
            </ThemeProvider>
        </ApolloProvider>
    ) : (
        <AppLoading/>
    )
}


