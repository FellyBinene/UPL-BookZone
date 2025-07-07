import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    FlatList,
    ScrollView,
} from 'react-native';

const TableHeader = () => (
    <View style={[styles.row, styles.header]}>
        {['ID', 'Email', 'Full Name', 'Birth Date', 'Phone', 'Matricule', 'Created At'].map((title) => (
            <Text key={title} style={[styles.cell, styles.bold]}>{title}</Text>
        ))}
    </View>
);

const UserRow = ({ user }) => (
    <View style={styles.row}>
        <Text style={styles.cell}>{user.id}</Text>
        <Text style={styles.cell}>{user.email}</Text>
        <Text style={styles.cell}>{user.fullName}</Text>
        <Text style={styles.cell}>{user.birthDate}</Text>
        <Text style={styles.cell}>{user.phone}</Text>
        <Text style={styles.cell}>{user.matricule}</Text>
        <Text style={styles.cell}>{user.created_at}</Text>
    </View>
);

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://172.30.26.20:4000/api/recup-users')
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Erreur chargement :', err);
                setError(err.message || 'Impossible de récupérer les utilisateurs.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>📋 Liste des utilisateurs</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <ScrollView horizontal style={styles.tableWrapper}>
                <View>
                    <TableHeader />
                    {users.length === 0 ? (
                        <Text style={styles.emptyText}>Aucun utilisateur trouvé.</Text>
                    ) : (
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <UserRow user={item} />}
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
        backgroundColor: '#f9fafe',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: '#333',
    },
    tableWrapper: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 10,
    },
    header: {
        backgroundColor: '#f0f4ff',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    cell: {
        width: 140,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#444',
    },
    bold: {
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#d9534f',
        textAlign: 'center',
        marginVertical: 10,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#999',
        fontSize: 16,
    },
});

export default ListUsers;