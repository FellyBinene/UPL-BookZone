// hooks/useEditBook.js
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = 'http://192.168.136.89:4000/api/books';

export default function useEditBook(selectedBook, loadBooks, closeModal) {
    const [editFields, setEditFields] = useState({
        titre: '',
        auteur: '',
        genre: '',
        resume: '',
        date_publication: ''
    });
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) setImage(result.assets[0]);
    };

    const pickFile = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
        if (!result.canceled) setFile(result);
    };

    const submitEdit = async () => {
        const formData = new FormData();

        formData.append('titre', editFields.titre.trim());
        formData.append('auteur', editFields.auteur.trim());
        formData.append('genre', editFields.genre.trim());
        formData.append('resume', editFields.resume.trim());

        const formattedDate = editFields.date_publication
            ? new Date(editFields.date_publication).toISOString().split('T')[0]
            : '';
        formData.append('date_publication', formattedDate);

        if (image) {
            formData.append('image', {
                uri: image.uri,
                name: 'cover.jpg',
                type: 'image/jpeg',
            });
        }

        if (file) {
            const type = file.mimeType || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
            formData.append('fichier', {
                uri: file.uri,
                name: file.name,
                type,
            });
        }

        try {
            const res = await axios.put(`${API_URL}/${selectedBook.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                setMessage('✅ Modifié.');
                loadBooks();
                setTimeout(() => {
                    setMessage('');
                    closeModal();
                }, 1000);
            } else {
                setMessage('❌ ' + (res.data.message || 'Erreur'));
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Erreur serveur.');
        }
    };

    return {
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
    };
}
