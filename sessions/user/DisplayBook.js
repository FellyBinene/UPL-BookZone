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
    TextInput,
} from 'react-native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const spacing = 8;
const cardWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

const DisplayBook = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://192.168.101.89:4000/api/books');
            setBooks(response.data);
            setFilteredBooks(response.data);
        } catch (error) {
            console.error('Erreur de chargement des livres:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = books.filter((book) =>
            book.titre.toLowerCase().includes(text.toLowerCase()) ||
            book.auteur.toLowerCase().includes(text.toLowerCase()) ||
            book.genre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredBooks(filtered);
    };

    const renderItem = ({ item, index }) => {
        const isImage = item.fichier_type?.startsWith('image');
        const fileUrl = `http://192.168.101.89:4000/uploads/${isImage ? 'images' : 'files'}/${item.fichier_nom}`;
        const imageUrl = `http://192.168.101.89:4000/uploads/images/${item.image_nom}`;

        return (
            <Animatable.View
                animation="fadeInUp"
                delay={index * 100}
                duration={500}
                useNativeDriver
                style={styles.cardWrapper}
            >
                <TouchableOpacity onPress={() => Linking.openURL(fileUrl)} activeOpacity={0.9} style={styles.card}>
                    <Image source={{ uri: imageUrl }} style={styles.cover} />
                    <Text style={styles.title}>{item.titre}</Text>
                    <Text><Text style={styles.label}>Auteur :</Text> {item.auteur}</Text>
                    <Text><Text style={styles.label}>Genre :</Text> {item.genre}</Text>
                </TouchableOpacity>
            </Animatable.View>
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
        <View style={{ flex: 1, backgroundColor: '#f3f4f6', width:350 }}>
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un livre, un auteur ou un genre..."
                value={searchText}
                onChangeText={handleSearch}
                placeholderTextColor="#999"
            />

            <FlatList
                data={filteredBooks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
                numColumns={numColumns}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing,
        paddingBottom: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 12,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16,
        color: '#000',
    },
    cardWrapper: {
        width: cardWidth,
        minHeight: 260, // <- assure que chaque carte garde une hauteur cohérente
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        margin: 5
    },
    cover: {
        width: '100%',
        height: 140, // fixe
        borderRadius: 10,
        marginBottom: 10,
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
        paddingTop: 100,
    },
});

export default DisplayBook;
