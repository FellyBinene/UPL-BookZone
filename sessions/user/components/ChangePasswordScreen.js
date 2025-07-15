import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ChangePasswordScreen = ({ route, navigation }) => {
    const { matricule } = route.params;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            return Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
        }

        try {
            const response = await fetch(`http://192.168.17.89:4000/api/users/password/${matricule}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error("Le serveur n’a pas renvoyé du JSON. Réponse brute : " + text);
            }

            if (!response.ok) throw new Error(data.message || "Erreur lors de la mise à jour");

            // Recharger l'utilisateur à jour
            const userResponse = await fetch(`http://192.168.17.89:4000/api/users/users/${matricule}`);
            const userData = await userResponse.json();

            if (!userResponse.ok) throw new Error(userData.message || "Impossible de charger l'utilisateur");

            Alert.alert("Succès", "Mot de passe modifié.", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate('HomeUsers', { user: userData }),
                },
            ]);
        } catch (error) {
            Alert.alert("Erreur", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modifier le mot de passe</Text>

            <TextInput
                style={styles.input}
                placeholder="Mot de passe actuel"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4f46e5',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChangePasswordScreen;
