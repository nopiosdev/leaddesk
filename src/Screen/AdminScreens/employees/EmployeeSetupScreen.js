import React, { createRef, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform, StatusBar, ToastAndroid,
    Switch, Alert, View, BackHandler,
    Text, FlatList, Image, ScrollView, Share, ActivityIndicator,
    TouchableOpacity, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modalbox';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { FontAwesome } from '@expo/vector-icons';
import ModalSelector from 'react-native-modal-selector';
import { NoticeStyle } from '../notice/NoticeStyle';
import { EmpSetScreenStyle } from './EmpSetScreenStyle';
import { CommonStyles } from '../../../common/CommonStyles';
import RadioButton from 'radio-button-react-native';
import { GetEmployeeWithCompanyId, UpdateEmployee } from "../../../services/AccountService";
import { GetDepartmentByCompanyId, } from "../../../services/DepartmentService";
import { urlResource } from '../../../Utils/config';
import LocalStorage from '../../../common/LocalStorage';
import { useSelector } from 'react-redux';
import { Clipboard } from '@react-native-community/clipboard'
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../components/Header';

const EmployeeSetupScreen = ({ navigation, route }) => {

    const [value, setvalue] = useState('Male');
    const [date, setdate] = useState(new Date());
    const [departmentList, setdepartmentList] = useState([]);
    const [DeptName, setDeptName] = useState('');
    const [DeptId, setDeptId] = useState('');
    const [companyList, setcompanyList] = useState([]);
    const [employeeList, setemployeeList] = useState([]);
    const [EmpImageFileName, setEmpImageFileName] = useState(null);
    const [Address, setAddress] = useState('');
    const [phone, setphone] = useState('');
    const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false);
    const [isDateTimePickerVisible1, setisDateTimePickerVisible1] = useState(false);
    const [Name, setName] = useState('');
    const [Phone, setPhone] = useState('');
    const [Email, setEmail] = useState('');
    const [EmployeeUserId, setEmployeeUserId] = useState(0);
    const [EmpUserFullName, setEmpUserFullName] = useState('');
    const [EmpCompanyName, setEmpCompanyName] = useState('');
    const [EmpDesignation, setEmpDesignation] = useState('');
    const [EmpPhoneNumber, setEmpPhoneNumber] = useState('');
    const [EmpUserName, setEmpUserName] = useState('');
    const [EmployeeCode, setEmployeeCode] = useState('');
    const [EmpUser, setEmpUser] = useState('');
    const [IsAutoCheckPoint, setIsAutoCheckPoint] = useState(false);
    const [AutoCheckPointTime, setAutoCheckPointTime] = useState('1:00:00');
    const [MaximumOfficeHours, setMaximumOfficeHours] = useState('8:00:00');
    const [OfficeOutTime, setOfficeOutTime] = useState('00:30:00');
    const [Employee, setEmployee] = useState({ UserName: '', Password: '', DepartmentId: '' });
    const [ImageFileId, setImageFileId] = useState('');
    const [ImageFileName, setImageFileName] = useState('');
    const [UserId, setUserId] = useState('');
    const [PickerSelectedVal, setPickerSelectedVal] = useState('');
    const [floatButtonHide, setfloatButtonHide] = useState(false);
    const [company, setcompany] = useState({ slectedCompanyIndex: 0, selctedCompanyValue: '' });
    const [isDisabled, setisDisabled] = useState(false);
    const [swipeToClose, setswipeToClose] = useState(false);
    const [backdropPressToClose, setbackdropPressToClose] = useState(false);
    const [CompanyName, setCompanyName] = useState('');
    const [CompanyAddress, setCompanyAddress] = useState('');
    const [CompanyMobileNo, setCompanyMobileNo] = useState('');
    const [DepartmentName, setDepartmentName] = useState('');
    const [TrackType, setTrackType] = useState('');
    const [companyId, setcompanyId] = useState('');
    const [Dept, setDept] = useState({ DepartmentName: '' });
    const [UserFullName, setUserFullName] = useState('');
    const [UserName, setUserName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Password, setPassword] = useState('');
    const [Designation, setDesignation] = useState('');
    const [DepartmentId, setDepartmentId] = useState('');
    const [CopyUsername, setCopyUsername] = useState('');
    const [CopyPassword, setCopyPassword] = useState('');
    const [successMessage, setsuccessMessage] = useState('');
    const [serverMadePasscode, setserverMadePasscode] = useState('');
    const [progressVisible, setprogressVisible] = useState(true);
    const [newpassword, setnewpassword] = useState('');
    const [resetId, setresetId] = useState('');
    const [resetToken, setresetToken] = useState('');
    const [uName, setuName] = useState('');
    const [IsActive, setIsActive] = useState(false);
    const [ModaladdPeople, setModaladdPeople] = useState(false);
    const [deleteId, setdeleteId] = useState(null);
    const [modal2, setmodal2] = useState(false);
    const [modalforusername, setmodalforusername] = useState(false);
    const [modalforEmpList, setmodalforEmpList] = useState(false);
    const user = useSelector((state) => state.user.currentUser);
    const [modalforEmpEdit, setmodalforEmpEdit] = useState(false);
    const [ModalForDeptSelection, setModalForDeptSelection] = useState(false);
    const [isLoaded, setisLoaded] = useState(false);
    const [modalResetPassword, setmodalResetPassword] = useState(false);
    const [selctedCompanyValue, setselctedCompanyValue] = useState(null);
    const [selctedCompanyIndex, setselctedCompanyIndex] = useState(null);
    const txtDesignationRef = createRef();
    const textmobileRef = createRef();
    const textmailRef = createRef();
    const isFocused = useIsFocused();

    // const handleOnPress = (value) => {
    //     setvalue(value);
    // }
    const toggleSwitch = value => {
        setIsAutoCheckPoint(value);
    };
    const toggleIsActiveSwitch = value => {
        setIsActive(value);
    };
    const handleBackButton = () => {
        navigation.goBack();
        return true;
    }
    // const openModalforaddpeople = () => {

    //     setEmployee({ DepartmentId: '' })
    //     setIsAutoCheckPoint(false);
    //     setModaladdPeople(true);
    // }
    // const alertmethod = (id) => {
    //     setdeleteId(id);
    //     Alert.alert(
    //         "",
    //         'Are You Sure?',
    //         [
    //             { text: 'NO', onPress: () => console.log('Cancel Pressed!') },
    //             { text: 'YES', onPress: () => DeleteEmployeemethod() },
    //         ],
    //         { cancelable: false }
    //     )
    // }
    // const DeleteEmployeemethod = async () => {
    //     try {
    //         await DeleteEmployee(deleteId)
    //             .then(res => {
    //                 Alert.alert(
    //                     "",
    //                     "successfully Deleted",
    //                     [
    //                         { text: 'OK', },
    //                     ],
    //                     { cancelable: false }
    //                 )
    //                 getEmpAllWithCompanyId(companyId)
    //             })
    //             .catch(() => {
    //                 Alert.alert(
    //                     "Not Deleted",
    //                     "Please try again...",
    //                     [
    //                         { text: 'OK', },
    //                     ],
    //                     { cancelable: false }
    //                 )
    //                 console.log("error occured");
    //             });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            getDepartment(cId);
            setcompanyId(cId);
            getEmpAllWithCompanyId(cId);
        })();
    }, [isFocused])

    // const openModal2 = () => {
    //     getCompany();
    //     setmodal2(true);
    // }

    // const openmodalforEmpList = () => {
    //     getCompany();
    //     setmodalforEmpList(true);
    // }
    // const _bootstrapAsync = () => {
    //     setName(user?.UserFullName);
    //     setPhone(user?.PhoneNumber);
    //     setEmail(user?.Email);
    // }

    const getEmpAllWithCompanyId = async (companyId) => {
        try {
            setprogressVisible(true);
            await GetEmployeeWithCompanyId(companyId)
                .then(res => {
                    setemployeeList(res);
                    setEmpImageFileName(res?.ImageFileName);
                    console.log(res, 'EmpREault...............')
                    setprogressVisible(false);
                })
                .catch(() => {
                    setprogressVisible(false);
                    console.log("error occured");
                });
        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
    }

    const closeModal = () => {
        updateEmployeeRecords();
    }

    const updateEmployeeRecords = async () => {
        console.log('EmpDesignation', EmpDesignation)
        var data = new FormData();
        data.append('UserFullName', EmpUserName);
        data.append('EmployeeCode', EmployeeCode);
        data.append('Designation', EmpDesignation);
        data.append('Id', EmployeeUserId);
        data.append('IsAutoCheckPoint', IsAutoCheckPoint ? 1 : 0);
        data.append('AutoCheckPointTime', AutoCheckPointTime);
        data.append('ImageFileName', ImageFileName);
        data.append('ImageFileId', ImageFileId);
        data.append('IsActive', IsActive ? 1 : 0);

        console.log(data, '.....data')
        try {
            let response = await UpdateEmployee(data);
            console.log('empr', response);
            setserverMadePasscode(response?.message)
            if (response.success) {
                ToastAndroid.show('Successfully Updated', ToastAndroid.TOP);
                getEmpAllWithCompanyId(companyId);
                setmodalforEmpEdit(false);

            } else {
                ToastAndroid.show(response.message, ToastAndroid.TOP);
                setprogressVisible(false);
            }
        } catch (errors) {
            // alert("data does not saved");
            ToastAndroid.show("Data does not saved", ToastAndroid.TOP);
            setprogressVisible(false);
        }
    }

    // const closeModalForDeptSelection = () => {
    //     if (Dept.DepartmentName == '') {
    //         ToastAndroid.show('Department can not be empty', ToastAndroid.TOP);

    //     } else {
    //         setModalForDeptSelection(false);
    //         onFetchDepartmentRecords();
    //     }

    // }
    // const testmethos = async (item) => {
    //     setDeptName(item?.Text);
    //     setDeptId(item?.Value);
    // }

    // const onFetchDepartmentRecords = async () => {
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
    //             setdepartmentList(depList)
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
    // const closemodalchangepassword = () => {
    //     setprogressVisible(true);
    //     if (Employee.Password == "") {
    //         alert("Field can not be empty")
    //         setprogressVisible(false);
    //     }
    //     else if (Employee.Password.length < 6) {
    //         alert("Password must be at least 6 Characters");
    //         setprogressVisible(false);

    //     }
    //     else {
    //         changepassword();
    //         setprogressVisible(false);
    //     }
    // }
    // const changepassword = async () => {
    //     console.log("trying changepassword..");
    //     try {
    //         setprogressVisible(true);
    //         let UserModel = {
    //             NewPassword: Employee.Password,
    //             UserId: resetId,
    //             Token: resetToken
    //         };

    //         let response = await ChangePasswordforEmp(UserModel);
    //         console.log('logins..', response);
    //         if (response && response.isSuccess) {
    //             setmodalResetPassword(false);
    //             openModal2();
    //             setprogressVisible(false);
    //         } else {
    //             setprogressVisible(false);
    //             alert("Password Not Updated. Please try again");
    //         }
    //     } catch (errors) {
    //         setprogressVisible(false);
    //         console.log(errors);
    //     }
    // }
    // const openmodalResetPassword = (id, username, user) => {
    //     setresetId(id);
    //     setuName(user);
    //     const userid = id;
    //     const Username = username;
    //     generateRePassword(Username);
    //     getTokenforResetEmpRestPass(userid);
    //     setmodalResetPassword(true);
    // }
    // const getTokenforResetEmpRestPass = async (id) => {
    //     try {
    //         // let userId = this.props.userId;
    //         await getTokenforResetEmptPass(id)
    //             .then(res => {
    //                 const ob = res.result;
    //                 alert
    //                 console.log('tokenforreset........', ob);
    //                 setresetToken(ob);
    //             })
    //             .catch(() => {
    //                 console.log("error occured");
    //                 alert('failor');
    //             });
    //     } catch (error) {
    //         console.log(error);
    //         alert('failor')
    //     }
    // }

    // const openModaladdPeople = () => {

    //     if (UserFullName == "") {
    //         ToastAndroid.show('Employee Name can not be empaty', ToastAndroid.SHORT);
    //     } else if (Designation == "") {
    //         ToastAndroid.show('Employee Designation can not be empaty', ToastAndroid.SHORT);
    //     }
    //     else if (PhoneNumber == "") {
    //         ToastAndroid.show('Employee PhoneNumber can not be empaty', ToastAndroid.SHORT);
    //     }
    //     else if (Email == "") {
    //         ToastAndroid.show('Employee Email can not be empaty', ToastAndroid.SHORT);
    //     }
    //     else if (Employee.DepartmentId == "") {
    //         ToastAndroid.show('Please Select Department', ToastAndroid.SHORT);
    //     }
    //     else {
    //         getUniqueUserName();
    //         onFetchEmployeeRecords();
    //     }
    // }
    // const getUniqueUserName = async () => {

    //     const newUser = PhoneNumber;
    //     console.log(newUser);
    //     setEmployee({ UserName: newUser })
    // }

    const onShare = async (username, password) => {
        try {
            const result = await Share.share({
                message:
                    "UserName: " + username + " Password: " + password
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const copyToClicpBord = (username, password) => {
        setCopyUsername(username);
        setCopyPassword(password);
        Clipboard.setString("UserName: " + username + " Password: " + password);
        ToastAndroid.show('Text copied to clipboard', ToastAndroid.SHORT);
        setTimeout(
            () => {
                setmodalforusername(true);
            },
            100,
        );
        onShare(username, password);
    }

    // const onFetchEmployeeRecords = async () => {
    //     let data = {
    //         UserFullName: UserFullName,
    //         PhoneNumber: PhoneNumber,
    //         UserType: 7,
    //         Designation: Designation,
    //         DepartmentId: Employee.DepartmentId,
    //         CompanyId: companyId,
    //         Gender: value,
    //         Email: Email,
    //         IsAutoCheckPoint: IsAutoCheckPoint,
    //         AutoCheckPointTime: AutoCheckPointTime,
    //         MaximumOfficeHours: MaximumOfficeHours,
    //         OfficeOutTime: OfficeOutTime,
    //         IsActive: IsActive
    //     };
    //     try {

    //         console.log(data, '....tex');
    //         let response = await CreateEmployee(data)
    //         console.log('empr', response);
    //         setsuccessMessage(response?.Message);
    //         if (response && response?.Success) {
    //             setModaladdPeople(false);
    //             getEmpAllWithCompanyId(companyId);
    //             setmodalforusername(true);
    //         } else {
    //             ToastAndroid.show(response.Message, ToastAndroid.TOP);
    //         }
    //     } catch (errors) {
    //         console.log(errors);
    //     }
    // }
    const getDepartment = async (companyId) => {
        try {
            await GetDepartmentByCompanyId(companyId)
                .then(res => {
                    console.log('comlen', res);
                    if (res !== null) {
                        console.log('comlen2', res);
                        if (res?.length > 0) {
                            const depList = [];
                            res?.forEach(function (item) {
                                const ob = {
                                    // 'Text': item.DepartmentName,
                                    // 'Value': item.Id
                                    'key': item.Id,
                                    'label': item.DepartmentName,
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

    const goToEmpDetail = (item) => {
        console.log(item, 'testItem......')
        setEmployeeUserId(item?.Id);
        setEmpDesignation(item.Designation);
        setEmpPhoneNumber(item.PhoneNumber);
        setUserName(item.UserName);
        setEmpUserName(item?.UserName);
        setEmployeeCode(item?.EmployeeCode);
        setIsAutoCheckPoint(item?.IsAutoCheckPoint === 1 ? true : false);
        setAutoCheckPointTime(item?.AutoCheckPointTime);
        setImageFileName(item?.ImageFileName);
        setIsActive(item?.IsActive === 1 ? true : false);
        setmodalforEmpEdit(true);
    };

    // const getCompany = async () => {
    //     try {
    //         await GetCompanyByUserId(user?.Id)
    //             .then(res => {
    //                 console.log('company', res.result);
    //                 if (res.result === null) {
    //                     openModal5();
    //                 } else if (res.result.length > 0) {

    //                     const cList = [];
    //                     res.result.forEach(function (item) {
    //                         const ob = {
    //                             'Text': item.CompanyName,
    //                             'Value': item.Id,
    //                             'Address': item.Address,
    //                             'phone': item.PhoneNumber,
    //                             'MaximumOfficeHours': item.MaximumOfficeHours,
    //                             'OfficeOutTime': item.OfficeOutTime,
    //                         }
    //                         cList.push(ob);
    //                     });
    //                     setcompanyList(cList);
    //                     setselctedCompanyValue(companyList[0]?.Text);
    //                     setselctedCompanyIndex(companyList[0]?.Value);
    //                 }
    //                 if (companyList.length > 0) {
    //                     getDepartment(companyId);
    //                     getEmpAllWithCompanyId(companyId)
    //                 }
    //             })
    //             .catch(() => {
    //                 console.log("error occured");
    //             });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const goToCreatScreen = () => {
        navigation.navigate('EmployeeCreateScreen')
    }
    const _showDateTimePicker1 = () => setisDateTimePickerVisible1(true);

    const _hideDateTimePicker1 = () => setisDateTimePickerVisible1(false);

    const _handleDatePicked1 = (date) => {
        setAutoCheckPointTime(moment(date).format("HH:mm:ss"));
        console.log('A date has been picked: ', moment(date).format("HH:mm:ss"));
        _hideDateTimePicker1();
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
                                style={EmpSetScreenStyle.inputstylecom}
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
        <View style={EmpSetScreenStyle.container}>
            {/* <KeyboardAvoidingView style={{ flex: 1 }}> */}
            <Header
                title={'Employee Setup'}
                onPress={() => { navigation.goBack() }}
                goBack={true}
                btnAction={() => goToCreatScreen()}
                btnTitle='NEW'
                btnContainerStyle={NoticeStyle.ApplyTextButtonforNotice}
                btnStyle={NoticeStyle.plusButtonforCompany}
            />
            {progressVisible == true ?
                (<ActivityIndicator size="large" color="#1B7F67"
                    style={EmpSetScreenStyle.ActivityIndicatorStyle} />) :
                <View style={{ flex: 1, marginTop: 10, }}>
                    <FlatList
                        data={employeeList}
                        keyExtractor={(x, i) => i.toString()}
                        renderItem={({ item }) =>
                            <View style={EmpSetScreenStyle.FlatlistMainView}>
                                <View style={EmpSetScreenStyle.FlLeftside}>
                                    <View style={{ paddingRight: 10, }}>
                                        {item.ImageFileName && item.ImageFileName !== 'null' ?
                                            (<Image style={EmpSetScreenStyle.imageradious} resizeMode="contain" source={{ uri: urlResource + item.ImageFileName }} />)
                                            :
                                            (<Image style={
                                                EmpSetScreenStyle.imageradious
                                            } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />)
                                        }
                                    </View>
                                    <View>
                                        <Text style={EmpSetScreenStyle.EmpText}>
                                            {item.UserName}
                                        </Text>
                                        <Text style={EmpSetScreenStyle.EmpText}>
                                            {item.Designation}
                                        </Text>

                                        <Text style={EmpSetScreenStyle.EmpText}>
                                            {item.DepartmentName}
                                        </Text>
                                    </View>
                                </View>
                                <View style={EmpSetScreenStyle.FlRightSide}>
                                    <TouchableOpacity
                                        onPress={() => goToEmpDetail(item)}
                                    >
                                        <View style={EmpSetScreenStyle.FlRightSideRow}>
                                            <Image resizeMode='contain'
                                                style={EmpSetScreenStyle.EmpSettingImage}
                                                source={require('../../../../assets/images/edit.png')}></Image>
                                            <Text style={EmpSetScreenStyle.EmpSettingText}>
                                                EDIT
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={EmpSetScreenStyle.FlRightSideRow}>

                                        {item.IsActive ?
                                            <Text style={EmpSetScreenStyle.EmpText}>
                                                Active
                                            </Text> :
                                            <Text style={EmpSetScreenStyle.EmpText}>
                                                InActive
                                            </Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
            }
            {/* <Modal style={[EmpSetScreenStyle.AddEmployeeModalStyle]}
                position={"center"}
                isOpen={ModaladdPeople}
                isDisabled={isDisabled}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "column" }}>
                    <View style={{ alignItems: "flex-start" }}></View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setModaladdPeople(false)}
                            style={EmpSetScreenStyle.ModalCloseBtn}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={EmpSetScreenStyle.modelContent}>

                    <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                        ADD PEOPLE
                    </Text>

                    <View style={EmpSetScreenStyle.horizontalLine}>

                    </View>

                </View>

                <KeyboardAvoidingView
                    // behavior="padding"
                    style={{
                        // flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TextInput style={EmpSetScreenStyle.inputBox}
                            placeholder="Employee Name"
                            placeholderTextColor="#cbcbcb"
                            returnKeyType="next" autoCorrect={false}
                            onChangeText={(text) => setUserFullName(text)}
                            onSubmitEditing={() => txtDesignationRef.current.focus()}
                        />

                        <TextInput style={EmpSetScreenStyle.inputBox}
                            placeholder="Designation"
                            placeholderTextColor="#cbcbcb"
                            returnKeyType="next" autoCorrect={false}
                            ref={txtDesignationRef}
                            onChangeText={(text) => setDesignation(text)}
                            onSubmitEditing={() => textmobileRef.current.focus()}
                        />
                        <View style={{ flexDirection: 'row' }}>

                            <ModalSelector
                                style={EmpSetScreenStyle.ModalSelectorStyle}
                                data={departmentList}
                                initValue="Select Department"
                                onChange={(option) => {
                                    const newUser = option.key
                                    setEmployee({ DepartmentId: newUser });
                                }}
                            />
                            <TouchableOpacity onPress={() => setModalForDeptSelection(true)}

                                style={[
                                    (Platform.OS === 'android') ?
                                        (EmpSetScreenStyle.ModalForDeptSelectionAndroid) :

                                        (EmpSetScreenStyle.ModalForDeptSelectionIos)
                                ]}>
                                <Text style={[
                                    (Platform.OS === 'android') ?
                                        { textAlign: "center" } :
                                        { textAlign: "center", marginTop: -5 }
                                ]}>

                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput style={EmpSetScreenStyle.inputBox} placeholder="Mobile Number"
                            placeholderTextColor="#cbcbcb"
                            keyboardType="number-pad"
                            returnKeyType="go" autoCorrect={false}
                            onSubmitEditing={() => textmailRef.current.focus()}
                            onChangeText={(text) => setPhoneNumber(text)}
                            ref={textmobileRef}
                        />
                        <TextInput style={EmpSetScreenStyle.inputBox} placeholder="Email"
                            placeholderTextColor="#cbcbcb"
                            returnKeyType="go" autoCorrect={false}
                            onChangeText={(text) => setEmail(text)}
                            ref={textmailRef}
                        />
                        <View style={EmpSetScreenStyle.RadioBtnView}>
                            <RadioButton innerCircleColor='green'
                                currentValue={value}
                                value={"Male"} onPress={handleOnPress}>
                                <Text style={EmpSetScreenStyle.RadioBtnFirst}>
                                    Male
                                </Text>
                            </RadioButton>

                            <RadioButton innerCircleColor='green'
                                currentValue={value} value={"Female"}
                                onPress={handleOnPress}>
                                <Text style={EmpSetScreenStyle.RadioBtnFirst}>
                                    Female
                                </Text>
                            </RadioButton>

                            <RadioButton innerCircleColor='green'
                                currentValue={value} value={"Other"}
                                onPress={handleOnPress}>
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
                        <View style={{
                            alignSelf: 'center',
                            justifyContent: 'flex-end',
                            marginBottom: 20,
                        }}>
                            <TouchableOpacity style={EmpSetScreenStyle.addPeopleBtn}
                                onPress={() => openModaladdPeople()} >
                                <Text
                                    style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                    Add
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

            </Modal> */}
            <Modal
                style={[EmpSetScreenStyle.modal2]}
                position={"center"}
                isOpen={modalforusername}
                isDisabled={isDisabled}
                // onClosed={() => this.setState({ floatButtonHide: !floatButtonHide })}
                backdropPressToClose={false}
            // onOpened={() => this.setState({ floatButtonHide: true })}
            // onClosed={() => this.setState({ floatButtonHide: false })}
            >
                <View style={EmpSetScreenStyle.modalUserFirstView}>
                    <View style={{ alignItems: "flex-start" }}></View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalforusername(false)} style={EmpSetScreenStyle.modalUserTuachableOpacity}>
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
                        Your employee added successfully send this info to log into employee's account.Mail already sent to employee.
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserUserName}>
                        USERNAME
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserUservalue}>
                        {UserName}
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserGeneratedPass}>
                        GENERATED PASSWORD
                    </Text>
                    <Text style={EmpSetScreenStyle.modalUserGenratedpassvalue}>
                        {successMessage}
                    </Text>
                </View>
                <TouchableOpacity style={EmpSetScreenStyle.addCopyBtn} onPress={() => copyToClicpBord(UserName, successMessage)} >
                    <Text style={EmpSetScreenStyle.testCopy}>Copy</Text>
                </TouchableOpacity>
            </Modal >

            {/* <Modal style={[EmpSetScreenStyle.modal31]} position={"center"} isOpen={modalResetPassword} isDisabled={isDisabled}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "column" }}>
                    <View style={{ alignItems: "flex-start" }}></View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalResetPassword(false)} style={{
                            marginLeft: 0, marginTop: 0,
                        }}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={EmpSetScreenStyle.modelContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'gray' }}>
                        Reset Password
                    </Text>
                    <View
                        style={EmpSetScreenStyle.horizontalLine}
                    />
                    <Image resizeMode="contain" style={EmpSetScreenStyle.addPeopleImg} source={require('../../../../assets/images/people.png')}>
                    </Image>
                </View>
                <View style={{ alignItems: 'center', }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10, }}>
                        <Text style={{ color: 'black', paddingVertical: 3, fontSize: 18, fontWeight: 'bold' }}>
                            USERNAME:
                        </Text>
                        <Text style={{ color: '#504C4B', paddingVertical: 0, fontSize: 20, fontWeight: 'bold', marginLeft: 5 }}>
                            {uName}
                        </Text>
                    </View>
                    <TextInput style={EmpSetScreenStyle.inputBox1}
                        placeholderTextColor="#cbcbcb"
                        returnKeyType="next" autoCorrect={false}
                        // ref={"txtpass"}
                        value={Employee.Password}
                        onChangeText={(pass) => {
                            const newpass = Object.assign({}, Employee, { Password: pass });
                            setEmployee(newpass);
                        }}
                        ref={txtDesignationRef}
                    />
                    <TouchableOpacity style={EmpSetScreenStyle.addPeopleBtn} onPress={() => closemodalchangepassword()} >
                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal> */}
            <Modal style={[EmpSetScreenStyle.modalForEditProfile]} position={"center"} isOpen={modalforEmpEdit} isDisabled={isDisabled}
                backdropPressToClose={false}
                swipeToClose={false}
            >

                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalforEmpEdit(false)} style={EmpSetScreenStyle.modalEmpEdit}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={EmpSetScreenStyle.modelContent}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                            EDIT EMPLOYEE
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'column', }}>
                        <Text>Name</Text>
                        <TextInput
                            style={EmpSetScreenStyle.modalEmpEditTextBox}
                            value={EmpUserName}
                            onChangeText={(txt) => setEmpUserName(txt)}
                        />
                        <Text>Designation</Text>
                        <TextInput
                            style={EmpSetScreenStyle.modalEmpEditTextBox}
                            value={EmpDesignation}
                            onChangeText={(txt) => setEmpDesignation(txt)}
                        />
                        <Text>Phone Number</Text>
                        <TextInput
                            style={EmpSetScreenStyle.modalEmpEditTextBox}
                            // editable={false}
                            value={EmpPhoneNumber}
                            onChangeText={(txt) => setEmpPhoneNumber(txt)}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text>Is Active ?</Text>
                            <Switch
                                onValueChange={toggleIsActiveSwitch}
                                value={IsActive}
                            />
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
                                    {IsAutoCheckPoint == 1 ? 'ON' : 'OFF'}
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
                        <TouchableOpacity style={EmpSetScreenStyle.addPeopleBtn} onPress={() => closeModal()} >
                            <Text style={EmpSetScreenStyle.modalEmpEditSave}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* </KeyboardAvoidingView> */}
        </View >

    );
}
export default EmployeeSetupScreen; 
