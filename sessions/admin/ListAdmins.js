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
    Alert,
} from 'react-native';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';

const TableHeader = () => (
    <View style={[styles.row, styles.header]}>
        {['ID', 'Email', 'Full Name', 'Phone', 'Matricule', 'Created At', 'Actions'].map((title) => (
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

const ListAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('http://192.168.101.89:4000/api/recup-admins')
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
    }, []);

    const filteredAdmins = admins.filter((a) =>
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.fullName.toLowerCase().includes(search.toLowerCase()) ||
        a.matricule.toLowerCase().includes(search.toLowerCase())
    );

    // Callbacks à compléter selon ta logique
    const handleAdd = () => Alert.alert('Ajouter', 'Fonction Ajouter à implémenter');
    const handleEdit = (user) => Alert.alert('Modifier', `Modifier l’utilisateur ${user.fullName}`);
    const handleDelete = (id) => Alert.alert('Supprimer', `Supprimer l’utilisateur ID ${id}?`);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>🛡️ Liste des administrateurs</Text>
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
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Feather name="plus-circle" size={28} color="#2563eb" />
                    <Text style={styles.addBtnText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal style={styles.tableWrapper} contentContainerStyle={{ paddingVertical: 8 }}>
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
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1f2937',
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
