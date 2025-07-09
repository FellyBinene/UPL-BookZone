// components/FooterAdmin.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const FooterUsers = ({ onNavigate, activeScreen }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onNavigate('HomeUsers')}
            >
                <Entypo name="home" size={26} color={activeScreen === 'HomeUsers' ? '#4f46e5' : '#000'} />
                <Text style={[styles.label, activeScreen === 'HomeUsers' && styles.activeLabel]}>Accueil</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => onNavigate('DisplayBook')}
            >
                <Entypo name="book" size={26} color={activeScreen === 'DisplayBook' ? '#4f46e5' : '#000'} />
                <Text style={[styles.label, activeScreen === 'DisplayBook' && styles.activeLabel]}>Livres</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 10,
    },
    button: {
        alignItems: 'center',
    },
    label: {
        color: '#000',
        fontSize: 12,
        marginTop: 2,
    },
    activeLabel: {
        color: '#4f46e5',
        fontWeight: 'bold',
    },
});

export default FooterUsers;
