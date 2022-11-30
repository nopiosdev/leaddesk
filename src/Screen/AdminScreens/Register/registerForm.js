import React, { createRef, useState } from 'react';
import {
    StyleSheet, ActivityIndicator, Text, View, TextInput,
    TouchableOpacity, Alert, Dimensions
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { CreateAccount } from "../../../services/AccountService";
import RadioButton from 'radio-button-react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { Feather, Entypo } from '@expo/vector-icons';

var { width } = Dimensions.get('window');

const RegisterForm = ({ navigation }) => {
    const [gender, setGender] = useState('Male');
    const [UserFullName, setUserFullName] = useState('');
    const [CompanyName, setCompanyName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Password_confirmation, setPassword_confirmation] = useState('');
    const [loading, setloading] = useState(false);
    const [successMessage, setsuccessMessage] = useState('');
    const [emailerror, setemailerror] = useState(false);
    const [alertHeading, setalertHeading] = useState('');
    const [passwordmatch, setpasswordmatch] = useState(false);
    const [passwordSixCharacter, setpasswordSixCharacter] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const PasswordRef = createRef();
    const CPasswordRef = createRef();
    const Number = createRef();
    const CName = createRef();
    const email = createRef();



    const signIn = () => {
        navigation.navigate('login');
    }

    const onPressSighUpButton = async () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                if (UserFullName != "" && PhoneNumber != "" && Email != "" && Password != "" && Password_confirmation != "") {
                    onFetchLoginRecords();
                } else {
                    Alert.alert(
                        "",
                        "Please fill up all field ",
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false }
                    )
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

        try {
            if (passwordmatch == true) {
                setalertHeading("Password does not match!");
                throw "Please provide same password";
            }
            if (passwordSixCharacter == true) {
                setalertHeading("Password length minimum 6 characters!");
                throw "Please provide 6 characters password";
            }
            setloading(true);
            let response = await CreateAccount(UserFullName, PhoneNumber, CompanyName, Password, Password_confirmation, Email, gender);
            console.log('regge', response);
            if (response && response.success) {
                setsuccessMessage(response?.message);
                setShowConfirm(true);
            } else {
                if (response) {
                    console.log('error', response);

                    Alert.alert(
                        "Registration failed!",
                        response?.message?.toString(),
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false });
                }
            }
            setloading(false);
        } catch (errors) {
            setloading(false);
            Alert.alert(
                alertHeading,
                errors,
                [
                    { text: 'OK', },
                ],
                { cancelable: false }
            )

        }
    }

    const optionYes = () => {
        setShowConfirm(false);
        console.log('phr', PhoneNumber);
        navigation.navigate('login', { phoneno: PhoneNumber });
    }
    return (

        <View style={styles.container}>
            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                <Entypo name="user" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    placeholder="Your Name"
                    placeholderTextColor="#cbcbcb"
                    keyboardType="default"
                    returnKeyType="next"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    onChangeText={uname => setUserFullName(uname)}
                    onSubmitEditing={() => Number?.current?.focus()}
                    name='fullName'
                />
            </View>
            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                <Entypo name="old-mobile" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    placeholder="Your Mobile Number"
                    placeholderTextColor="#cbcbcb" keyboardType="number-pad"
                    returnKeyType="next"
                    autoCorrect={false}
                    onChangeText={mnumber => setPhoneNumber(mnumber)}
                    onSubmitEditing={() => email?.current?.focus()}
                    name='phoneNumber'
                    ref={Number}
                />
            </View>
            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                <Feather name="at-sign" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    placeholder="Your Email"
                    placeholderTextColor="#cbcbcb" keyboardType="default"
                    returnKeyType="next"
                    autoCorrect={false}
                    onChangeText={Email => setEmail(Email)}
                    ref={email}
                    name='email'
                    onSubmitEditing={() => CName?.current?.focus()}
                />
            </View>
            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                <Feather name="box" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    placeholder="Company name"
                    placeholderTextColor="#cbcbcb"
                    keyboardType="default"
                    returnKeyType="next"
                    onChangeText={cn => setCompanyName(cn)}
                    autoCorrect={false}
                    onSubmitEditing={() => PasswordRef?.current?.focus()}
                    name='companyName'
                    ref={CName}
                />
            </View>



            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                <Feather name="lock" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    placeholder="New Password"
                    placeholderTextColor="#cbcbcb"
                    HorizontalTextAlignment="center"
                    returnKeyType="next"
                    secureTextEntry
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={Password => setPassword(Password)}
                    onSubmitEditing={() => CPasswordRef?.current?.focus()}
                    name='password'
                    ref={PasswordRef}
                />
            </View>
            <Text style={{ width: 300, color: '#ddd' }}>Password must be with numaric, small and capital mix</Text>
            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                <Feather name="lock" size={20} color="#4b4b4b"
                    style={styles.InputIcon} />
                <TextInput style={styles.TextInput}
                    placeholder="Confirm Password"
                    placeholderTextColor="#cbcbcb"
                    returnKeyType="go"
                    secureTextEntry
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={cPassword => setPassword_confirmation(cPassword)}
                    name='cpassword'
                    ref={CPasswordRef}
                />
            </View>
            <View style={styles.RadioBtnView}>
                <Text style={{ fontSize: 13, color: 'gray' }}>Gender:  </Text>
                <RadioButton
                    innerCircleColor='green' currentValue={gender}
                    value={"Male"} name='gender' onPress={() => setGender('Male')}>
                    <Text style={styles.RadioBtnText}>Male</Text>
                </RadioButton>

                <RadioButton
                    innerCircleColor='green' name='gender' currentValue={gender}
                    value={"Female"} onPress={() => setGender('Female')}>
                    <Text style={styles.RadioBtnText}>Female</Text>
                </RadioButton>

                <RadioButton innerCircleColor='green' name='gender' currentValue={gender} value={"Other"} onPress={() => setGender('Other')}>
                    <Text style={styles.RadioBtnText}>Other</Text>
                </RadioButton>
            </View>
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <Text style={styles.signupagreeTxt}>by signing up you agree to the</Text>
                <Text style={styles.termsServiceTxt}>terms of service <Text style={{ color: '#c6c7c7' }}>and</Text> privacy policy</Text>
            </View>
            {loading && (<ActivityIndicator size="large" color="#1B7F67"
                style={styles.ActivityIndicatorStyle} />)}
            <TouchableOpacity style={styles.buttonRegisterContainer} >
                <Text style={styles.registerButtonText} onPress={onPressSighUpButton}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.LoginButton}
                onPress={onPressSighUpButton}>
                <View style={{ alignItems: 'center', flex: 2.5 }}>
                    <Text style={styles.TextStyle}>
                        CREATE ACCOUNT
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 1, marginRight: 10, }}>
                    <Entypo name="chevron-right" size={20} color="#ffffff" />
                </View>
            </TouchableOpacity>

            <View style={styles.signInTxt}>
                <Text style={{ color: '#c6c7c7' }}>Need to </Text>
                <TouchableOpacity onPress={signIn}>
                    <Text> Sign In</Text>
                </TouchableOpacity>
                <Text style={{ color: '#c6c7c7' }}>?</Text>
            </View>
            <ConfirmDialog
                title="Registration Successfull"
                message={successMessage}
                onTouchOutside={() => setShowConfirm(false)}
                visible={showConfirm}
                positiveButton={
                    {
                        title: "OK",
                        onPress: optionYes,
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
        marginTop: 30,
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
        backgroundColor: "#73b53b",
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
        color: "#ffffff",
        width: '100%',
        textAlign: 'right'
    },
    inputBox: {
        width: 300,
        height: 60,
        backgroundColor: '#ebebeb',
        color: '#2c2930',
        paddingHorizontal: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginVertical: 10
    },
    horizontalLineContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    horizontalLine: {
        borderBottomColor: '#c3c4c6',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: 250,
        marginTop: 10
    },
    logoBottomText: {
        color: '#bababa',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        width: 250
    },
    buttonContainer: {
        backgroundColor: '#3e325a',
        borderRadius: 20,
        paddingVertical: 13,
        marginVertical: 20,
        width: 200,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonRegisterContainer: {
        backgroundColor: '#fff',
        paddingVertical: 11,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#3e325a',
        borderRadius: 30,
        width: 160
    },
    registerButtonText: {
        color: '#3e325a',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    signInTxt: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 15,
        flexDirection: 'row'
    },
    RadioBtnText: {
        textAlign: "center", color: '#6C7272',
        fontFamily: "PRODUCT_SANS_BOLD", fontSize: 13,
        marginTop: 2,
        marginLeft: 3,
        marginRight: 4,
    },
    RadioBtnView: {
        flexDirection: "row", marginVertical: 10,
        alignItems: 'center',
    },
    ActivityIndicatorStyle: {
        position: 'absolute', left: 0, right: 0,
        bottom: 0, top: 0, justifyContent: 'center',
        alignContent: 'center',
    },
})

export default RegisterForm




