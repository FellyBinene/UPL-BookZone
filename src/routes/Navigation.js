import {View} from 'react-native';
import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Stack} from "expo-router";
import LoginScreen from "../ecrans/LoginScreen";
import App from "../../App";
import SignInScreen from "../ecrans/SignInScreen";

const Navigation = () => {

    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Connexion" screenOptions={{
                headerShown: false
            }}
            >
                <Stack.Screen name="Connexion" component={LoginScreen} />
                <Stack.Screen name="Inscription" component={SignInScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;