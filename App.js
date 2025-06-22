import {AppRegistry,} from "react-native";
import app from './app.json';
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import LoginScreen from "./src/ecrans/LoginScreen";

const App = () => {
    return (
        <SafeAreaView style={styles.root}>
            <LoginScreen />
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