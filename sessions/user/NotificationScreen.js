import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';

const NotificationScreen = ({ navigation }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get('http://192.168.136.89:4000/api/books/notifications');
                if (res.data.success) {
                    setBooks(res.data.notifications);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotifications();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.titre}</Text>
            <Text>Auteur : {item.auteur}</Text>
            <Text>Genre : {item.genre}</Text>
            <Text>Date de publication : {item.date_publication ? new Date(item.date_publication).toLocaleDateString('fr-FR')
                : 'Non spécifiée'}</Text>
            <Text>Résumé : {item.resume}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Entypo name="chevron-left" size={28} color="#4f46e5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <FlatList
                data={books}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
});

export default NotificationScreen;
