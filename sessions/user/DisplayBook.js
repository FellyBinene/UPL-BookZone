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
    RefreshControl,   // <-- import RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

const spacing = 8;

const DisplayBook = () => {
    const navigation = useNavigation();

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);  // <-- état refreshing

    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [numColumns, setNumColumns] = useState(2);
    const [cardWidth, setCardWidth] = useState(0);

    const adjustLayout = (width) => {
        let columns = 2;
        if (width >= 900) columns = 4;
        else if (width >= 600) columns = 3;
        else columns = 2;

        const cWidth = (width - spacing * (columns + 1)) / columns;
        setNumColumns(columns);
        setCardWidth(cWidth);
    };

    useEffect(() => {
        adjustLayout(screenWidth);

        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
            adjustLayout(window.width);
        });

        return () => subscription?.remove();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://192.168.136.89:4000/api/books');
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

    // Fonction appelée lors du pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get('http://192.168.136.89:4000/api/books');
            setBooks(response.data);
            // Appliquer le filtre de recherche existant après rafraîchissement
            if (searchText.trim() === '') {
                setFilteredBooks(response.data);
            } else {
                const filtered = response.data.filter((book) =>
                    book.titre.toLowerCase().includes(searchText.toLowerCase()) ||
                    book.auteur.toLowerCase().includes(searchText.toLowerCase()) ||
                    book.genre.toLowerCase().includes(searchText.toLowerCase()) ||
                    (book.date_publication && book.date_publication.includes(searchText))
                );
                setFilteredBooks(filtered);
            }
        } catch (error) {
            console.error('Erreur rafraîchissement:', error);
        }
        setRefreshing(false);
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = books.filter((book) =>
            book.titre.toLowerCase().includes(text.toLowerCase()) ||
            book.auteur.toLowerCase().includes(text.toLowerCase()) ||
            book.genre.toLowerCase().includes(text.toLowerCase()) ||
            (book.date_publication && book.date_publication.includes(text))
        );
        setFilteredBooks(filtered);
    };

    const renderItem = ({ item, index }) => {
        const isImage = item.fichier_type?.startsWith('image');
        const fileUrl = `http://192.168.136.89:4000/uploads/${isImage ? 'images' : 'files'}/${item.fichier_nom}`;
        const imageUrl = `http://192.168.136.89:4000/uploads/images/${item.image_nom}`;

        return (
            <Animatable.View
                animation="fadeInUp"
                delay={index * 100}
                duration={500}
                useNativeDriver
                style={[styles.cardWrapper, { width: cardWidth }]}
            >
                <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { book: item })} activeOpacity={0.9} style={styles.card}>
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
        <View style={{ flex: 1, backgroundColor: '#f3f4f6', width: '100%' }}>
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
                style={{ flex: 1 }}
                contentContainerStyle={styles.container}
                numColumns={numColumns}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
        minHeight: 260,
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
        margin: 5,
    },
    cover: {
        width: '100%',
        height: 140,
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
