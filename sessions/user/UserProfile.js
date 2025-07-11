import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = ({ user }) => {
    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Aucune information utilisateur disponible</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={80} color="#4f46e5" />
                <Text style={styles.title}>Profil utilisateur</Text>
            </View>

            <View style={styles.profileBox}>
                <Text style={styles.info}>
                    <Text style={styles.label}>Nom :</Text> {user.fullName}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Email :</Text> {user.email}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Téléphone :</Text> {user.phone}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Date de naissance :</Text> {user.birthDate}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Matricule :</Text> {user.matricule}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 20,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 8,
    },
    profileBox: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    info: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        color: '#4b5563',
    },
    error: {
        fontSize: 18,
        color: '#dc2626',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default UserProfile;
