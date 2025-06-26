import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const Accueil = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://192.168.143.89:3000/api/users');
            setUsers(response.data);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de récupérer les utilisateurs');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Téléphone: {item.phone}</Text>
            <Text>Matricule: {item.matricule}</Text>
            <Text>Date de naissance: {item.birthDate}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste des utilisateurs</Text>
            <FlatList
                data={users}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text>Aucun utilisateur trouvé</Text>}
            />
        </View>
    );
};

export default Accueil;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15,
    },
    userContainer: {
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 5,
    },
});
