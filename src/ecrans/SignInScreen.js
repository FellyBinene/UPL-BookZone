import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from 'react-native-vector-icons/Entypo';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Alert } from 'react-native';
import navigation from "../routes/Navigation";

const SignInScreen = ({navigation}) => {
    const [birthDate, setBirthDate] = useState(new Date());

    const showDatePicker = () => {
        Alert.alert(
            "Information",
            "Veuillez choisir votre date de naissance.",
            [
                {
                    text: "Continuer",
                    onPress: () => {
                        DateTimePickerAndroid.open({
                            value: birthDate,
                            onChange: (event, selectedDate) => {
                                const currentDate = selectedDate || birthDate;
                                setBirthDate(currentDate);
                            },
                            mode: 'date',
                            is24Hour: true,
                        });
                    }
                }
            ]
        );
    };
    return (
        <SafeAreaView style={styles.root}>
            <Text style={styles.title}>S'inscrire</Text>

            <View style={styles.inputContainer}>
                <Entypo name="add-user" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput style={styles.input} placeholder="Entrer votre nom complet" />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="calendar" size={20} color="#666" style={{ marginRight: 5 }} />

                <TouchableOpacity onPress={showDatePicker} style={{flex : 1, paddingBottom: 5}}>
                    <Text style={{ marginBottom: 5, color: '#555' }}>
                        Date de naissance :
                    </Text>
                    <Text style={{ color: '#333' }}>
                        {birthDate.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="phone" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput style={styles.input} placeholder="Entrer votre contact" keyboardType="phone-pad" />
            </View>

            <View style={styles.inputContainer}>
                <Entypo name="email" size={20} color="#666" style={{ marginRight: 5 }} />
                <TextInput style={styles.input} placeholder="Entrer votre email" keyboardType="email-address" />
            </View>

            <View style={styles.inputContainer}>
                <EvilIcons name="lock" size={30} color="#666" style={{ marginRight: 5 }} />
                <TextInput style={styles.input} placeholder="Entrer votre mot de passe" secureTextEntry />
            </View>

            <View style={styles.inputContainer}>
                <EvilIcons name="lock" size={30} color="#666" style={{ marginRight: 5 }} />
                <TextInput style={styles.input} placeholder="Confirmer votre mot de passe" secureTextEntry />
            </View>

            <TouchableOpacity style={styles.touchableButton1}>
                <Text style={styles.touchableText}>M'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.touchableButton2}
                onPress={() => navigation.navigate('Connexion')}
            >
                <Text style={styles.textCenter}>Se connecter</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: '#333',
        marginTop : 20,
        marginBottom : 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        marginBottom : 25
    },
    input : {
        flex: 1,
    },
    touchableButton1:{
        marginBottom : 30,
        borderRadius : 20,
        padding : 20,
        backgroundColor: '#0065ff',
    },
    touchableText: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize : 16,
        color: '#fff',
    },
    touchableButton2:{
        marginBottom : 30,
        borderRadius : 20,
        padding : 20,
        backgroundColor: '#fffb00',
    },
    textCenter:{
        textAlign: 'center',
        fontWeight: '700',
        fontSize : 16,
    }
})
