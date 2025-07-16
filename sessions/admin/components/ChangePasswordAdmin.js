import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChangePasswordAdmin = ({ route, navigation }) => {
    const { matricule } = route.params;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return Alert.alert("Erreur", "Tous les champs sont obligatoires.");
        }

        if (newPassword !== confirmPassword) {
            return Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
        }

        try {
            const response = await fetch(`http://192.168.136.89:4000/api/admins/password/${matricule}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error("Erreur du serveur : " + text);
            }

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la mise à jour");
            }

            Alert.alert("Succès", "Mot de passe modifié avec succès.");
            navigation.replace('Home', { user: { matricule } });
        } catch (error) {
            Alert.alert("Erreur", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Bouton retour */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={26} color="#2563eb" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Changer le mot de passe</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.inner}>
                    <TextInput
                        placeholder="Mot de passe actuel"
                        style={styles.input}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        placeholder="Nouveau mot de passe"
                        style={styles.input}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        placeholder="Confirmer le mot de passe"
                        style={styles.input}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                        <Text style={styles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#e0e7ff',
        borderBottomWidth: 1,
        borderColor: '#c7d2fe',
        marginTop : 30
    },
    backBtn: {
        marginRight: 12,
        padding: 6,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    inner: {
        padding: 20,
        justifyContent: 'center',
        flexGrow: 1,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        borderColor: '#d1d5db',
        borderWidth: 1,
        fontSize: 16,
        marginBottom: 16,
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
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ChangePasswordAdmin;
