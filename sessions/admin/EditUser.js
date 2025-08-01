import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    ScrollView,
    Platform,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons'; // <-- Import icon

const EditUser = ({ route, navigation }) => {
    const { user } = route.params;

    const initialDate = user.birthDate ? new Date(user.birthDate) : new Date();

    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [birthDate, setBirthDate] = useState(initialDate);
    const [phone, setPhone] = useState(user.phone);
    const [matricule, setMatricule] = useState(user.matricule);
    const [password, setPassword] = useState(user.password || '');

    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleUpdate = async () => {
        if (!fullName || !email || !birthDate || !phone || !matricule || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        try {
            const response = await axios.put(`http://192.168.136.89:4000/api/users/${user.id}`, {
                fullName,
                email,
                birthDate: formatDate(birthDate),
                phone,
                matricule,
                password,
            });

            if (response.status === 200) {
                Alert.alert("Succès", "Utilisateur mis à jour.");
                navigation.goBack();
            } else {
                Alert.alert("Erreur", "Échec de la mise à jour.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur est survenue.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Bouton retour */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={26} color="#2563eb" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Modifier Utilisateur</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nom complet"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Adresse email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TouchableOpacity
                    style={[styles.input, { justifyContent: 'center' }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ color: birthDate ? '#111827' : '#999', fontSize: 16 }}>
                        {birthDate ? formatDate(birthDate) : 'Date de naissance'}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={birthDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Téléphone"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Matricule"
                    value={matricule}
                    onChangeText={setMatricule}
                    keyboardType="number-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Mettre à jour</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 24,
    },
    header: {
        marginBottom: 10,
        marginTop: 30
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
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#1f2937',
    },
    input: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        color: '#111827',
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
