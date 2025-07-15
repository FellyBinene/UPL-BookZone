import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 ajouté ici

const LoginScreen = ({ navigation }) => {
    const [matricule, setMatricule] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        if (!matricule.trim() || !password.trim()) {
            Alert.alert('Champs manquants', 'Veuillez entrer votre matricule et mot de passe');
            return;
        }

        try {
            const response = await axios.post('http://192.168.17.89:4000/auth/signin', {
                matricule: matricule.trim(),
                password: password.trim(),
            });

            if (response.status === 200) {
                console.log('Données retournées par le serveur :', response.data);
                const utilisateur = response.data.user;  // ici !
                Alert.alert('Succès', 'Connexion réussie !');
                navigation.navigate('HomeUsers', { user: utilisateur });
            }

        } catch (error) {
            console.error('Erreur axios :', error);
            if (error.response && error.response.data && error.response.data.message) {
                Alert.alert('Erreur', error.response.data.message);
            } else {
                Alert.alert('Erreur', 'Impossible de se connecter au serveur');
            }
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            <Image
                style={{ width: 300, height: 200, alignSelf: 'center' }}
                source={require('../../assets/images/svg/undraw_book-lover_f1dq.png')}
            />
            <Text style={styles.title}>Bienvenue à UPL-BookZone</Text>

            <View style={styles.inputContainer}>
                <Entypo name="v-card" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    keyboardType="default"
                    placeholder="Entrer votre matricule"
                    value={matricule}
                    onChangeText={setMatricule}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons name="security" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Entrer votre mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={() => Alert.alert('Mot de passe oublié', 'Fonction à implémenter')}>
                    <Text style={{ color: '#0065ff' }}>Oublié ?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.touchableButton1} onPress={handleSignIn}>
                <Text style={styles.touchableText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.touchableButton2}
                onPress={() => navigation.navigate('Inscription')}
            >
                <Text style={styles.textCenter}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('ConAdmin')}
            >
                <Text style={styles.textCenter1}>Connexion Admin</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 25,
    },
    input: {
        flex: 1,
        height: 40,
        color: '#000',
    },
    touchableButton1: {
        marginBottom: 30,
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#0065ff',
    },
    touchableText: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
    },
    touchableButton2: {
        marginBottom: 30,
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#fffb00',
    },
    textCenter: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
    },
    textCenter1: {
        textAlign: 'left',
        fontWeight: '700',
        fontSize: 16,
    },
});
