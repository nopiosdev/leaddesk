import React, { createRef } from 'react';
import {
    Platform, StatusBar, ToastAndroid, Dimensions, KeyboardAvoidingView,
    Alert, View, BackHandler, Text, FlatList, Image, ScrollView,
    ActivityIndicator, TouchableOpacity, TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import moment from 'moment';
import {
    FontAwesome,
} from '@expo/vector-icons'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { CreateCompany, GetCompanyByUserId, GetCompanyByIdentity, updatedeCompany } from '../../../services/CompanyService';
import { NoticeStyle } from '../../AdminScreens/notice/NoticeStyle'
import { CompanySetupStyle } from './CompanySetupStyle'
import { useState } from 'react';
import { useEffect } from 'react';
import LocalStorage from '../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import Header from '../../../components/Header';


const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
function StatusBarPlaceHolder() {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#F3F3F3',
        }}>
            <StatusBar
            // barStyle="light-content"
            />
        </View>
    );
}

const CompanysetupScreen = ({ navigation, route }) => {

    const [date, setdate] = useState(new Date());
    const [companyList, setcompanyList] = useState([]);
    const [ComName, setComName] = useState('');
    const [ComId, setComId] = useState('');
    const [Address, setAddress] = useState('');
    const [phone, setphone] = useState('');
    const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false);
    const [isDateTimePickerVisible1, setisDateTimePickerVisible1] = useState(false);
    const [IsAutoCheckPoint, setIsAutoCheckPoint] = useState(false);
    const [selectedStartDate, setselectedStartDate] = useState(null);
    const [PortalUserId, setPortalUserId] = useState('');
    const [UserId, setUserId] = useState('');
    const [isDisabled, setisDisabled] = useState(false);
    const [swipeToClose, setswipeToClose] = useState(false);
    const [backdropPressToClose, setbackdropPressToClose] = useState(false);
    const [CompanyName, setCompanyName] = useState('');
    const [CompanyAddress, setCompanyAddress] = useState('');
    const [CompanyMobileNo, setCompanyMobileNo] = useState('');
    const [DepartmentName, setDepartmentName] = useState('');
    const [MaximumOfficeHours, setMaximumOfficeHours] = useState('00:30:00');
    const [OfficeOutTime, setOfficeOutTime] = useState('');
    const [progressVisible, setprogressVisible] = useState(true);
    const [refreshing, setrefreshing] = useState(false);
    const [modal2, setmodal2] = useState(false);
    const [modal4, setmodal4] = useState(false);
    const [modalforEmpList, setmodalforEmpList] = useState(false);
    const [modalcomupdate, setmodalcomupdate] = useState(false);
    const [companyid, setcompanyid] = useState(null);
    const isFocused = useIsFocused();
    const user = useSelector((state) => state.user.currentUser);
    const [selctedCompanyValue, setselctedCompanyValue] = useState('');
    const [selctedCompanyindex, setselctedCompanyIndex] = useState('');
    const AddressRef = createRef();
    const PhoneRef = createRef();

    const _showDateTimePicker = () => setisDateTimePickerVisible(true);

    const _hideDateTimePicker = () => setisDateTimePickerVisible(false);

    const _handleDatePicked = (date) => {
        setMaximumOfficeHours(moment(date).format("HH:mm:ss"));
        console.log('A date has been picked: ', moment(date).format("HH:mm:ss"));

        _hideDateTimePicker();
        // alert( moment(date).format("HH:mm:ss"));
    }
    const _showDateTimePicker1 = () => setisDateTimePickerVisible1(true);

    const _hideDateTimePicker1 = () => setisDateTimePickerVisible1(false);

    const _handleDatePicked1 = (date) => {
        setOfficeOutTime(moment(date).format("HH:mm:ss"));
        console.log('A date has been picked: ', moment(date).format("HH:mm:ss"));

        _hideDateTimePicker1();
        // alert( moment(date).format("HH:mm:ss"));
    }

    useEffect(() => {
        (async () => {
            getCompany();
            const companyid = await LocalStorage.GetData("companyId");
            setcompanyid(companyid);
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

    const _EditCom = async (item) => {
        methodforcom(item);
        setmodalcomupdate(true);
        // this.refs.modal3.close();
    }

    const methodforcom = async (item) => {
        setComName(item?.Text);
        setComId(item?.Value);
        setAddress(item?.Address);
        setphone(item?.phone);
        setMaximumOfficeHours(item?.MaximumOfficeHours);
        setOfficeOutTime(item?.OfficeOutTime);
    }

    const closemodalForupdateCom = () => {
        if (ComName == "" && Address == "" && phone == "") {
            ToastAndroid.show('Field can not be empty', ToastAndroid.TOP);
        }
        else {
            setmodalcomupdate(false);
            updateCom();
        }
    }
    const updateCom = async () => {
        try {
            var data = new FormData();
            data.append('Id', ComId);
            data.append('CompanyName', ComName);
            data.append('Address', Address);
            data.append('PhoneNumber', phone);
            data.append('MaximumOfficeHours', MaximumOfficeHours);
            data.append('OfficeOutTime', OfficeOutTime);

            let response = await updatedeCompany(data);
            console.log('Company..', response);
            if (response.success) {
                getCompany();
                setComName('');
                setAddress('');
                setphone('');
                setComId('');
                setMaximumOfficeHours('');
                setOfficeOutTime('');
            } else {
                Alert.alert(
                    "",
                    `${response?.message}`,
                    [
                        { text: 'OK', },
                    ],
                    { cancelable: false }
                )
            }
        } catch (errors) {
            console.log(errors);
        }
    }

    const getCompany = async () => {
        try {
            setprogressVisible(true);
            await GetCompanyByUserId(user?.Id)
                .then(res => {
                    console.log('company', res);
                    if (res === null) {
                        setprogressVisible(false);
                    } else if (res.length > 0) {
                        const cList = [];
                        res?.forEach(function (item) {
                            const ob = {
                                'Text': item.CompanyName,
                                'Value': item.Id,
                                'Address': item.Address,
                                'phone': item.PhoneNumber,
                                'MaximumOfficeHours': item.MaximumOfficeHours,
                                'OfficeOutTime': item.OfficeOutTime,
                            }
                            cList.push(ob);
                        });
                        setcompanyList(cList);
                        setselctedCompanyValue(companyList[0]?.Text);
                        setselctedCompanyIndex(companyList[0]?.Value);
                        if (companyid == null || companyid == 0) {
                            LocalStorage.SetData("companyId", companyList[0].Value.toString());
                        }
                        setprogressVisible(false);
                    }
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
    const closeModal4 = () => {
        if (CompanyName == "") {
            ToastAndroid.show('CompanyName can not be empty', ToastAndroid.TOP);
        } else if (CompanyAddress == '') {
            ToastAndroid.show('Address can not be empty', ToastAndroid.TOP);
        } else if (CompanyMobileNo == '') {
            ToastAndroid.show('Phonenumber can not be empty', ToastAndroid.TOP);
        }
        else {
            onFetchCompanyRecords();
        }

    }
    const onFetchCompanyRecords = async () => {
        console.log("trying company create..");
        try {
            var data = new FormData();
            data.append('PortalUserId', user?.Id);
            data.append('CompanyName', CompanyName);
            data.append('Address', CompanyAddress);
            data.append('PhoneNumber', CompanyMobileNo);
            data.append('MaximumOfficeHours', MaximumOfficeHours);
            data.append('OfficeOutTime', OfficeOutTime);
            console.log(data, 'savetest')

            let response = await CreateCompany(data);
            console.log('com', response);

            if (response?.success) {
                getCompany();
                ToastAndroid.show(response?.message, ToastAndroid.TOP);
                setmodal4(false);
                setCompanyName('');
                setCompanyMobileNo('');
                setCompanyAddress('');
            } else {
                ToastAndroid.show(response?.message, ToastAndroid.TOP);
            }
        } catch (errors) {
            ToastAndroid.show("error" + errors, ToastAndroid.TOP);
        }
    }
    
    const openModal4 = () => {
        setmodal4(true);
    }

    var { width, } = Dimensions.get('window');

    return (
        <View style={CompanySetupStyle.container}>
            <StatusBarPlaceHolder />
            <Header
                title={'Company Setup'}
                onPress={() => { navigation.goBack() }}
                goBack={true}
                btnAction={() => openModal4()}
                btnTitle='NEW'
                btnContainerStyle={NoticeStyle.ApplyTextButtonforNotice}
                btnStyle={NoticeStyle.plusButtonforCompany}
            />
            {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, justifyContent: 'center', alignContent: 'center', }} />) : null}
            <View style={CompanySetupStyle.FlatListContainer}>
                <FlatList
                    data={companyList}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) =>
                        <View style={CompanySetupStyle.FlatListItemContainer}>
                            <View style={CompanySetupStyle.ListPart}>
                                <Text style={CompanySetupStyle.companyText}>{item.Text}</Text>
                                <View style={{ flexDirection: 'row', width: (width * 50) / 100, }}>
                                    <Image resizeMode="contain" style={CompanySetupStyle.locationIcon} source={require('../../../../assets/images/Path_87.png')}></Image>
                                    <Text style={CompanySetupStyle.locationText}>{item.Address}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: (width * 50) / 100, }}>
                                    <Image style={CompanySetupStyle.phoneIcon} source={require('../../../../assets/images/Path_86.png')}></Image>
                                    <Text style={CompanySetupStyle.phoneText}>{item.phone}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => _EditCom(item)} style={{ marginTop: 5, }}>
                                <View style={CompanySetupStyle.editCotainer}>
                                    <Image style={CompanySetupStyle.editImage} source={require('../../../../assets/images/edit.png')}></Image>
                                    <Text style={CompanySetupStyle.editText}>EDIT</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                />
                {/* <CompanyLists  itemList={companyList}/> */}
            </View>
            <Modal
                style={[CompanySetupStyle.modal3]}
                position={"center"} isOpen={modal4}
                isDisabled={isDisabled}
                backdropPressToClose={false}
                swipeToClose={true}
            >
                <View style={CompanySetupStyle.modalHeader}>
                    <View style={CompanySetupStyle.modalheaderLeft}></View>
                    <View style={CompanySetupStyle.modalheaderRight}>
                        <TouchableOpacity onPress={() => setmodal4(false)} style={CompanySetupStyle.closeTouchable}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={CompanySetupStyle.modelContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                        ADD COMPANY
                    </Text>
                    <Image resizeMode="contain" style={CompanySetupStyle.addPeopleImg} source={require('../../../../assets/images/company.png')}>
                    </Image>
                </View>

                <TextInput style={CompanySetupStyle.addCompanyinputBox} placeholder="Company Name"
                    placeholderTextColor="#cbcbcb"
                    returnKeyType="next" autoCorrect={false}
                    onSubmitEditing={() => AddressRef.current.focus()}
                    onChangeText={(text) => setCompanyName(text)}
                    value={CompanyName}
                />
                <TextInput style={CompanySetupStyle.addCompanyinputBox} placeholder="Address"
                    placeholderTextColor="#cbcbcb"
                    returnKeyType="next" autoCorrect={false}
                    ref={AddressRef}
                    onSubmitEditing={() => PhoneRef.current.focus()}
                    onChangeText={(text) => setCompanyAddress(text)}
                    value={CompanyAddress}
                />
                <TextInput style={CompanySetupStyle.addCompanyinputBox} placeholder="Mobile Number"
                    placeholderTextColor="#cbcbcb"
                    keyboardType="number-pad"
                    ref={PhoneRef}
                    returnKeyType="go" autoCorrect={false}
                    onChangeText={(text) => setCompanyMobileNo(text)}
                    value={CompanyMobileNo}
                />

                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text style={{
                        // marginTop: 10,
                        marginLeft: 20, justifyContent: 'flex-start'
                    }}>
                        Maximum Office Hours:
                    </Text>
                    <TouchableOpacity onPress={_showDateTimePicker}
                        style={{ marginRight: 18, justifyContent: "flex-end" }}
                    >
                        <View>
                            <TextInput
                                editable={false}
                                style={CompanySetupStyle.inputstylecom}
                                value={MaximumOfficeHours}
                            />
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={isDateTimePickerVisible}
                        onConfirm={_handleDatePicked}
                        onCancel={_hideDateTimePicker}
                        mode={'time'}
                    />
                </View>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        // marginTop: 10,
                        marginLeft: 20, justifyContent: 'flex-start',
                    }}>
                        Can Leave Before:
                    </Text>
                    <TouchableOpacity onPress={_showDateTimePicker1}
                        style={{ marginRight: 18, justifyContent: "flex-end" }}
                    >
                        <View>
                            <TextInput
                                editable={false}
                                style={CompanySetupStyle.inputstylecom}
                                value={OfficeOutTime}
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
                <TouchableOpacity style={CompanySetupStyle.addPeopleBtn} onPress={() => closeModal4()} >
                    <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', }}>Add</Text>
                </TouchableOpacity>
            </Modal>
            <Modal style={[CompanySetupStyle.modalforCreateCompany]}
                position={"center"} isOpen={modalcomupdate} isDisabled={isDisabled}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalcomupdate(false)}
                            style={CompanySetupStyle.closeTouchable}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={{}}>
                        <Text style={CompanySetupStyle.lablecompanyName}>
                            Company Name:
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            style={CompanySetupStyle.inputstyle}
                            value={ComName}
                            onChangeText={(txt) => setComName(txt)}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 5 }}>
                    <View style={{}}>
                        <Text style={CompanySetupStyle.lableAddress}>
                            Company Address:
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            style={CompanySetupStyle.inputstyle}
                            value={Address}
                            onChangeText={(txt) => setAddress(txt)}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 5 }}>
                    <View style={{}}>
                        <Text
                            style={CompanySetupStyle.labelphone}>
                            Company Phone:
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            style={CompanySetupStyle.inputstyle}
                            value={phone}
                            onChangeText={(txt) => setphone(txt)}
                        />
                    </View>
                </View>
                <View style={CompanySetupStyle.labelContainerMax}>
                    <Text style={CompanySetupStyle.lablemax}>
                        Maximum Office Hours:
                    </Text>
                    <TouchableOpacity onPress={_showDateTimePicker}
                        style={CompanySetupStyle.TextinputTouch}
                    >
                        <View>
                            <TextInput
                                editable={false}
                                style={CompanySetupStyle.inputstylecom}
                                value={MaximumOfficeHours}
                            />
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={isDateTimePickerVisible}
                        onConfirm={_handleDatePicked}
                        onCancel={_hideDateTimePicker}
                        mode={'time'}
                    />
                </View>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text style={CompanySetupStyle.canleaveText}>
                        Can Leave Before:
                    </Text>
                    <TouchableOpacity onPress={_showDateTimePicker1}
                        style={{ marginRight: 18, justifyContent: "flex-end" }}
                    >
                        <View>
                            <TextInput
                                editable={false}
                                style={CompanySetupStyle.inputstylecom}
                                value={OfficeOutTime}

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
                <TouchableOpacity style={CompanySetupStyle.addPeopleBtncom} onPress={() => closemodalForupdateCom()} >
                    <Text style={CompanySetupStyle.SaveStyle}>Save</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

export default CompanysetupScreen;
