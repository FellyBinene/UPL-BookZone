import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from 'react-native-vector-icons/Entypo';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';

const AddUsers = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());

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
                                if (selectedDate) {
                                    setBirthDate(selectedDate);
                                }
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
                const response = await axios.post('http://192.168.17.89:4000/api/users', {
                    email,
                    fullName,
                    phone,
                    matricule,
                    birthDate: birthDate.toISOString().split('T')[0],
                    password,
                });

                if (response.status === 201) {
                    Alert.alert('Succès', 'Utilisateur ajouté avec succès');
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
            <View style={styles.inputContainer}>
                <Entypo name={"add-user"} size={26} color="#000"  style={{ marginRight:5 }}/>
                <Text style={styles.title}>Ajout User</Text>
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="add-user" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Nom complet"
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="calendar" size={20} color="#666" style={{ marginRight: 5 }} />
                <TouchableOpacity onPress={showDatePicker} style={{ flex: 1 }}>
                    <Text style={{ marginBottom: 5, color: '#555' }}>Date de naissance :</Text>
                    <Text style={{ color: '#333' }}>{birthDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="phone" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Téléphone"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="email" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="v-card" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Matricule"
                    keyboardType="numeric"
                    value={matricule}
                    onChangeText={setMatricule}
                />
            </View>

            <View style={styles.inputContainer}>
                <EvilIcons name="lock" size={30} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <View style={styles.inputContainer}>
                <EvilIcons name="lock" size={30} color="#666" style={{ marginRight: 5 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmer mot de passe"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>

            <TouchableOpacity style={styles.touchableButton1} onPress={handleSignUp}>
                <Text style={styles.touchableText}>Ajouter</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default AddUsers;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,

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
    touchableButton1: {
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    touchableText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
