import React, { useState } from "react";
import { Dimensions, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import Header from './components/HeaderAdmin';
import Footer from './components/FooterAdmin';
import ListUsers from "./ListUsers";
import ListAdmins from "./ListAdmins";
import ListBooks from "./ListBooks";

const { height, width } = Dimensions.get("window");

const UsersChoice = ({ onSelect }) => {
    return (
        <View style={styles.choiceContainer}>
            <Text style={styles.choiceTitle}>Choisissez la liste à afficher :</Text>
            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    style={[styles.choiceButton, styles.shadow]}
                    onPress={() => onSelect('ListUsers')}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="people" size={64} color="#000" />
                    <Text style={styles.choiceButtonText}>Utilisateurs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.choiceButton, styles.shadow]}
                    onPress={() => onSelect('ListAdmins')}
                    activeOpacity={0.8}
                >
                    <FontAwesome5 name="user-shield" size={64} color="#000" />
                    <Text style={styles.choiceButtonText}>Administrateurs</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.cancelButton, styles.shadow]}
                onPress={() => onSelect('Home')}
                activeOpacity={0.8}
            >
                <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
        </View>
    );
};

const HomeScreen = () => {
    const [activeScreen, setActiveScreen] = useState('Home');

    const renderContent = () => {
        switch (activeScreen) {
            case 'ListUsers':
                return <ListUsers />;
            case 'ListAdmins':
                return <ListAdmins />;
            case 'ListBooks':
                return <ListBooks />;
            case 'UsersChoice':
                return <UsersChoice onSelect={setActiveScreen} />;
            case 'Home':
            default:
                return (
                    <View style={styles.homeContent}>
                        <Text style={styles.title}>HomeScreen</Text>
                    </View>
                );
        }
    };

    const handleNavigate = (screen) => {
        if (screen === 'ListUsers') {
            setActiveScreen('UsersChoice');
        } else {
            setActiveScreen(screen);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.content}>
                {renderContent()}
            </View>
            <Footer onNavigate={handleNavigate} activeScreen={activeScreen} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        height: height,
        width: width,
        flexDirection: 'column',
        justifyContent: "space-between",
        paddingTop: 36,
    },
    content: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },
    choiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    choiceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#000',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',  // Centrer horizontalement
        width: '80%',
        marginBottom: 40,
    },
    choiceButton: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,  // Espace entre boutons
        borderWidth: 1,
        borderColor: '#ddd',
    },
    choiceButtonText: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 60,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default HomeScreen;
