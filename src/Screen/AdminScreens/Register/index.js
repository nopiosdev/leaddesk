import React, { useCallback, useEffect } from 'react';
import RegisterForm from './registerForm';
import { KeyboardAvoidingView, StyleSheet, Platform, View, Text, StatusBar, ScrollView } from 'react-native';


const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
function StatusBarPlaceHolder() {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#F3F3F3',
        }}>
            <StatusBar />
        </View>
    );
}

const Register = ({ navigation }) => {

    return (
        <KeyboardAvoidingView enabled style={styles.container}>
            <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                <StatusBarPlaceHolder />
                <View style={styles.mainView}>
                    <Text style={styles.AdminText}>
                        ADMIN
                    </Text>
                    <Text style={styles.RegisterText}>
                        REGISTER
                    </Text>
                </View>
                <RegisterForm navigation={navigation} />
            </ScrollView>
        </KeyboardAvoidingView>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f6f8',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    imageContainer: {
        flex: 1
        //justifyContent:'flex-end',
    },
    logo: {
        //flex: 1,
        width: 355,
        height: 250,
        top: -35
    },
    AdminText: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        textAlign: "left",
        color: "#9f9f9f"
    },
    RegisterText: {
        fontFamily: "Montserrat_Bold",
        fontSize: 31,
        textAlign: "left",
        color: "#030303"
    },
    mainView: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
})
export default Register;
