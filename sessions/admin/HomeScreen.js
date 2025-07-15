import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    ScrollView,
    Dimensions,
    Platform,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import Header from './components/HeaderAdmin';
import Footer from './components/FooterAdmin';
import AdminProfile from './components/AdminProfile';
import ListUsers from './ListUsers';
import ListAdmins from './ListAdmins';
import ListBooks from './ListBooks';

const { width } = Dimensions.get('window');

const UsersChoice = ({ onSelect }) => (
    <View style={styles.choiceContainer}>
        <Text style={styles.choiceTitle}>Choisissez la liste à afficher :</Text>
        <View style={styles.buttonsRow}>
            <TouchableOpacity
                style={[styles.choiceButton, styles.shadow]}
                onPress={() => onSelect('ListUsers')}
            >
                <MaterialIcons name="people" size={64} color="#000" />
                <Text style={styles.choiceButtonText}>Utilisateurs</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.choiceButton, styles.shadow]}
                onPress={() => onSelect('ListAdmins')}
            >
                <FontAwesome5 name="user-shield" size={64} color="#000" />
                <Text style={styles.choiceButtonText}>Administrateurs</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const { user: admin } = route.params || {};
    const [activeScreen, setActiveScreen] = useState('Home');
    const [bookCount, setBookCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const booksRes = await fetch('http://192.168.17.89:4000/api/books');
            const usersRes = await fetch('http://192.168.17.89:4000/api/users');
            const adminsRes = await fetch('http://192.168.17.89:4000/api/admins');

            if (!booksRes.ok) throw new Error('Requête échouée: /api/books');
            if (!usersRes.ok) throw new Error('Requête échouée: /api/users');
            if (!adminsRes.ok) throw new Error('Requête échouée: /api/admins');

            const books = await booksRes.json();
            const users = await usersRes.json();
            const admins = await adminsRes.json();

            setBookCount(books.length);
            setUserCount(users.length);
            setAdminCount(admins.length);
        } catch (error) {
            console.error('Erreur chargement des stats:', error.message);
        }
    };

    const renderContent = () => {
        switch (activeScreen) {
            case 'AdminProfile':
                return <AdminProfile admin={admin} />;
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
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.card}>
                            <Text style={styles.label}>Livres</Text>
                            <Text style={styles.value}>{bookCount}</Text>
                            <Image source={require('../../assets/images/svg/Livres.png')} style={styles.icon} />
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.label}>Utilisateurs</Text>
                            <Text style={styles.value}>{userCount}</Text>
                            <Image source={require('../../assets/images/svg/Users.png')} style={styles.icon} />
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.label}>Administrateurs</Text>
                            <Text style={styles.value}>{adminCount}</Text>
                            <Image source={require('../../assets/images/svg/Admin1.png')} style={styles.icon} />
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
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <Header
                    onNavigate={handleNavigate}
                    onChangePassword={() =>
                        navigation.navigate('ChangePasswordAdmin', {
                            matricule: admin?.matricule,
                        })
                    }
                    onLogout={() => navigation.replace('ConAdmin')}
                />
                <View style={styles.innerContent}>{renderContent()}</View>
                <Footer onNavigate={handleNavigate} activeScreen={activeScreen} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f9fafb',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    innerContent: {
        flex: 1,
    },
    content: {
        padding: 16,
        alignItems: 'center',
    },
    card: {
        width: width * 0.9,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
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
    choiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    choiceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    choiceButton: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    choiceButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default HomeScreen;
