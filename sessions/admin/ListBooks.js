import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    ScrollView,
    ActivityIndicator,
    Linking,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { MaterialIcons, Feather, Entypo } from '@expo/vector-icons';

import useDeleteBook from '../../hooks/useDeleteBook';
import useEditBook from '../../hooks/useEditBook';
import useSearchBooks from '../../hooks/useSearchBooks';

const API_URL = 'http://192.168.101.89:4000/api/books';

const ListBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const loadBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setBooks(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const { handleDelete } = useDeleteBook(loadBooks);
    const {
        editFields,
        setEditFields,
        image,
        setImage,
        file,
        setFile,
        message,
        setMessage,
        pickImage,
        pickFile,
        submitEdit,
    } = useEditBook(selectedBook || {}, loadBooks, () => setModalVisible(false));

    const { search, setSearch, filterGenre, setFilterGenre, filteredBooks } = useSearchBooks(books);

    const handleEdit = (book) => {
        setSelectedBook(book);
        setEditFields({
            titre: book.titre,
            auteur: book.auteur,
            genre: book.genre,
            resume: book.resume,
        });
        setImage(null);
        setFile(null);
        setModalVisible(true);
    };

    const screenWidth = Dimensions.get('window').width;

    const renderHeader = () => (
        <View style={styles.headerRow}>
            {['#', 'Titre', 'Auteur', 'Genre', 'Résumé', 'Image', 'Fichier', 'Actions'].map((title, index) => (
                <Text key={index} style={styles.headerText}>{title}</Text>
            ))}
        </View>
    );

    const renderItem = ({ item, index }) => (
        <View style={[styles.dataRow, { backgroundColor: index % 2 === 0 ? '#eef2ff' : '#fff' }]}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.titre}</Text>
            <Text style={styles.cell}>{item.auteur}</Text>
            <Text style={styles.cell}>{item.genre}</Text>
            <Text style={[styles.cell, { width: 180 }]} numberOfLines={2}>{item.resume}</Text>
            <Image source={{ uri: `http://192.168.101.89:4000/uploads/images/${item.image_nom}` }} style={styles.image} />
            <TouchableOpacity
                onPress={() => Linking.openURL(`http://192.168.101.89:4000/uploads/${item.fichier_type.startsWith('image') ? 'images' : 'files'}/${item.fichier_nom}`)}>
                <Text style={styles.link}>Ouvrir</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                    <Feather name="edit" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    <MaterialIcons name="delete" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 100 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Administration des livres</Text>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Entypo name="magnifying-glass" size={20} color="black" style={styles.icon} />
                    <TextInput
                        placeholder="Rechercher par titre ou auteur"
                        placeholderTextColor="#999"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.input}
                    />
                </View>

                <View style={styles.searchBox}>
                    <Entypo name="folder" size={20} color="black" style={styles.icon} />
                    <TextInput
                        placeholder="Filtrer par genre"
                        placeholderTextColor="#999"
                        value={filterGenre}
                        onChangeText={setFilterGenre}
                        style={styles.input}
                    />
                </View>
            </View>

            {filteredBooks.length === 0 ? (
                <Text style={styles.empty}>Aucun livre disponible.</Text>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    <View style={{ minWidth: Math.max(screenWidth * 1.8, 900) }}>
                        {renderHeader()}
                        <FlatList data={filteredBooks} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
                    </View>
                </ScrollView>
            )}

            <Modal visible={modalVisible} animationType="slide">
                <ScrollView style={{ padding: 20 }}>
                    <Text style={styles.modalTitle}>Modifier le livre</Text>
                    {["titre", "auteur", "genre", "resume"].map((field) => (
                        <TextInput
                            key={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={editFields[field]}
                            onChangeText={(text) => setEditFields({ ...editFields, [field]: text })}
                            style={styles.modalInput}
                        />
                    ))}

                    <Button title="Choisir une nouvelle image" onPress={pickImage} />
                    <View style={{ height: 10 }} />
                    <Button title="Choisir un nouveau fichier" onPress={pickFile} />

                    <View style={styles.modalActions}>
                        <Button title="Annuler" onPress={() => setModalVisible(false)} />
                        <Button title="Enregistrer" onPress={submitEdit} color="#4f46e5" />
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>{message}</Text>
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e7eb', // gris clair moderne
        paddingVertical: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1f2937', // gris foncé
        marginBottom: 20,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: '#6b7280', // gris doux
        fontSize: 16,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#dbeafe',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginBottom: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    headerText: {
        width: 120,
        fontWeight: 'bold',
        color: '#1e3a8a', // bleu profond
        fontSize: 14,
    },
    dataRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 6,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cell: {
        width: 120,
        fontSize: 13.5,
        color: '#374151',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 10,
    },
    link: {
        color: '#2563eb',
        textDecorationLine: 'underline',
        width: 80,
        fontSize: 13,
    },
    actions: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 10,
        width: 110,
        gap: 6,
    },
    editBtn: {
        backgroundColor: '#fde68a',
        padding: 8,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    deleteBtn: {
        backgroundColor: '#f87171',
        padding: 8,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#111827',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        fontSize: 15,
        backgroundColor: '#fff',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});


export default ListBooks;