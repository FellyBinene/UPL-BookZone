import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Text,
    Dimensions,
    Modal,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Header = ({ onNavigate, onChangePassword, onLogout }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-width * 0.5)).current;

    const openMenu = useCallback(() => {
        setMenuVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [slideAnim]);

    const closeMenu = useCallback((callback) => {
        Animated.timing(slideAnim, {
            toValue: -width * 0.5,
            duration: 200,
            useNativeDriver: false,
        }).start(() => {
            setMenuVisible(false);
            if (callback) callback();
        });
    }, [slideAnim]);

    const toggleMenu = () => {
        if (menuVisible) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleMenu} hitSlop={10}>
                    <Ionicons name="menu-outline" size={28} color="#000" />
                </TouchableOpacity>

                <Image
                    source={require('../../../assets/images/svg/upl.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <TouchableOpacity onPress={() => onNavigate('AdminProfile')} hitSlop={10}>
                    <Ionicons name="person-circle-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="none"
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => closeMenu()}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => closeMenu()}
                >
                    <Animated.View
                        style={[styles.menuContainer, { left: slideAnim }]}
                        pointerEvents="box-none"
                    >
                        <View style={styles.menuHeader}>
                            <Ionicons name="book-outline" size={24} color="#4f46e5" />
                            <Text style={styles.menuTitle}>UPL-BookZone</Text>
                        </View>

                        <View style={styles.menuFooter}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => closeMenu(() => onChangePassword && onChangePassword())}
                            >
                                <Ionicons name="lock-closed-outline" size={20} color="#2563eb" />
                                <Text style={styles.menuText}>Modifier mot de passe</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => closeMenu(() => onLogout && onLogout())}
                            >
                                <Ionicons name="exit-outline" size={20} color="#dc2626" />
                                <Text style={[styles.menuText, { color: '#dc2626' }]}>Déconnexion</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: width * 0.5,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
    },
    menuTitle: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    menuFooter: {
        marginBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Header;
