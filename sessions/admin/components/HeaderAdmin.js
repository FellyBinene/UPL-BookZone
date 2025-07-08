// components/Header.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ onLeftPress, onRightPress }) => {
    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onLeftPress}>
                    <Ionicons name="menu-outline" size={28} color="#000" />
                </TouchableOpacity>

                {/* Logo au centre */}
                <Image
                    source={require('../../../assets/images/svg/upl.png')} // adapte ce chemin selon ton projet
                    style={styles.logo}
                    resizeMode="contain"
                />

                <TouchableOpacity onPress={onRightPress}>
                    <Ionicons name="person-circle-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
    },
    header: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: 100,
        height: 40,
    },
});

export default Header;
