import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const EditUser = ({ route, navigation }) => {
    const { user } = route.params;

    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [matricule, setMatricule] = useState(user.matricule);
    const [password, setPassword] = useState(user.password || '');

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://192.168.17.89:4000/api/users/${user.id}`, {
                fullName,
                email,
                phone,
                matricule,
                password,
            });

            if (response.status === 200) {
                Alert.alert("Succès", "Utilisateur mis à jour");
                navigation.goBack(); // retourne à la liste
            } else {
                Alert.alert("Erreur", "Échec de la mise à jour");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur est survenue");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Modifier Utilisateur</Text>

            <TextInput style={styles.input} placeholder="Nom complet" value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Téléphone" value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="Matricule" value={matricule} onChangeText={setMatricule} />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}  // masque le texte
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Mettre à jour</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default EditUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
        fontSize: 16,
        paddingVertical: 8,
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
