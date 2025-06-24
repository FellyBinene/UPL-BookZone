import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../ecrans/LoginScreen";
import SignInScreen from "../ecrans/SignInScreen";
import Accueil from "@/sessions/user/Accueil";

const Navigation = () => {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Connexion"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Connexion" component={LoginScreen} />
                <Stack.Screen name="Inscription" component={SignInScreen} />
                <Stack.Screen name="Accueil" component={Accueil} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
