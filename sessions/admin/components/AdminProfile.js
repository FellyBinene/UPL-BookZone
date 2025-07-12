// sessions/admin/components/AdminProfile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminProfile = ({ admin }) => {
    if (!admin) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.error}>Aucune information administrateur disponible</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={80} color="#4f46e5" />
                <Text style={styles.title}>Profil Administrateur</Text>
            </View>

            <View style={styles.profileBox}>
                <Text style={styles.info}>
                    <Text style={styles.label}>Nom :</Text> {admin.fullName}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Email :</Text> {admin.email}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Téléphone :</Text> {admin.phone}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Matricule :</Text> {admin.matricule}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 75,
        // Important : étirer horizontalement pour remplir la largeur
        alignItems: 'stretch',
    },
    centerContent: {
        justifyContent: 'center',
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
        textAlign: 'center',
    },
    profileBox: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 50,
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
        fontSize : 20
    },
    error: {
        fontSize: 18,
        color: '#dc2626',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default AdminProfile;
