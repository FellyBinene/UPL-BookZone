import {AppRegistry,} from "react-native";
import app from './app.json';
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import LoginScreen from "./src/ecrans/LoginScreen";
import SignInScreen from "./src/ecrans/SignInScreen";
import {NavigationContainer} from "@react-navigation/native";
import Navigation from "./src/routes/Navigation";
import WelcomeScreen from "./src/WelcomeScreen";
import ListUsers from "./sessions/admin/ListUsers";
import AddBook from "./sessions/admin/addBook";

const App = () => {

    return (
        <SafeAreaView style={styles.root}>
            <AddBook/>
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