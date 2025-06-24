import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Accueil = ({ route }) => {
    // Sécuriser l'accès aux données utilisateur
    const user = route?.params?.user;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Bienvenue 👋</Text>
            {user ? (
                <>
                    <Text style={styles.text}>Nom : {user.fullName}</Text>
                    <Text style={styles.text}>Email : {user.email}</Text>
                    <Text style={styles.text}>Matricule : {user.matricule}</Text>
                </>
            ) : (
                <Text style={styles.text}>Aucune donnée utilisateur reçue.</Text>
            )}
        </SafeAreaView>
    );
};

export default Accueil;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
});
