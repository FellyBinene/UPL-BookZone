import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from 'react-native-vector-icons/Entypo';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';

const SignInScreen = ({ navigation }) => {
    const [birthDate, setBirthDate] = useState(new Date());
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const showDatePicker = () => {
        Alert.alert(
            "Information",
            "Veuillez choisir votre date de naissance.",
            [
                {
                    text: "Continuer",
                    onPress: () => {
                        DateTimePickerAndroid.open({
                            value: birthDate,
                            onChange: (event, selectedDate) => {
                                const currentDate = selectedDate || birthDate;
                                setBirthDate(currentDate);
                            },
                            mode: 'date',
                            is24Hour: true,
                        });
                    }
                }
            ]
        );
    };

    const handleSignUp = async () => {
        if (email && fullName && phone && matricule && password && confirmPassword) {
            if (password !== confirmPassword) {
                Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
                return;
            }

            try {
                const response = await axios.post('http://172.30.26.20:4000/api/users', {
                    email,
                    fullName,
                    birthDate: birthDate.toISOString().split('T')[0],
                    phone,
                    matricule,
                    password,
                });

                if (response.status === 201) {
                    Alert.alert('Succès', 'Inscription réussie');
                    navigation.navigate('Connexion');
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
            <Text style={styles.title}>S'inscrire</Text>

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
                <Entypo name="calendar" size={20} color="#666" style={{ marginRight: 5 }} />
                <TouchableOpacity onPress={showDatePicker} style={{ flex: 1, paddingBottom: 5 }}>
                    <Text style={{ marginBottom: 5, color: '#555' }}>
                        Date de naissance :
                    </Text>
                    <Text style={{ color: '#333' }}>
                        {birthDate.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
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
                <Entypo name="phone" size={20} color="#666" style={{ marginRight: 5 }} />
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

            <TouchableOpacity style={styles.touchableButton1} onPress={handleSignUp}>
                <Text style={styles.touchableText}>M'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.touchableButton2}
                onPress={() => navigation.navigate('Connexion')}
            >
                <Text style={styles.textCenter}>Se connecter</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignInScreen;

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
        marginBottom: 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 25
    },
    input: {
        flex: 1,
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
    }
});