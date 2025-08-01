import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from 'react-native-vector-icons/Entypo';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const AdminSignIn = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (email && fullName && phone && matricule && password && confirmPassword) {
            if (password !== confirmPassword) {
                Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
                return;
            }

            try {
                const response = await axios.post('http://192.168.136.89:4000/api/admins', {
                    email,
                    fullName,
                    phone,
                    matricule,
                    password,
                });

                if (response.status === 201) {
                    Alert.alert('Succès', 'Inscription réussie');
                    navigation.navigate('Home');
                }
            } catch (error) {
                console.error('Erreur axios :', error);
                if (error.response) {
                    Alert.alert('Erreur', `Erreur API : ${error.response.data.message}`);
                } else {
                    Alert.alert('Erreur', 'Erreur de connexion au serveur');
                }
            }
        } else {
            Alert.alert('Champs manquants', 'Veuillez remplir tous les champs');
        }
    };

    return (
        <SafeAreaView style={styles.root}>

            {/* Bouton Retour seul en haut */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={26} color="#2563eb" />
                </TouchableOpacity>
            </View>

            {/* Titre avec icône dans le formulaire */}
            <View style={styles.formTitleContainer}>
                <Entypo name="add-user" size={26} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ajout Admin</Text>
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="add-user" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Entrer votre nom complet"
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="phone" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Entrer votre contact"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="email" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Entrer votre email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="v-card" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Entrer votre matricule"
                    keyboardType="phone-pad"
                    value={matricule}
                    onChangeText={setMatricule}
                />
            </View>

            <View style={styles.inputContainer}>
                <EvilIcons name="lock" size={30} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Entrer votre mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <View style={styles.inputContainer}>
                <EvilIcons name="lock" size={30} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmer votre mot de passe"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>

            <TouchableOpacity style={styles.touchableButton2} onPress={handleSignUp}>
                <Text style={styles.textCenter}>M'inscrire</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

export default AdminSignIn;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: 'white',
    },
    header: {
        paddingTop: 10,
        paddingBottom: 5,
    },
    backBtn: {
        padding: 6,
        backgroundColor: '#e0e7ff',
        borderRadius: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    formTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
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
        fontSize: 16,
    },
    touchableButton2: {
        marginTop: 20,
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
});
