import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const NotificationScreen = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get('http://192.168.101.89:4000/api/books/notifications');
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
            <Text>Résumé : {item.resume}</Text>
        </View>
    );

    return (
        <FlatList
            data={books}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
        />
    );
};

const styles = StyleSheet.create({
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
