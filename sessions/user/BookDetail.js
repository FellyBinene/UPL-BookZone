import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    Dimensions,
    ScrollView,
    SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const BookDetail = ({ route }) => {
    const { book } = route.params;

    const isImage = book.fichier_type?.startsWith('image');
    const fileUrl = `http://192.168.17.89:4000/uploads/${isImage ? 'images' : 'files'}/${book.fichier_nom}`;
    const imageUrl = `http://192.168.17.89:4000/uploads/images/${book.image_nom}`;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />

                <Text style={styles.title}>{book.titre}</Text>

                <Text style={styles.info}><Text style={styles.label}>Auteur :</Text> {book.auteur || 'Non spécifié'}</Text>
                <Text style={styles.info}><Text style={styles.label}>Genre :</Text> {book.genre || 'Non spécifié'}</Text>
                <Text style={styles.info}><Text style={styles.label}>ISBN :</Text> {book.isbn || 'Non spécifié'}</Text>
                <Text style={styles.info}><Text style={styles.label}>Date de publication :</Text> {book.date_publication || 'Non spécifiée'}</Text>
                <Text style={styles.info}><Text style={styles.label}>Résumé :</Text> {book.resume || 'Aucun résumé fourni.'}</Text>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(fileUrl)}>
                    <Text style={styles.buttonText}>Lire / Ouvrir</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default BookDetail;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Pour laisser de l’espace au bouton en bas
        alignItems: 'center',
    },
    image: {
        width: width * 0.95,
        height: height * 0.4, // occupe 40% de l'écran
        borderRadius: 12,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    info: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 8,
        width: '100%',
    },
    label: {
        fontWeight: '600',
        color: '#111827',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#f9fafb',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    button: {
        backgroundColor: '#4f46e5',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
