import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserProfile = ({ user }) => {
    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Aucune information utilisateur disponible</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil utilisateur</Text>
            <Text><Text style={styles.label}>Nom :</Text> {user.fullName}</Text>
            <Text><Text style={styles.label}>Email :</Text> {user.email}</Text>
            <Text><Text style={styles.label}>Téléphone :</Text> {user.phone}</Text>
            <Text><Text style={styles.label}>Date de naissance :</Text> {user.birthDate}</Text>
            <Text><Text style={styles.label}>Matricule :</Text> {user.matricule}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, backgroundColor: '#f3f4f6' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    profileBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    info: { fontSize: 16, marginBottom: 10 },
    label: { fontWeight: 'bold', color: '#333' },
    error: { fontSize: 18, color: '#dc2626', textAlign: 'center', marginTop: 50 },
});

export default UserProfile;
