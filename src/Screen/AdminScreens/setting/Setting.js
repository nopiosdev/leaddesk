import React, { createRef, useState, useEffect } from 'react';
import {
    Platform, StatusBar, BackHandler, Alert, View,
    Text, Image, ScrollView, ToastAndroid,
    TouchableOpacity, TextInput, KeyboardAvoidingView
} from 'react-native';
import Modal from 'react-native-modalbox';
import { FontAwesome } from '@expo/vector-icons';
import { SettingStyle } from './SettingStyle'
import { CommonStyles } from '../../../common/CommonStyles';
import { useSelector, useDispatch } from "react-redux";
import LocalStorage from '../../../common/LocalStorage';
import { toggleActive, toggleUser } from '../../../Redux/Slices/UserSlice';
import { ChangePassword } from '../../../services/AccountService';
import Header from '../../../components/Header';

const SettingScreen = ({ navigation, route }) => {

    const [ImageFileName, setImageFileName] = useState('');
    const [Name, setName] = useState('');
    const [Phone, setPhone] = useState('');
    const [Email, setEmail] = useState('');
    const [oldpassword, setoldpassword] = useState('');
    const [newpassword, setnewpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [modalforchangepassword, setmodalforchangepassword] = useState(false);
    const [progressVisible, setprogressVisible] = useState(false);
    const user = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const newPasswordRef = createRef();
    const confirmPasswordRef = createRef();
    const modalchangepassword = () => {
        setmodalforchangepassword(true);
    }

    const closemodalchangepassword = () => {
        setprogressVisible(true);
        if (oldpassword == "" && newpassword == "" && confirmpassword == "") {
            alert("Field can not be empty")
        }
        else if (newpassword != confirmpassword) {
            alert("Password does not match");
        }
        else {
            changepassword();
        }
    }
    const changepassword = async () => {
        console.log("trying changepassword..",);
        try {
            var data = new FormData();
            data.append('oldpassword', oldpassword);
            data.append('confpassword', newpassword);
            data.append('UserId', user?.Id);

            let response = await ChangePassword(data);
            if (response.success) {
                LocalStorage.ClearData();
                dispatch(toggleUser('Logout'));
                setprogressVisible(false);
            } else {
                setprogressVisible(false);
                alert(response?.message);
            }
        } catch (errors) {
            console.log(errors);

        }
    }

    useEffect(() => {
        _bootstrapAsync();
    }, [])


    const openModal2 = () => {
        navigation.navigate('CompanysetupScreen');
    }
    // const gotoExpense = () => {
    //     navigation.navigate('Expenses');

    // }
    // const gotoIncome = () => {
    //     navigation.navigate('Incomes');

    // }
    const openmodalforEmpList = () => {
        navigation.navigate('EmployeeSetupScreen');
    }
    const _bootstrapAsync = async () => {
        await setName(user?.UserFullName);
        await setPhone(user?.PhoneNumber);
        await setEmail(user?.Email);

        console.log(user, '...............');
    }
    const openModal3 = () => {
        navigation.navigate('DepartmentSetupScreen');
    }

    const logOut = () => {
        Alert.alert(
            'Log Out',
            'Log Out From The App?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                style: 'ok',
                onPress: async () => {
                    LocalStorage.ClearData();
                    dispatch(toggleUser('Logout'));
                }
            },], {
            cancelable: false
        }
        )
        return true;
    };

    return (
        <View style={SettingStyle.container}>
            <Header
                title={'Settings'}
                onPress={() => { navigation.openDrawer() }}
                onGoBack={() => { dispatch(toggleActive(1)); navigation.goBack() }}
            />
            <KeyboardAvoidingView>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={SettingStyle.profileContainer}>
                        <View style={SettingStyle.settingImageCotainer}>
                            <Image
                                style={SettingStyle.porfileImage}
                                source={require('../../../../assets/images/employee.png')}
                                resizeMode='cover'
                            />
                            <View style={{}}>
                                <Text
                                    style={SettingStyle.profileName}>
                                    {Name}
                                </Text>
                                <Text
                                    style={SettingStyle.profilePhone}>
                                    {Phone}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={SettingStyle.middleViewContainer}>
                        <View style={SettingStyle.view1}>
                            <TouchableOpacity onPress={() => openModal2()}>
                                <View style={SettingStyle.view2}>
                                    <View
                                        style={SettingStyle.view3}>
                                        <Image style={SettingStyle.view1Image}
                                            source={require('../../../../assets/images/s_1.png')}>
                                        </Image>
                                        <Text
                                            style={SettingStyle.text1}>
                                            Company Setup
                                        </Text>
                                    </View>
                                    <View style={SettingStyle.ChevronRightStyle}>
                                        <FontAwesome name="chevron-right"
                                            size={18}
                                            color="#cccccc"
                                            style={{
                                                marginRight: 20
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={SettingStyle.view1}>
                            <TouchableOpacity onPress={() => openModal3()}>
                                <View style={SettingStyle.view2}>
                                    <View
                                        style={SettingStyle.view3}>
                                        <Image
                                            style={SettingStyle.view1Image}
                                            source={require('../../../../assets/images/s_2.png')}>
                                        </Image>
                                        <Text
                                            style={SettingStyle.text1}>
                                            Department Setup
                                        </Text>
                                    </View>
                                    <View style={SettingStyle.ChevronRightStyle}>
                                        <FontAwesome name="chevron-right"
                                            size={18}
                                            color="#cccccc"
                                            style={{
                                                marginRight: 20
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={SettingStyle.view1}>
                            <TouchableOpacity onPress={() => openmodalforEmpList()}>
                                <View style={SettingStyle.view2}>
                                    <View style={SettingStyle.view3}>
                                        <Image style={SettingStyle.view1Image}
                                            source={require('../../../../assets/images/s_3.png')}>
                                        </Image>
                                        <Text style={SettingStyle.text1}>
                                            Employee Setup
                                        </Text>
                                    </View>
                                    <View style={SettingStyle.ChevronRightStyle}>
                                        <FontAwesome name="chevron-right"
                                            size={18}
                                            color="#cccccc"
                                            style={{
                                                marginRight: 20
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={SettingStyle.viewchangePass}>
                            <TouchableOpacity
                                onPress={() => modalchangepassword()}>
                                {/* // onPress={Soon}> */}
                                <View style={SettingStyle.view2}>
                                    <View style={SettingStyle.view3}>
                                        <Image
                                            style={SettingStyle.view1Image}
                                            source={require('../../../../assets/images/s_4.png')}>
                                        </Image>
                                        <Text
                                            style={SettingStyle.text1}>
                                            Change Password
                                        </Text>
                                    </View>
                                    <View style={SettingStyle.ChevronRightStyle}>
                                        <FontAwesome name="chevron-right"
                                            size={18}
                                            color="#cccccc"
                                            style={{
                                                marginRight: 20
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={SettingStyle.lastViewContainer}>


                        <View style={SettingStyle.viewchangePass}>
                            <TouchableOpacity onPress={logOut}>
                                <View style={SettingStyle.view2}>
                                    <View style={SettingStyle.view3}>
                                        <Image
                                            style={SettingStyle.view1Image}
                                            source={require('../../../../assets/images/s_5.png')}>
                                        </Image>
                                        <Text
                                            style={SettingStyle.text1}>
                                            Logout
                                        </Text>
                                    </View>
                                    <View style={SettingStyle.ChevronRightStyle}>
                                        <FontAwesome name="chevron-right"
                                            size={18}
                                            color="#cccccc"
                                            style={{
                                                marginRight: 20
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>




                </ScrollView>
            </KeyboardAvoidingView>
            <Modal style={[SettingStyle.modal3]} position={"center"}
                isOpen={modalforchangepassword}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "column" }}>
                    <View style={{ alignItems: "flex-start" }}></View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalforchangepassword(false)}
                            style={SettingStyle.changepassmodalToucah}>
                            <Image resizeMode="contain"
                                style={{ width: 30, height: 30, }}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={SettingStyle.modelContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                        Change Password
                    </Text>
                    <View
                        style={SettingStyle.horizontalLine}
                    />
                    <Image resizeMode="contain" style={SettingStyle.addPeopleImg}
                        source={require('../../../../assets/images/key.png')}>
                    </Image>
                </View>
                <View style={{ alignSelf: 'center' }}>
                    <TextInput style={SettingStyle.inputBoxchagePass}
                        placeholder="Old Password"
                        placeholderTextColor="#cbcbcb"
                        returnKeyType="next" autoCorrect={false}
                        secureTextEntry
                        onSubmitEditing={() => newPasswordRef.current?.focus()}
                        onChangeText={(text) => setoldpassword(text)}
                        value={oldpassword}
                    />
                    <TextInput style={SettingStyle.inputBoxchagePass}
                        placeholder="New Password"
                        placeholderTextColor="#cbcbcb"
                        returnKeyType="next" autoCorrect={false}
                        secureTextEntry
                        ref={newPasswordRef}
                        value={newpassword}
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                        onChangeText={(text) => setnewpassword(text)}
                    />
                    <TextInput style={SettingStyle.inputBoxchagePass}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#cbcbcb"
                        returnKeyType="go" autoCorrect={false}
                        secureTextEntry
                        value={confirmpassword}
                        onChangeText={(text) => setconfirmpassword(text)}
                        ref={confirmPasswordRef}
                        onSubmitEditing={() => changepassword()}
                    />
                    <TouchableOpacity style={SettingStyle.addPeopleBtnchangpass}
                        onPress={() => closemodalchangepassword()} >
                        <Text style={SettingStyle.changePassModalSave}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View >
    );
}

export default SettingScreen;
