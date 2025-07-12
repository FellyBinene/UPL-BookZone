import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../ecrans/LoginScreen";
import SignInScreen from "../ecrans/SignInScreen";
import Accueil from "@/sessions/user/Accueil";
import DisplayBook from "@/sessions/user/DisplayBook";
import ListUsers from "@/sessions/admin/ListUsers"
import AdminSignIn from "../ecrans/AdminSignIn";
import AdminLogin from "../ecrans/AdminLogin";
import PDFViewerScreen from "../../sessions/visitors/PDFViewerScreen";
import HomeScreen from "../../sessions/admin/HomeScreen";
import ListBooks from "@/sessions/admin/ListBooks";
import HomeScreenUsers from "../../sessions/user/HomeScreenUsers";
import UserProfile from '../../sessions/user/UserProfile';
import AdminProfile from '../../sessions/admin/components/AdminProfile';
import NotificationScreen from '../../sessions/user/NotificationScreen';

const Navigation = () => {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Connexion"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Connexion" component={LoginScreen} />
                <Stack.Screen name="ConAdmin" component={AdminLogin} />
                <Stack.Screen name="Inscription" component={SignInScreen} />
                <Stack.Screen name="InsAdmin" component={AdminSignIn} />
                <Stack.Screen name="Accueil" component={Accueil} />
                <Stack.Screen name="DisplayBook" component={DisplayBook} />
                <Stack.Screen name="ListUsers" component={ListUsers} />
                <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="HomeUsers" component={HomeScreenUsers} />
                <Stack.Screen name="ListBooks" component={ListBooks} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
                <Stack.Screen name="AdminProfile" component={AdminProfile} />
                <Stack.Screen name="Notifications" component={NotificationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
