import {
    Dimensions,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React from "react";

const { height } = Dimensions.get("window");

const WelcomeScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <ImageBackground
                    style={{
                        height: height / 2.5,
                    }}
                    resizeMode="contain"
                    source={require("../assets/images/svg/admin.png")}
                />
                <View
                    style={{
                        paddingHorizontal: 32,
                        paddingTop: 32,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 32,
                            color: "#0aada8",
                            fontWeight: "700",
                            textAlign: "center",
                        }}
                    >
                        Discover Your Dream Job here
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            color: "#6e6e6e",
                            fontWeight: "400",
                            textAlign: "center",
                            marginTop: 16,
                        }}
                    >
                        Explore all the existing job roles based on your interest and study
                        major
                    </Text>
                </View>

                <View
                    style={{
                        paddingHorizontal: 16,
                        paddingTop: 48,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#0aada8",
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            width: "48%",
                            borderRadius: 16,
                            shadowColor: "#0aada8",
                            shadowOffset: { width: 0, height: 16 },
                            shadowOpacity: 0.3,
                            shadowRadius: 16,
                        }}
                    >
                        <Text
                            style={{
                                color: "#ffffff",
                                fontSize: 18,
                                fontWeight: "700",
                                textAlign: "center",
                            }}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            width: "48%",
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: "#0aada8",
                        }}
                    >
                        <Text
                            style={{
                                color: "#6e6e6e",
                                fontSize: 18,
                                fontWeight: "700",
                                textAlign: "center",
                            }}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
