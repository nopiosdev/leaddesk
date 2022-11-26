import React from 'react';
import LoginForm from './Screen/loginForm';
import {
    KeyboardAvoidingView, StyleSheet, Platform,
    Dimensions, View, Image, StatusBar,
} from 'react-native';


var { height } = Dimensions.get('window');

const Login = ({ navigation, route }) => {

    return (
        <KeyboardAvoidingView enabled style={styles.container}>
            <View style={[styles.logoContainer,]}>
                <Image
                    style={{
                        width: 275, height: 255,
                        flex: 1,
                        margin: 10,
                        width: "90%",
                    }}
                    resizeMode="contain"
                    source={require('../../assets/images/login.png')}>
                </Image>
            </View>
            <View style={{
                flex: 1,
                marginTop: -(height * 10) / 100,
                justifyContent: "flex-start",
                width: "100%",
            }}>
                <LoginForm navigation={navigation} phoneno={route?.params?.id} />
            </View>
        </KeyboardAvoidingView >

    )
}
export default Login
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    logoContainer: {
        marginTop: (height * 5) / 100,
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignItems: "center"
    },
})
