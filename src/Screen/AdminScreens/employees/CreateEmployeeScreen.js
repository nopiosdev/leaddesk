
import React, { Component, createRef, useEffect, useState } from 'react';
import { ScrollView, Text, View, Keyboard, BackHandler, TextInput, TouchableOpacity, ToastAndroid, Platform, KeyboardAvoidingView, Image, Switch, Share } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ModalSelector from 'react-native-modal-selector';
import Modal from 'react-native-modalbox';
import { CommonStyles } from '../../../common/CommonStyles';
import { EmpSetScreenStyle } from './EmpSetScreenStyle';
import { EmpCreateScreenStyle } from './EmpCreateScreenStyle';
import RadioButton from 'radio-button-react-native';
import { debounce } from 'lodash'
import { GetDepartmentByCompanyId, CreateDepartment, } from "../../../services/DepartmentService";
import { CreateEmployee } from "../../../services/AccountService";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LocalStorage from '../../../common/LocalStorage';
import * as Clipboard from 'expo-clipboard';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../components/Header';
import { useSelector } from 'react-redux';

const withPreventDoubleClick = (WrappedComponent) => {
    const PreventDoubleClick = (props) => {
        const debouncedOnPress = () => {
            props.onPress && props.onPress();
        }

        const onPress = debounce(debouncedOnPress, 300, { leading: true, trailing: false });
        return <WrappedComponent {...props} onPress={onPress} />;
    }
    PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName || WrappedComponent.name})`
    return PreventDoubleClick;
}

const ButtonEx = withPreventDoubleClick(TouchableOpacity);
const CreateEmployeeScreen = ({ navigation, route }) => {

    const [userId, setuserId] = useState('');
    const [companyId, setcompanyId] = useState('');
    const [date, setdate] = useState(new Date());
    const [departmentList, setdepartmentList] = useState([]);
    const [DeptName, setDeptName] = useState('');
    const [DeptId, setDeptId] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [EmployeeCode, setEmployeeCode] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Designation, setDesignation] = useState('');
    const [DepartmentId, setDepartmentId] = useState('');
    const [value, setvalue] = useState('Male');
    const [Email, setEmail] = useState('');
    const [IsAutoCheckPoint, setIsAutoCheckPoint] = useState(false);
    const [AutoCheckPointTime, setAutoCheckPointTime] = useState('1:00:00');
    const [MaximumOfficeHours, setMaximumOfficeHours] = useState('8:00:00');
    const [OfficeOutTime, setOfficeOutTime] = useState('00:30:00');
    const [isDateTimePickerVisible1, setisDateTimePickerVisible1] = useState(false);
    const [Employee, setEmployee] = useState({ UserName: '', Password: '', DepartmentId: '' });
    const [IsActive, setIsActive] = useState(null);
    const [PickerSelectedVal, setPickerSelectedVal] = useState(null);
    const [CopyUsername, setCopyUsername] = useState('');
    const [CopyPassword, setCopyPassword] = useState('');
    const [modalforusername, setmodalforusername] = useState(false);
    const [successMessage, setsuccessMessage] = useState('');
    const [ModalForDeptSelection, setModalForDeptSelection] = useState(false);
    const txtDesignationRef = createRef();
    const txtNameRef = createRef();
    const txtMobileRef = createRef();
    const txtEmailRef = createRef();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state.user.currentUser);



    useEffect(() => {
        (async () => {
            const uId = await LocalStorage.GetData("userId");
            const cId = await LocalStorage.GetData("companyId");
            setuserId(uId);
            setcompanyId(cId);
            getDepartment(cId);
        })();
    }, [isFocused])


    const resetForm = () => {
        setEmployeeCode('');
        setDesignation('');
        setDepartmentId('');
        setvalue('');
        setEmail('');
        setdepartmentList([]);
        setIsAutoCheckPoint(false);
        setEmployee({ UserName: '', Password: '', DepartmentId: '' });
        setAutoCheckPointTime('1:00:00');
        setUserFullName('');
    }
    const handleOnPress = (value) => {
        setvalue(value);
    }
    const goBack = () => {
        navigation.goBack();
    }
    const toggleSwitch = value => {
        setIsAutoCheckPoint(value);
    };
    const toggleIsActiveSwitch = value => {
        setIsActive(value);
    };
    // const onFetchDepartmentRecords = async () => {
    //     console.log("trying Department create..");

    //     try {
    //         let Departmentodel = {
    //             DepartmentName: Dept.DepartmentName,
    //             CompanyId: companyId,
    //         };
    //         if (companyId == "") {
    //             ToastAndroid.show("At first create a company.", ToastAndroid.SHORT);
    //             return;
    //         }

    //         console.log(Departmentodel, '..depttest');
    //         let response = await CreateDepartment(Departmentodel);
    //         if (response && response.isSuccess) {
    //             console.log('com', response);
    //             alert("Department created successully");
    //             departmentList.push({
    //                 key: response.result.Id,
    //                 label: response.result.DepartmentName
    //             })
    //             const depList = [];

    //             Object.assign(depList, departmentList);
    //             console.log('tttt', depList);
    //             setdepartmentList(depList);
    //             console.log('dept', departmentList)
    //             setDepartmentId(departmentList[0].Value);
    //             setPickerSelectedVal(departmentList[0].Value);
    //             console.log('deptlist', departmentList);
    //         } else {
    //             alert("error");
    //         }
    //     } catch (errors) {
    //         console.log(errors);
    //     }

    // }
    const getUniqueUserName = async () => {
        const newUser = PhoneNumber;
        console.log(newUser);
        setEmployee({ UserName: newUser });
        Keyboard.dismiss();
        saveEmployee();
    }
    const onShare = async (username, password) => {
        console.log('first', CopyUsername)
        try {
            const result = await Share.share({ message: "UserName: " + CopyUsername + " Password: " + CopyPassword });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    navigation.navigate('EmployeeSetupScreen');
                    setPhoneNumber('');
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
                navigation.navigate('EmployeeSetupScreen');
                setPhoneNumber('');
            }
        } catch (error) {
            alert(error.message);
            setPhoneNumber('');
        }
    };

    const copyToClicpBord = async (username, password) => {
        setCopyUsername(username);
        setCopyPassword(password);
        await Clipboard.setStringAsync("UserName: " + username + " Password: " + password);
        setTimeout(() => setmodalforusername(true), 100);
        await onShare(username, password);
    }

    const saveEmployee = async () => {

        var data = new FormData();
        data.append('UserFullName', UserFullName);
        data.append('EmployeeCode', EmployeeCode);
        data.append('PhoneNumber', PhoneNumber);
        data.append('UserType', 0);
        data.append('Designation', Designation);
        data.append('DepartmentId', Employee?.DepartmentId);
        data.append('CompanyId', companyId);
        data.append('Gender', value);
        data.append('Email', Email);
        data.append('IsAutoCheckPoint', IsAutoCheckPoint ? 1 : 0);
        data.append('AutoCheckPointTime', AutoCheckPointTime);
        data.append('MaximumOfficeHours', MaximumOfficeHours);
        data.append('OfficeOutTime', OfficeOutTime);
        data.append('AdminEmail', user?.Email);
        data.append('AdminName', user?.UserFullName);
        console.log(data)

        try {
            let response = await CreateEmployee(data)
            setsuccessMessage(response?.message);
            console.log('response', response)
            if (response?.success) {
                setmodalforusername(true);
                // resetForm();
            } else {
                ToastAndroid.show(response?.message, ToastAndroid.TOP);
            }
        } catch (errors) {
            console.log(errors);
        }
    }
    const getDepartment = async (companyId) => {
        try {
            await GetDepartmentByCompanyId(companyId)
                .then(res => {
                    console.log(companyId, 'comlen', res);
                    if (res !== null) {
                        if (res?.length > 0) {
                            const depList = [];
                            res?.forEach(function (item) {
                                const ob = {
                                    'key': item?.Id,
                                    'label': item?.DepartmentName,
                                }
                                depList.push(ob);
                            });
                            setdepartmentList(depList);
                            console.log(departmentList, 'testcall')
                        }
                    } else {
                        setdepartmentList([]);
                    }
                })
                .catch(() => {
                    console.log("error occured");
                });
        } catch (error) {
            console.log(error);
        }
    }
    const _showDateTimePicker1 = () => setisDateTimePickerVisible1(true);

    const _hideDateTimePicker1 = () => setisDateTimePickerVisible1(false);

    const _handleDatePicked1 = (date) => {
        setAutoCheckPointTime(moment(date).format("HH:mm:ss"));
        console.log('A date has been picked: ', moment(date).format("HH:mm:ss"));
        _hideDateTimePicker1();
    }

    // const openModalForDeptSelection = () => {
    //     setModalForDeptSelection(true);
    // }
    const closeSuccessModal = () => {
        setmodalforusername(false);
        navigation.navigate('EmployeeSetupScreen');
    }
    const openModaladdPeople = () => {
        if (UserFullName == "") {
            ToastAndroid.show('Employee Name can not be empaty', ToastAndroid.SHORT);
        } else if (Designation == "") {
            ToastAndroid.show('Employee Designation can not be empaty', ToastAndroid.SHORT);
        }
        else if (PhoneNumber == "") {
            ToastAndroid.show('Employee PhoneNumber can not be empaty', ToastAndroid.SHORT);
        }
        else if (Email == "") {
            ToastAndroid.show('Employee Email can not be empaty', ToastAndroid.SHORT);
        }
        else if (Employee.DepartmentId == "") {
            ToastAndroid.show('Please Select Department', ToastAndroid.SHORT);
        }
        else {
            getUniqueUserName();

        }
    }
    const renderCheckPointTime = () => {
        if (IsAutoCheckPoint) {
            return (
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        // marginTop: 10,
                        marginLeft: 20, justifyContent: 'flex-start',
                    }}>
                        Auto Check Point Time:
                    </Text>
                    <TouchableOpacity onPress={_showDateTimePicker1}
                        style={{ marginRight: 18, justifyContent: "flex-end" }}
                    >
                        <View>
                            <TextInput
                                editable={false}
                                style={EmpCreateScreenStyle.inputstylecom}
                                value={AutoCheckPointTime}
                            />
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={isDateTimePickerVisible1}
                        onConfirm={_handleDatePicked1}
                        onCancel={_hideDateTimePicker1}
                        mode={'time'}
                    />
                </View>
            )
        }
    }

    return (
        <View style={{
            flex: 1, flexDirection: 'column',
        }}>
            <Header
                title={'Create Employee'}
                onPress={() => { navigation.goBack() }}
                goBack={true}
                btnAction={() => openModaladdPeople()}
                btnTitle='POST'
                saveImg={true}
            />
            <KeyboardAvoidingView enabled style={{ flex: 1, }}>
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag" style={{ flex: 1, }}>
                    {/* <View>
                        <Text
                            style={EmpCreateScreenStyle.createEmployeeLabel}>
                            Employee Code:
                        </Text>
                        <TextInput
                            style={EmpCreateScreenStyle.createEmpTextBox}
                            placeholder="Write employee  Code"
                            placeholderTextColor="#dee1e5"
                            returnKeyType="next" autoCorrect={false}
                            value={EmployeeCode}
                            autoCapitalize="none"
                            onChangeText={(text) => setEmployeeCode(text)}
                            onSubmitEditing={() => txtNameRef.current.focus()}
                        >
                        </TextInput>
                    </View> */}

                    <View>
                        <Text
                            style={EmpCreateScreenStyle.createEmployeeLabel}>
                            Employee Name:
                        </Text>
                        <TextInput
                            style={EmpCreateScreenStyle.createEmpTextBox}
                            placeholder="Write employee  name"
                            placeholderTextColor="#dee1e5"
                            returnKeyType="next" autoCorrect={false}
                            value={UserFullName}
                            ref={txtNameRef}
                            autoCapitalize="none"
                            onChangeText={(text) => setUserFullName(text)}
                            onSubmitEditing={() => txtDesignationRef.current.focus()}
                        >
                        </TextInput>
                    </View>
                    <View>
                        <Text
                            style={EmpCreateScreenStyle.createEmployeeLabel}>
                            Designation:
                        </Text>
                        <TextInput style={EmpCreateScreenStyle.createEmpTextBox}
                            placeholder="Designation"
                            placeholderTextColor="#dee1e5"
                            returnKeyType="next" autoCorrect={false}
                            value={Designation}
                            ref={txtDesignationRef}
                            onChangeText={(text) => setDesignation(text)}
                            onSubmitEditing={() => txtMobileRef.current.focus()}
                        >
                        </TextInput>
                    </View>
                    <View>
                        <Text style={EmpCreateScreenStyle.createEmployeeLabel}>
                            Department:
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: "90%" }}>
                                <ModalSelector
                                    style={EmpCreateScreenStyle.ModalSelectorStyle}
                                    data={departmentList}
                                    initValue="Select Department"
                                    onChange={(option) => {
                                        setEmployee({ DepartmentId: option.key });
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text
                            style={EmpCreateScreenStyle.createEmployeeLabel}>
                            Mobile Number:
                        </Text>
                        <TextInput style={EmpCreateScreenStyle.createEmpTextBox} placeholder="Mobile Number"
                            placeholderTextColor="#cbcbcb"
                            keyboardType="number-pad"
                            returnKeyType="go" autoCorrect={false}
                            value={PhoneNumber}
                            onSubmitEditing={() => txtEmailRef.current.focus()}
                            onChangeText={(text) => setPhoneNumber(text)}
                            ref={txtMobileRef}
                        />
                    </View>
                    <View>
                        <Text
                            style={EmpCreateScreenStyle.createEmployeeLabel}>
                            Email:
                        </Text>
                        <TextInput style={EmpCreateScreenStyle.createEmpTextBox} placeholder="Email"
                            placeholderTextColor="#cbcbcb"
                            returnKeyType="go" autoCorrect={false}
                            value={Email}
                            onChangeText={(text) => setEmail(text)}
                            ref={txtEmailRef}
                        />
                    </View>

                    <View style={EmpSetScreenStyle.RadioBtnView}>
                        <RadioButton innerCircleColor='green'
                            currentValue={value}
                            value={"Male"} onPress={() => handleOnPress("Male")}>
                            <Text style={EmpSetScreenStyle.RadioBtnFirst}>
                                Male
                            </Text>
                        </RadioButton>

                        <RadioButton innerCircleColor='green'
                            currentValue={value} value={"Female"}
                            onPress={() => handleOnPress('Female')}>
                            <Text style={EmpSetScreenStyle.RadioBtnFirst}>
                                Female
                            </Text>
                        </RadioButton>

                        <RadioButton innerCircleColor='green'
                            currentValue={value} value={"Other"}
                            onPress={() => handleOnPress('Other')}>
                            <Text style={EmpSetScreenStyle.RadioBtnLast}>
                                Other
                            </Text>
                        </RadioButton>
                    </View>
                    <View style={EmpSetScreenStyle.ModalAddEmpLastRow}>
                        <View style={EmpSetScreenStyle.AutoCheckRow}>
                            <Text style={EmpSetScreenStyle.AutoCheckText}>
                                Auto Check Point
                            </Text>
                        </View>
                        <View
                            style={[
                                (Platform.OS === 'android') ?
                                    (EmpSetScreenStyle.CheckpointSliderViewAndroid) :
                                    (EmpSetScreenStyle.CheckpointSliderViewIos)
                            ]}>
                            <Text style={[
                                (Platform.OS === 'android') ?
                                    (EmpSetScreenStyle.CheckpointSliderAndroidText) :
                                    (EmpSetScreenStyle.CheckpointSliderIosText)
                            ]}>
                                {IsAutoCheckPoint ? 'ON' : 'OFF'}
                            </Text>
                            <Switch
                                onValueChange={toggleSwitch}
                                value={IsAutoCheckPoint}
                            />
                        </View>
                    </View>
                    {
                        renderCheckPointTime()
                    }

                    <View style={{
                        alignSelf: 'center',
                        justifyContent: 'flex-end',
                        marginBottom: 20,
                    }}>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Modal style={[EmpSetScreenStyle.modal2]} position={"center"} isOpen={modalforusername}
                backdropPressToClose={false}
            // onOpened={() => this.setState({ floatButtonHide: true })}
            // onClosed={() => this.setState({ floatButtonHide: false })}
            >
                <View style={EmpSetScreenStyle.modalUserFirstView}>
                    <View style={{ alignItems: "flex-start" }}></View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => closeSuccessModal()} style={EmpSetScreenStyle.modalUserTuachableOpacity}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={EmpSetScreenStyle.modelContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                        SUCCESSFUL
                    </Text>
                    <View
                        style={EmpSetScreenStyle.horizontalLine}
                    />
                    <Image resizeMode="contain" style={EmpSetScreenStyle.addPeopleImg} source={require('../../../../assets/images/successful.png')}>
                    </Image>
                </View>
                <View style={EmpSetScreenStyle.modalUserTextvaluecontainer}>
                    <Text style={{ color: '#757575', paddingVertical: 10, textAlign: 'center' }}>
                        Your employee added successfully send this info to log into employee's account. Mail already sent to employee.
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserUserName}>
                        USERNAME
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserUservalue}>
                        {PhoneNumber}
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserGeneratedPass}>
                        GENERATED PASSWORD
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserGenratedpassvalue}>
                        {successMessage}
                    </Text>
                </View>
                <TouchableOpacity style={EmpSetScreenStyle.addCopyBtn} onPress={() => copyToClicpBord(PhoneNumber, successMessage)} >
                    <Text style={EmpSetScreenStyle.testCopy}>Copy</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default CreateEmployeeScreen;