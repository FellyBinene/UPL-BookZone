import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = ({ user, onLogout, onChangePassword }) => {
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
                <Text style={styles.info}><Text style={styles.label}>Nom :</Text> {user.fullName}</Text>
                <Text style={styles.info}><Text style={styles.label}>Email :</Text> {user.email}</Text>
                <Text style={styles.info}><Text style={styles.label}>Téléphone :</Text> {user.phone}</Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Date de naissance :</Text>{' '}
                    {user.birthDate ? new Date(user.birthDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                </Text>
                <Text style={styles.info}><Text style={styles.label}>Matricule :</Text> {user.matricule}</Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.btn} onPress={onChangePassword}>
                    <Ionicons name="lock-closed-outline" size={20} color="#2563eb" />
                    <Text style={styles.btnText}>Modifier mot de passe</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, styles.logoutBtn]} onPress={onLogout}>
                    <Ionicons name="exit-outline" size={20} color="#dc2626" />
                    <Text style={[styles.btnText, { color: '#dc2626' }]}>Déconnexion</Text>
                </TouchableOpacity>
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
        width: "100%"
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
    buttonGroup: {
        marginTop: 30,
        width: '60%',
        gap: 12,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e7ff',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'center',
    },
    logoutBtn: {
        backgroundColor: '#fee2e2',
    },
    btnText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#2563eb',
        fontWeight: '600',
    },
});

export default UserProfile;
