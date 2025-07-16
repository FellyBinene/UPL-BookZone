import React, { useEffect, useState, useCallback } from 'react';
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
    RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, Feather, Entypo } from '@expo/vector-icons';

import useDeleteBook from '../../hooks/useDeleteBook';
import useEditBook from '../../hooks/useEditBook';
import useSearchBooks from '../../hooks/useSearchBooks';

const API_URL = 'http://192.168.136.89:4000/api/books';
const COLUMN_WIDTHS = {
    index: 40,
    titre: 140,
    auteur: 120,
    genre: 100,
    resume: 180,
    date: 120,
    image: 70,
    fichier: 80,
    actions: 110,
};

const ListBooks = () => {
    const [refreshing, setRefreshing] = useState(false);

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

    useFocusEffect(
        useCallback(() => {
            loadBooks();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBooks();
        setRefreshing(false);
    };

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
            date_publication: book.date_publication, // 👈 à ajouter
        });
        setImage(null);
        setFile(null);
        setModalVisible(true);
    };

    const screenWidth = Dimensions.get('window').width;

    const renderHeader = () => (
        <View style={styles.headerRow}>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.index }]}>#</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.titre }]}>Titre</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.auteur }]}>Auteur</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.genre }]}>Genre</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.resume }]}>Résumé</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.date }]}>Date</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.image }]}>Image</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.fichier }]}>Fichier</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.actions }]}>Actions</Text>
        </View>
    );

    const renderItem = ({ item, index }) => (
        <View style={[styles.dataRow, { backgroundColor: index % 2 === 0 ? '#eef2ff' : '#fff' }]}>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.index }]}>{index + 1}</Text>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.titre }]}>{item.titre}</Text>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.auteur }]}>{item.auteur}</Text>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.genre }]}>{item.genre}</Text>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.resume }]} numberOfLines={2}>{item.resume}</Text>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.date }]}>
                {item.date_publication
                    ? new Date(item.date_publication).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })
                    : 'N/A'}
            </Text>
            <View style={{ width: COLUMN_WIDTHS.image, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={{ uri: `http://192.168.136.89:4000/uploads/images/${item.image_nom}` }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={{ width: COLUMN_WIDTHS.fichier, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(`http://192.168.136.89:4000/uploads/${item.fichier_type.startsWith('image') ? 'images' : 'files'}/${item.fichier_nom}`)}
                >
                    <Text style={styles.link}>Ouvrir</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.actions, { width: COLUMN_WIDTHS.actions }]}>
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
            <Text style={styles.title}>Gestion livres</Text>

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
                <ScrollView horizontal showsHorizontalScrollIndicator={true} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    <View style={{ minWidth: Object.values(COLUMN_WIDTHS).reduce((a, b) => a + b, 0) }}>
                        {renderHeader()}
                        <FlatList
                            data={filteredBooks}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                        />
                    </View>
                </ScrollView>
            )}

            <Modal visible={modalVisible} animationType="slide">
                <ScrollView style={styles.modalWrapper} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* AJOUT BOUTON RETOUR ICI */}
                    <View style={styles.backContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backBtn}>
                            <MaterialIcons name="arrow-back" size={28} color="#2563eb" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Modifier le livre</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Titre</Text>
                        <TextInput
                            placeholder="Titre du livre"
                            value={editFields.titre}
                            onChangeText={(text) => setEditFields({ ...editFields, titre: text })}
                            style={styles.modalInput}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Auteur</Text>
                        <TextInput
                            placeholder="Nom de l'auteur"
                            value={editFields.auteur}
                            onChangeText={(text) => setEditFields({ ...editFields, auteur: text })}
                            style={styles.modalInput}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Genre</Text>
                        <TextInput
                            placeholder="Genre du livre"
                            value={editFields.genre}
                            onChangeText={(text) => setEditFields({ ...editFields, genre: text })}
                            style={styles.modalInput}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Résumé</Text>
                        <TextInput
                            placeholder="Résumé du livre"
                            value={editFields.resume}
                            onChangeText={(text) => setEditFields({ ...editFields, resume: text })}
                            style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                            multiline
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Date de publication</Text>
                        <TextInput
                            placeholder="AAAA-MM-JJ"
                            value={editFields.date_publication}
                            onChangeText={(text) => setEditFields({ ...editFields, date_publication: text })}
                            style={styles.modalInput}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Button title="Choisir une nouvelle image" onPress={pickImage} color="#4f46e5" />
                    </View>

                    <View style={styles.formGroup}>
                        <Button title="Choisir un nouveau fichier" onPress={pickFile} color="#4f46e5" />
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={submitEdit}>
                            <Text style={styles.saveText}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>

                    {message ? <Text style={styles.feedback}>{message}</Text> : null}
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
    backContainer: {
        marginBottom: 20,
        justifyContent: "space-between",
        alignItems: "center",
        // Optionnel pour ombre
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
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
        fontWeight: 'bold',
        color: '#1e3a8a',
        fontSize: 14,
        paddingHorizontal: 6,
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
        fontSize: 13.5,
        color: '#374151',
        paddingHorizontal: 6,
        overflow: 'hidden',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    link: {
        color: '#2563eb',
        textDecorationLine: 'underline',
        fontSize: 13,
    },
    actions: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 10,
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
        fontSize: 30,
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
    modalWrapper: {
        padding: 20,
        backgroundColor: '#f9fafb',
    },

    formGroup: {
        marginBottom: 16,
    },

    label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#374151',
    },

    cancelBtn: {
        backgroundColor: '#e5e7eb',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },

    cancelText: {
        color: '#1f2937',
        fontWeight: 'bold',
    },

    saveBtn: {
        backgroundColor: '#4f46e5',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
    },

    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    feedback: {
        textAlign: 'center',
        color: '#10b981',
        marginTop: 15,
        fontWeight: '600',
    },
});


export default ListBooks;