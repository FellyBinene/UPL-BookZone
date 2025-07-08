import {AppRegistry,} from "react-native";
import app from './app.json';
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import Navigation from "./src/routes/Navigation";
import WelcomeScreen from "./src/WelcomeScreen";
import ListUsers from "./sessions/admin/ListUsers";
import ListAdmins from "./sessions/admin/ListAdmins";
import Footer from "./sessions/admin/components/FooterAdmin";
import Header from "./sessions/admin/components/HeaderAdmin";
import Accueil from "./sessions/user/Accueil";
import HomeScreen from "./sessions/admin/HomeScreen";


const App = () => {

    return (
        <SafeAreaView style={styles.root}>
            <Navigation />
        </SafeAreaView>
    );
};

export default App;
AppRegistry.registerComponent(app.expo.name, () => App);

const styles = StyleSheet.create({
    root: {
        flex: 1,
    }
})