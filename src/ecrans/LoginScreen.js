import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({navigation}) => {
    return (
        <SafeAreaView style={styles.root}>

            <Image style={{width:300, height:200}}
                source={require('../../assets/images/svg/undraw_book-lover_f1dq.png')} />
            <Text style={styles.title}>Bienvenue à UPL-BookZone</Text>
            {/* Zone de saisie */}
            <View style={styles.inputContainer}>
                <Entypo name="email" size={20} color="#666" style={{marginRight: 5}}/>
                <TextInput style={styles.input} placeholder={"Entrer votre email"}/>
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons
                    name="security"
                    size={20} color="#666"
                    style={{marginRight: 5}}/>
                <TextInput style={styles.input} placeholder={"Entrer votre mots de passe"} secureTextEntry/>

                <TouchableOpacity>
                    <Text style={{color: '#0065ff'}}>Oublié ?</Text>
                </TouchableOpacity>
            </View>

            {/* Button Action */}

            <TouchableOpacity style={styles.touchableButton1}>
                <Text style={styles.touchableText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.touchableButton2}
                onPress={() => navigation.navigate('Inscription')}
            >
                <Text style={styles.textCenter}>S'inscrire</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LoginScreen;

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