import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const EditAdmin = ({ route, navigation }) => {
    const { user } = route.params;

    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [matricule, setMatricule] = useState(user.matricule);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(user.password || '');

    const handleUpdate = () => {
        if (!email || !fullName || !phone || !matricule) {
            Alert.alert("Erreur", "Tous les champs doivent être remplis.");
            return;
        }

        setLoading(true);

        fetch(`http://192.168.136.89:4000/api/admins/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                phone,
                matricule,
                password,
            }),
        })
            .then(response => {
                setLoading(false);
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Erreur serveur : ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
            .then(() => {
                Alert.alert("Succès", "Administrateur modifié avec succès !");
                navigation.goBack();
            })
            .catch(error => {
                setLoading(false);
                console.error("Erreur lors de la mise à jour :", error);
                Alert.alert("Erreur", error.message);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Bouton retour */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <MaterialIcons name="arrow-back" size={26} color="#2563eb" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Modifier Administrateur</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Nom complet</Text>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Nom complet"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Adresse e-mail"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Téléphone</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Téléphone"
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Matricule</Text>
                        <TextInput
                            value={matricule}
                            onChangeText={setMatricule}
                            placeholder="Matricule"
                            keyboardType="number-pad"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Mot de passe"
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
                    ) : (
                        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                            <Text style={styles.saveText}>Mettre à jour</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        paddingBottom: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#1f2937',
    },
    formGroup: {
        marginBottom: 18,
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#f9fafb',
        color: '#111827',
    },
    saveBtn: {
        backgroundColor: '#2563eb',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    saveText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditAdmin;
