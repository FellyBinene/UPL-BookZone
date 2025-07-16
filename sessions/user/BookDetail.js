import React, { useState, useCallback } from 'react';
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
    RefreshControl,  // <-- import RefreshControl
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const BookDetail = ({ route, navigation }) => {
    const { book } = route.params;

    const [refreshing, setRefreshing] = useState(false);

    const isImage = book.fichier_type?.startsWith('image');
    const fileUrl = `http://192.168.136.89:4000/uploads/${isImage ? 'images' : 'files'}/${book.fichier_nom}`;
    const imageUrl = `http://192.168.136.89:4000/uploads/images/${book.image_nom}`;

    // Fonction de refresh, ici on simule juste un délai (à adapter si fetch réel)
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simule un délai pour refresh, ou refetch les données du livre si API
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />

                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Entypo name="chevron-left" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>{book.titre}</Text>

                <Text style={styles.info}><Text style={styles.label}>Auteur :</Text> {book.auteur || 'Non spécifié'}</Text>
                <Text style={styles.info}><Text style={styles.label}>Genre :</Text> {book.genre || 'Non spécifié'}</Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Date de publication :</Text>{' '}
                    {book.date_publication
                        ? new Date(book.date_publication).toLocaleDateString()
                        : 'Non spécifiée'}
                </Text>
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
        paddingBottom: 100,
        alignItems: 'center',
    },
    imageWrapper: {
        position: 'relative',
        width: width * 0.95,
        height: height * 0.4,
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    backBtn: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
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
