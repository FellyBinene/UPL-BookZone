// hooks/useDeleteBook.js
import { Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://172.30.26.20:4000/api/books';

export default function useDeleteBook(onDeleted) {
    const handleDelete = (id) => {
        Alert.alert('Confirmation', 'Supprimer ce livre ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                onPress: async () => {
                    try {
                        await axios.delete(`${API_URL}/${id}`);
                        if (onDeleted) onDeleted();
                    } catch (err) {
                        console.error(err);
                        Alert.alert('Erreur', 'Erreur lors de la suppression.');
                    }
                },
            },
        ]);
    };

    return { handleDelete };
}
