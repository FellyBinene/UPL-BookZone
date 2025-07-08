import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const PDFViewerScreen = ({ route }) => {
    const { fileUrl } = route.params;
    const googleUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: googleUrl }}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="large" color="#4f46e5" />}
                style={{ flex: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default PDFViewerScreen;
