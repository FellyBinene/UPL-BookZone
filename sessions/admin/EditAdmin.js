import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';

const EditAdmin = ({ route, navigation }) => {
    const { user } = route.params;

    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [matricule, setMatricule] = useState(user.matricule);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(user.password || '');

    const handleUpdate = () => {
        if (!email || !fullName || !phone || !matricule) {
            Alert.alert("Erreur", "Tous les champs doivent être remplis.");
            return;
        }

        setLoading(true);

        fetch(`http://192.168.17.89:4000/api/admins/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                phone,
                matricule,
                password,
            }),
        })
            .then(response => {
                setLoading(false);
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Erreur serveur : ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                Alert.alert("Succès", "Administrateur modifié avec succès !");
                navigation.goBack();
            })
            .catch(error => {
                setLoading(false);
                console.error("Erreur lors de la mise à jour :", error);
                Alert.alert("Erreur", error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modifier Administrateur</Text>

            <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nom complet"
                style={styles.input}
            />
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Téléphone"
                keyboardType="phone-pad"
                style={styles.input}
            />
            <TextInput
                value={matricule}
                onChangeText={setMatricule}
                placeholder="Matricule"
                keyboardType="number-pad"
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                secureTextEntry={true}
                style={styles.input}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
            ) : (
                <Button title="Mettre à jour" onPress={handleUpdate} color="#2563eb" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#1f2937',
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#f9fafb',
    },
});

export default EditAdmin;
