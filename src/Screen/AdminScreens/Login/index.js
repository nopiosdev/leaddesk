import React, { useEffect, useState } from 'react';
import LoginForm from './loginForm';
import { KeyboardAvoidingView, StyleSheet, Dimensions, View, Image, Pressable } from 'react-native';
import Popup from '../../../components/Popup';
import LocalStorage from '../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import { handleUrl } from '../../../Utils/config';


var { height } = Dimensions.get('window');

const Login = ({ navigation, route }) => {
    const [popup, setPopup] = useState(false);

    return (
        <KeyboardAvoidingView enabled style={styles.container}>
            <Pressable onPress={() => setPopup(true)} style={[styles.logoContainer]}>
                <Image
                    style={{
                        width: 275, height: 255,
                        flex: 1,
                        margin: 10,
                        width: "90%",
                    }}
                    resizeMode="contain"
                    source={require('../../../../assets/images/login.png')} />
            </Pressable>
            <View style={{
                flex: 1,
                marginTop: -(height * 10) / 100,
                justifyContent: "flex-start",
                width: "100%",
            }}>
                <LoginForm navigation={navigation} phoneno={route?.params?.phoneno} />
            </View>
            <Popup
                show={popup}
                testingPopup={true}
                onPress={() => setPopup(false)}
            />
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
