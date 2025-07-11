import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HeaderUsers = ({ onRightPress }) => {
    const navigation = useNavigation();
    const [hasNotification, setHasNotification] = useState(false);

    useEffect(() => {
        const checkNotifications = async () => {
            try {
                const res = await axios.get('http://192.168.101.89:4000/api/notifications');
                if (res.data.notifications && res.data.notifications.length > 0) {
                    setHasNotification(true);
                } else {
                    setHasNotification(false);
                }
            } catch (err) {
                console.error('Erreur notification :', err);
            }
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleBellPress = () => {
        setHasNotification(false); // ✅ on enlève la bulle rouge
        navigation.navigate('Notifications'); // ✅ on redirige
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
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        position: 'absolute',
        top: -4,
        right: -4,
    },
});

export default HeaderUsers;
