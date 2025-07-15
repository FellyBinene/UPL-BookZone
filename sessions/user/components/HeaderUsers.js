import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HeaderUsers = ({ onRightPress }) => {
    const navigation = useNavigation();
    const [hasNotification, setHasNotification] = useState(false);

    const checkNotifications = useCallback(async () => {
        try {
            const res = await axios.get('http://192.168.17.89:4000/api/notifications');
            setHasNotification(res.data.notifications && res.data.notifications.length > 0);
        } catch (err) {
            console.error('Erreur notification :', err);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            checkNotifications();
            const interval = setInterval(checkNotifications, 60000);
            return () => clearInterval(interval);
        }, [checkNotifications])
    );

    const handleBellPress = () => {
        setHasNotification(false);
        navigation.navigate('Notifications');
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBellPress} style={{ position: 'relative' }}>
                    <Entypo name="bell" size={24} color="#000" />
                    {hasNotification && <View style={styles.badge} />}
                </TouchableOpacity>

                <Image
                    source={require('../../../assets/images/svg/upl.png')}
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
    badge: {
        width: 12,
        height: 12,
        backgroundColor: 'red',
        borderRadius: 6,
        position: 'absolute',
        top: -4,
        right: -4,
        borderWidth: 1.5,
        borderColor: 'white',
    },
});

export default HeaderUsers;
