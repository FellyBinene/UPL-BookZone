import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import axios from 'axios';

const numColumns = 2; // Change à 3 si tu veux 3 livres par ligne
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / numColumns; // 16px padding * 2 + 8px margin entre cartes

const DisplayBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://172.30.26.20:4000/api/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Erreur de chargement des livres:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const renderItem = ({ item }) => {
        const isImage = item.fichier_type?.startsWith('image');
        const fileUrl = `http://172.30.26.20:4000/uploads/${isImage ? 'images' : 'files'}/${item.fichier_nom}`;
        const imageUrl = `http://172.30.26.20:4000/uploads/images/${item.image_nom}`;

        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => Linking.openURL(fileUrl)}>
                    <Image source={{ uri: imageUrl }} style={styles.cover} />
                </TouchableOpacity>

                <Text style={styles.title}>{item.titre}</Text>
                <Text><Text style={styles.label}>Auteur :</Text> {item.auteur}</Text>
                <Text><Text style={styles.label}>Genre :</Text> {item.genre}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text style={{ marginTop: 10 }}>Chargement des livres...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={books}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            numColumns={numColumns}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f3f4f6',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        width: cardWidth,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cover: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    label: {
        fontWeight: '600',
        color: '#374151',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DisplayBook;
