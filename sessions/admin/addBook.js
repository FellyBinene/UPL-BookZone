import React, { useState } from 'react';
import {
    View, TextInput, Text, StyleSheet, Alert, ScrollView,
    TouchableOpacity, Image, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function AddBook() {
    const [titre, setTitre] = useState('');
    const [auteur, setAuteur] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [genre, setGenre] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const image = result.assets[0];
            setCoverImage({
                uri: image.uri,
                name: image.fileName || 'cover.jpg',
                type: 'image/jpeg',
            });
        }
    };

    const handlePDFPick = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

        if (result.type === 'success') {
            setPdfFile({
                uri: result.uri,
                name: result.name || 'fichier.pdf',
                type: 'application/pdf',
            });
        }
    };

    const handleSubmit = async () => {
        // Afficher en console ce que tu as sélectionné
        console.log('📦 Données à envoyer :', {
            titre, auteur, publicationDate, genre,
            coverImage, pdfFile
        });

        // Vérifications explicites
        if (!titre || !auteur || !publicationDate || !genre || !coverImage?.uri || !pdfFile?.uri) {
            Alert.alert('❌ Tous les champs sont obligatoires');
            return;
        }

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('auteur', auteur);
        formData.append('publication_date', publicationDate);
        formData.append('genre', genre);
        formData.append('cover_image', {
            uri: coverImage.uri,
            name: coverImage.name || 'cover.jpg',
            type: coverImage.type || 'image/jpeg',
        });
        formData.append('fichier', {
            uri: pdfFile.uri,
            name: pdfFile.name || 'livre.pdf',
            type: pdfFile.type || 'application/pdf',
        });

        try {
            const res = await fetch('http://localhost:3000/api/books/addBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            });

            const data = await res.json();
            console.log('✅ Réponse serveur :', data);

            if (data.success) {
                Alert.alert('✅ Livre ajouté avec succès');
                setTitre('');
                setAuteur('');
                setPublicationDate('');
                setGenre('');
                setCoverImage(null);
                setPdfFile(null);
            } else {
                Alert.alert('❌ Échec :', data.message || 'Erreur inconnue');
            }
        } catch (err) {
            console.error('❌ Erreur fetch :', err);
            Alert.alert('❌ Erreur lors de l’envoi au serveur');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ajouter un livre</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Titre</Text>
                <TextInput style={styles.input} value={titre} onChangeText={setTitre} placeholder="Ex: Le Petit Prince" />

                <Text style={styles.label}>Auteur</Text>
                <TextInput style={styles.input} value={auteur} onChangeText={setAuteur} placeholder="Ex: Antoine de Saint-Exupéry" />

                <Text style={styles.label}>Date de publication</Text>
                <TextInput style={styles.input} value={publicationDate} onChangeText={setPublicationDate} placeholder="YYYY-MM-DD" />

                <Text style={styles.label}>Genre</Text>
                <TextInput style={styles.input} value={genre} onChangeText={setGenre} placeholder="Ex: Roman" />

                <Text style={styles.label}>Image de couverture</Text>
                <TouchableOpacity style={styles.fileButton} onPress={handleImagePick}>
                    <Text style={styles.fileButtonText}>📷 Choisir une image</Text>
                </TouchableOpacity>
                {coverImage && <Text style={styles.filename}>✅ {coverImage.name}</Text>}
                {coverImage?.uri && <Image source={{ uri: coverImage.uri }} style={styles.previewImage} />}

                <Text style={styles.label}>Fichier PDF</Text>
                <TouchableOpacity style={styles.fileButton} onPress={handlePDFPick}>
                    <Text style={styles.fileButtonText}>📄 Choisir un PDF</Text>
                </TouchableOpacity>
                {pdfFile && <Text style={styles.filename}>✅ {pdfFile.name}</Text>}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>✅ Ajouter le livre</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f7fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: '#333',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    label: {
        fontWeight: '600',
        marginBottom: 6,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fafafa',
    },
    fileButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    fileButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '500',
    },
    previewImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginTop: 5,
        marginBottom: 15,
    },
    filename: {
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
