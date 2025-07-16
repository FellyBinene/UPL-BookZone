import React, { useState, useEffect } from "react";
import {
    Dimensions,
    View,
    Text,
    StyleSheet, Image, RefreshControl, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  // Recommande d'utiliser react-native-safe-area-context
import { MaterialIcons } from '@expo/vector-icons'; // si tu préfères une icône vectorielle
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import HeaderUsers from './components/HeaderUsers';
import FooterUsers from './components/FooterUsers';
import DisplayBook from './DisplayBook';
import UserProfile from './UserProfile';

const { height, width } = Dimensions.get("window");

const HomeScreenUsers = ({ route }) => {
    const navigation = useNavigation();
    const userFromLogin = route?.params?.user || null; // extraire l'utilisateur de route params
    const [refreshing, setRefreshing] = useState(false);

    const [activeScreen, setActiveScreen] = useState('HomeUsers');
    const [user, setUser] = useState(userFromLogin);
    const [bookCount, setBookCount] = useState(0);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        setUser(null);
        navigation.replace('Connexion');
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('http://192.168.136.89:4000/api/books');
            if (!res.ok) throw new Error('Erreur lors du chargement des livres');
            const books = await res.json();
            setBookCount(books.length);
        } catch (error) {
            console.error('Erreur fetch books:', error.message);
        }
        setRefreshing(false);
    };


    useEffect(() => {
        // Charge le nombre de livres publiés
        const fetchBookCount = async () => {
            try {
                const res = await fetch('http://192.168.136.89:4000/api/books');
                if (!res.ok) throw new Error('Erreur lors du chargement des livres');
                const books = await res.json();
                setBookCount(books.length);
            } catch (error) {
                console.error('Erreur fetch books:', error.message);
            }
        };

        fetchBookCount();
    }, []);

    const renderContent = () => {
        switch (activeScreen) {
            case 'DisplayBook':
                return <DisplayBook />;
            case 'UserProfile':
                return (
                    <UserProfile
                        user={user}
                        onLogout={handleLogout}
                        onChangePassword={() => navigation.navigate('ChangePassword', { matricule: user.matricule })}
                    />
                );
            default:
                return (
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <Image
                            source={require('../../assets/images/svg/Livre.png')}
                            style={styles.headerImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.title}>Bienvenue à UPL-BookZone</Text>

                        <View style={styles.card}>
                            <Text style={styles.label}>Livres publiés</Text>
                            <Text style={styles.value}>{bookCount}</Text>
                            <Image
                                source={require('../../assets/images/svg/Livres.png')}
                                style={styles.icon}
                            />
                        </View>
                    </ScrollView>
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
            <HeaderUsers
                onLeftPress={() => navigation.navigate('Notifications')}
                onRightPress={() => setActiveScreen('UserProfile')} />
            <View style={styles.content}>
                {renderContent()}
            </View>
            <FooterUsers onNavigate={handleNavigate} activeScreen={activeScreen} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        height: height,
        width: width,
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeContent: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    headerImage: {
        width: width * 0.9,
        height: height * 0.5, // prend 50% de l'écran
        marginBottom: 24,
        borderRadius: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 24, // espace après le texte
    },
    card: {
        width: width * 0.9,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 6,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    value: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    icon: {
        width: 64,
        height: 64,
        resizeMode: 'contain',
    },
});

export default HomeScreenUsers;
