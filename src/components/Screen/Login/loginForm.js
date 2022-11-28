import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, TextInput, TouchableOpacity, AppState, BackHandler, Alert, Image, } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Login, AddDeviceToken } from '../../../services/AccountService';
import LocalStorage from '../../../common/LocalStorage'
import { Feather, Entypo } from '@expo/vector-icons';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { useDispatch } from 'react-redux';
import { addUser, toggleUser } from '../../../Redux/Slices/UserSlice';
import { useIsFocused } from '@react-navigation/native';
import { registerForPushNotificationsAsync } from '../../../Utils/RegisterForPushNotificationsAsync';

var { width } = Dimensions.get('window');

const LoginForm = ({ navigation, phoneno }) => {

    const [userName, setUserName] = useState('');
    const [password, setpassword] = useState('');
    const [alertMessage, setalertMessage] = useState('');
    const [loading, setloading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const PasswordRef = createRef();
    const dispatch = useDispatch();
    const Isfocused = useIsFocused();


    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    const changeUsrNameHandler = (text) => {
        setUserName(text);
    };
    const changePassNameHandler = (text) => {
        setpassword(text);
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => { BackHandler.removeEventListener('hardwareBackPress', handleBackButton); }
    }, [])

    const onPressSubmitButton = async () => {
        NetInfo.fetch().then(async state => {
            if (state.isConnected) {
                if (userName != "" && password != "") {
                    setloading(true);
                    await onFetchLoginRecords();
                } else {
                    setalertMessage('Please input all field')
                    setShowConfirm(true);
                }
            } else {
                Alert.alert(
                    "No Internet ",
                    "Enable Wifi or Mobile Data",
                    [
                        { text: 'OK', },
                    ],
                    { cancelable: false }
                )
            }
        });
    }
    const onFetchLoginRecords = async () => {
        var data = new FormData();
        data.append('phoneNumber', userName);
        data.append('password', password);

        await Login(data).then(async (response) => {
            console.log('respo', response)
            if (response && response.success) {
                LocalStorage.SetData("Login", "Login");
                await registerForPushNotificationsAsync().then(token => {
                    var data = new FormData();
                    data.append('userId', response?.Id);
                    data.append('token', token);
                    AddDeviceToken(data).then(res => {
                        if (res?.success) {
                            LocalStorage.SetData("userToken", response?.token);
                            LocalStorage.SetData("companyId", response?.CompanyId.toString());
                            dispatch(addUser(response))
                            LocalStorage.SetData("CurrentUser", JSON.stringify(response));
                            dispatch(toggleUser('Login'))
                            setUserName('');
                            setpassword('');
                        } else {
                            Alert.alert(
                                "Error",
                                "Please Try Again",
                                [
                                    { text: 'OK', },
                                ],
                                { cancelable: false }
                            )
                        }
                    })
                })

                setloading(false);
            } else {
                setloading(false);
                setalertMessage('Phonenumber or password is wrong')
                setShowConfirm(true);
            }
        });
    }

    useEffect(() => {
        setUserName(phoneno);
    }, [Isfocused])

    return (
        <View style={styles.container}>
            {loading ? (<ActivityIndicator size="large" color="#1B7F67" style={{ left: 0, right: 0, bottom: 0, top: 0, justifyContent: 'center', alignContent: 'center', }} />) : null}

            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                <Entypo name="old-mobile" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    keyboardType="numeric"
                    placeholder="Your Mobile Number"
                    placeholderTextColor="#bcbcbc"
                    underlineColorAndroid="transparent"
                    returnKeyType="next"
                    autoCorrect={false}
                    onChangeText={changeUsrNameHandler}
                    value={userName}
                    onSubmitEditing={() => PasswordRef?.current?.focus()}
                />
            </View>
            <View style={styles.TextInputView}>
                <Feather name="lock" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    placeholder="Your Password"
                    placeholderTextColor="#bcbcbc"
                    underlineColorAndroid="transparent"
                    onChangeText={changePassNameHandler}
                    returnKeyType="go"
                    secureTextEntry
                    autoCorrect={false}
                    ref={PasswordRef}
                    value={password}
                    onSubmitEditing={() => onPressSubmitButton(userName, password)}
                />
            </View>

            <TouchableOpacity style={styles.LoginButton}
                onPress={() => onPressSubmitButton(userName, password)}>
                <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>

                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.TextStyle}>
                        LOGIN
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginRight: 10, }}>
                    <Entypo name="chevron-right" size={20} color="#ffffff" />
                </View>
            </TouchableOpacity>

            <View style={[styles.LoginButton, { backgroundColor: '#ffffff', }]}>

                <TouchableOpacity
                    onPress={() => navigation.navigate('register')}
                    style={{
                        alignItems: 'center',
                        width: (width * 66) / 100,
                        height: "100%",
                        justifyContent: 'center',
                        backgroundColor: '#f1f4f6',
                        borderRadius: 5,
                    }}>

                    <Text style={[styles.TextStyle, style = { color: "#6d6d6d" }]}>
                        REGISTER
                    </Text>
                </TouchableOpacity>
                <Image
                    style={{ width: 40, height: 40 }}
                    source={require('../../../../assets/images/RegCall.png')}>
                </Image>

            </View>

            <ConfirmDialog
                title="Message"
                message={alertMessage}
                onTouchOutside={() => setShowConfirm(false)}
                visible={showConfirm}
                positiveButton={
                    {
                        title: "OK",
                        onPress: () => setShowConfirm(false),
                        titleStyle: {
                            color: "black",
                            colorDisabled: "aqua",
                        }
                    }
                }
            />
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    TextInputView: {
        width: (width * 80) / 100,
        height: 45,
        backgroundColor: '#f1f4f6',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    InputIcon: {
        justifyContent: "flex-start",
        marginHorizontal: 10,
    },
    TextInput: {
        flex: 1,
        color: "#3D6AA5",
        paddingRight: 3,
    },
    LoginButton: {
        backgroundColor: '#316fde',
        borderRadius: 5,
        height: 45,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: (width * 80) / 100,
    },
    TextStyle: {
        fontSize: 13,
        fontFamily: "Montserrat_Bold",
        color: "#ffffff"
    },
})

export default LoginForm
