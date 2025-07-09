import React, { useState } from "react";
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

import HeaderUsers from './components/HeaderUsers';
import FooterUsers from './components/FooterUsers';
import DisplayBook from './DisplayBook';
import UserProfile from './UserProfile';

const { height, width } = Dimensions.get("window");

const HomeScreenUsers = ({ route }) => {
    const userFromLogin = route?.params?.user || null; // extraire l'utilisateur de route params

    const [activeScreen, setActiveScreen] = useState('HomeUsers');
    const [user, setUser] = useState(userFromLogin);

    const renderContent = () => {
        switch (activeScreen) {
            case 'DisplayBook':
                return <DisplayBook />;
            case 'UserProfile':
                return <UserProfile user={user} />;  // On passe bien l'utilisateur ici
            default:
                return (
                    <View style={styles.homeContent}>
                        <Text style={styles.title}>Bienvenue à UPL-BookZone</Text>
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
            <HeaderUsers onRightPress={() => setActiveScreen('UserProfile')} />
            <View style={styles.content}>
                {renderContent()}
            </View>
            <FooterUsers onNavigate={handleNavigate} activeScreen={activeScreen} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        height: height,
        width: width,
        flexDirection: 'column',
        justifyContent: "space-between",
        paddingTop: 36,
    },
    content: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 25,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center',
    },
});

export default HomeScreenUsers;
