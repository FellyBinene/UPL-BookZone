import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    FlatList,
    ScrollView,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const TableHeader = () => (
    <View style={[styles.row, styles.header]}>
        {['ID', 'Email', 'Full Name', 'Phone', 'Matricule', 'Password', 'Created At', 'Actions'].map((title) => (
            <Text key={title} style={[styles.cell, styles.bold, title === 'Actions' && { width: 120 }]}>
                {title}
            </Text>
        ))}
    </View>
);

const AdminRow = ({ user, index, onEdit, onDelete }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
        <Text style={styles.cell}>{user.id}</Text>
        <Text style={styles.cell}>{user.email}</Text>
        <Text style={styles.cell}>{user.fullName}</Text>
        <Text style={styles.cell}>{user.phone}</Text>
        <Text style={styles.cell}>{user.matricule}</Text>
        <Text style={styles.cell}>{user.password}</Text>
        <Text style={styles.cell}>{user.created_at}</Text>

        <View style={[styles.cell, styles.actionsCell]}>
            <TouchableOpacity onPress={() => onEdit(user)} style={styles.actionBtn}>
                <Feather name="edit" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(user.id)} style={styles.actionBtn}>
                <MaterialIcons name="delete" size={20} color="#dc2626" />
            </TouchableOpacity>
        </View>
    </View>
);

const ListAdmins = ({ goToUsersChoice }) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const loadAdmins = () => {
        setLoading(true);
        fetch('http://192.168.136.89:4000/api/recup-admins')
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setAdmins(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Erreur chargement :', err);
                setError(err.message || 'Impossible de récupérer les administrateurs.');
                setLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            loadAdmins(); // recharge quand on revient sur l'écran
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadAdmins(); // recharge les données
        setTimeout(() => {
            setRefreshing(false);
        }, 1000); // facultatif, pour effet visuel
    };

    const filteredAdmins = admins.filter((a) =>
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.fullName.toLowerCase().includes(search.toLowerCase()) ||
        a.matricule.toLowerCase().includes(search.toLowerCase())
    );

    // Callbacks à compléter selon ta logique
    const handleEdit = (user) => {
        navigation.navigate('EditAdmin', { user });
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmation',
            'Voulez-vous vraiment supprimer cet administrateur ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        fetch(`http://192.168.136.89:4000/api/admins/${id}`, {
                            method: 'DELETE',
                        })
                            .then((res) => {
                                if (!res.ok) throw new Error('Erreur lors de la suppression');
                                return res.json();
                            })
                            .then((data) => {
                                Alert.alert('Succès', data.message);
                                loadAdmins(); // Rafraîchir la liste
                            })
                            .catch((err) => {
                                console.error('Erreur suppression :', err);
                                Alert.alert('Erreur', err.message || 'Impossible de supprimer');
                            });
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} >
            {/* HEADER avec bouton retour */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (goToUsersChoice) {
                            goToUsersChoice(); // revenir à l’écran UsersChoice depuis HomeScreen
                        } else if (navigation.canGoBack()) {
                            navigation.goBack(); // sinon revenir normalement
                        } else {
                            navigation.navigate('HomeScreen'); // fallback ultime
                        }
                    }}
                    style={styles.backBtn}
                >
                    <MaterialIcons name="arrow-back" size={28} color="#2563eb" />
                </TouchableOpacity>

                <Text style={styles.title}>Liste Admins</Text>


            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* 🔍 Barre de recherche */}
            <View style={styles.searchBar}>
                <Entypo name="magnifying-glass" size={20} color="#000" style={styles.icon} />
                <TextInput
                    placeholder="Rechercher (email, nom, matricule)..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* Bouton Ajouter */}
            <View style={styles.addBtnContainer}>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('InsAdmin')}>
                    <Feather name="plus-circle" size={28} color="#2563eb" />
                    <Text style={styles.addBtnText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal style={styles.tableWrapper} contentContainerStyle={{ paddingVertical: 8 }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <View>
                    <TableHeader />
                    {filteredAdmins.length === 0 ? (
                        <Text style={styles.emptyText}>Aucun administrateur trouvé.</Text>
                    ) : (
                        <FlatList
                            data={filteredAdmins}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <AdminRow
                                    user={item}
                                    index={index}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                            style={{ maxHeight: 600 }}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#e5e7eb',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    backBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#e0e7ff',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        width: 40,        // largeur fixe pour bouton (et espace à droite)
        height: 40,       // hauteur fixe pour bouton (et espace à droite)
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    title: {
        flex: 1,
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1f2937',
        marginBottom: 0,
        marginRight: '10%'// enlever marginBottom car on est dans header container
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    icon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    addBtnContainer: {
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    addBtnText: {
        marginLeft: 8,
        color: '#2563eb',
        fontWeight: '600',
        fontSize: 16,
    },
    tableWrapper: {
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 8,
        paddingVertical: 8,
        paddingHorizontal: 6,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 6,
    },
    header: {
        backgroundColor: '#dbeafe',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    cell: {
        width: 140,
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
        paddingHorizontal: 8,
    },
    bold: {
        fontWeight: 'bold',
        color: '#1e40af',
    },
    evenRow: {
        backgroundColor: '#f9fafb',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    oddRow: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    actionsCell: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 12,
        width: 120,
        paddingHorizontal: 0,
    },
    actionBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#d9534f',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        padding: 24,
        color: '#6b7280',
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default ListAdmins;
