import React, { useEffect, useState } from 'react';

import {
    Text, View, Platform, Image,
    ScrollView, Dimensions,
    BackHandler, TouchableOpacity,
    KeyboardAvoidingView, TextInput, ToastAndroid, Button,
} from 'react-native';

import Modal from 'react-native-modalbox';
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { LeaveApplyStyle, } from './LeaveApplyStyle';
import { LeaveListStyle } from '../../AdminScreens/leaves/LeaveListStyle';
import moment from 'moment'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { createLeave, GetLeaveStatusList } from '../../../services/EmployeeService/Leave';
import LocalStorage from '../../../common/LocalStorage';
import { useSelector } from 'react-redux';
import Header from '../../../components/Header';



const LeaveApply = ({ navigation, route }) => {

    const [date, setdate] = useState(new Date());
    const [date1, setdate1] = useState(new Date());
    const [CreatedAt, setCreatedAt] = useState(new Date());
    const [CompanyId, setCompanyId] = useState('');
    const [LeaveApplyFrom, setLeaveApplyFrom] = useState('');
    const [LeaveApplyTo, setLeaveApplyTo] = useState('');
    const [IsHalfDay, setIsHalfDay] = useState(false);
    const [LeaveTypeId, setLeaveTypeId] = useState('');
    const [LeaveReason, setLeaveReason] = useState('');
    const [IsApproved, setIsApproved] = useState(false);
    const [IsRejected, setIsRejected] = useState(false);
    const [RejectReason, setRejectReason] = useState('');
    const [ApprovedById, setApprovedById] = useState(null);
    const [ApprovedAt, setApprovedAt] = useState(null);
    const [leave, setleave] = useState({ LeaveArrayText: '', LeaveArrayValue: '' });
    const [LeaveArray, setLeaveArray] = useState([]);
    const [LeaveTypeModal, setLeaveTypeModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState('');
    const user = useSelector((state) => state.user.currentUser);


    const getStatus = async () => {
        try {

            await GetLeaveStatusList()
                .then(res => {
                    console.log('GetLeaveStatusList', res)
                    setLeaveArray(res);
                    console.log(res, "statusList");
                })
                .catch(() => {
                    console.log("error occured");
                });

        } catch (error) {

            console.log(error);
        }
    }



    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setCompanyId(cId);
            getStatus();
        })();
    }, [])

    const LeaveTypeDropDown = (value, text) => {
        setleave({ LeaveArrayText: value, LeaveArrayValue: text })
        setLeaveTypeModal(false);
    }

    const CreateLeave = async () => {

        var data = new FormData();
        data.append('CompanyId', CompanyId);
        data.append('UserId', user?.Id);
        data.append('LeaveApplyFrom', moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss a'));
        data.append('LeaveApplyTo', moment(new Date(date1)).format('YYYY-MM-DD HH:mm:ss a'));
        data.append('IsHalfDay', IsHalfDay);
        data.append('LeaveTypeId', leave.LeaveArrayText);
        data.append('LeaveReason', LeaveReason);
        data.append('CreatedAt', CreatedAt);

        console.log("leaveModel", data);

        if (data.LeaveTypeId != "") {
            if (data.LeaveReason != "") {
                let response = await createLeave(data);
                console.log('createLeave', response)
                ToastAndroid.show('Leave applied successfully', ToastAndroid.TOP);
                navigation.goBack();
            }
            else {
                ToastAndroid.show('Please Enter Reason', ToastAndroid.TOP);
            }
        }
        else {
            ToastAndroid.show('Please Enter Cause', ToastAndroid.TOP);
        }

    }

    const renderLeaveArrayList = () => {
        let content = LeaveArray?.map((arraytext, i) => {
            arraytext
            return (
                <TouchableOpacity
                    style={{
                        paddingVertical: 7, borderBottomColor: '#D5D5D5',
                        borderBottomWidth: 2
                    }}
                    key={i}
                    onPress={() => { LeaveTypeDropDown(arraytext.Id, arraytext.Name) }}>
                    <Text style={LeaveApplyStyle.renderLeaveArrayListTextStyle}
                        key={arraytext.Id}>{arraytext.Name}
                    </Text>
                </TouchableOpacity>
            )
        });
        return content;
    }

    var { height, width } = Dimensions.get('window');
    return (
        <View style={LeaveApplyStyle.container}>
            <Header
                title={'Leave Apply'}
                goBack={true}
                onPress={() => { navigation.goBack() }}
                btnAction={() => CreateLeave()}
                btnTitle='REQUEST'
                btnContainerStyle={LeaveListStyle.ApplyTextButton}
                btnStyle={LeaveListStyle.plusButton}
                saveImg={true}
            />
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : 'height'} enabled style={{ flex: 1, }}>
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardDismissMode="on-drag" keyboardShouldPersistTaps={'always'} style={{ flex: 1, }}>
                        <View style={LeaveApplyStyle.mainBodyStyle}>
                            <View style={LeaveApplyStyle.mainBodyTopStyle}>
                                <Text style={LeaveApplyStyle.fromTextStyle}>
                                    From:
                                </Text>
                                <Text style={LeaveApplyStyle.toTextStyle}>
                                    To:
                                </Text>
                            </View>

                            <View
                                style={LeaveApplyStyle.datePickerRowStyle}>
                                <View style={LeaveApplyStyle.datePickerLeftStyle}>
                                    {showDatePicker == 'date' &&
                                        <RNDateTimePicker
                                            value={date}
                                            mode="date"
                                            dateFormat="DD MMMM YYYY"
                                            positiveButtonLabel="Confirm"
                                            negativeButtonLabel="Cancel"
                                            onChange={(e, date) => { setShowDatePicker(''); setdate(date) }}
                                        />
                                    }
                                    <TouchableOpacity onPress={() => setShowDatePicker('date')} style={{ zIndex: 1, borderRadius: 8, backgroundColor: "#f5f7fb", width: (width * 45) / 100, height: 30, marginRight: 25, }}>
                                        <Text style={{
                                            color: "#848f98", fontFamily: "Montserrat_SemiBold", fontWeight: "bold", fontStyle: "normal", padding: 5,
                                        }} >{moment(date).format('DD MMMM YYYY')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={LeaveApplyStyle.datePickerLeftStyle}>
                                    {showDatePicker == 'date1' &&
                                        <RNDateTimePicker
                                            value={date1}
                                            mode="date"
                                            dateFormat="DD MMMM YYYY"
                                            positiveButtonLabel="Confirm"
                                            negativeButtonLabel="Cancel"
                                            onChange={(e, date1) => { setShowDatePicker(''); setdate1(date1) }}
                                            onPressPo
                                        />
                                    }
                                    <Text onPress={() => setShowDatePicker('date1')} style={{
                                        borderRadius: 8, backgroundColor: "#f5f7fb", height: 30, marginRight: 25, color: "#848f98", fontFamily: "Montserrat_SemiBold", fontWeight: "bold", fontStyle: "normal", padding: 5, width: (width * 45) / 100
                                    }} >{moment(date1).format('DD MMMM YYYY')}</Text>
                                </View>
                            </View>
                            <View
                                style={LeaveApplyStyle.leaveTypeRowStyle}>
                                <Text
                                    style={LeaveApplyStyle.leaveTypeRowTextStyle}>
                                    Leave Type:
                                </Text>
                            </View>
                            <View
                                style={LeaveApplyStyle.leaveDropDownRow}>
                                <TouchableOpacity
                                    style={LeaveApplyStyle.leaveDropDownStyle}
                                    onPress={() => setLeaveTypeModal(true)}>
                                    <Text
                                        style={LeaveApplyStyle.leaveDropDownText}>
                                        {leave.LeaveArrayValue == '' ? "Leave type" : leave.LeaveArrayValue}
                                    </Text>
                                    <AntDesign
                                        name="caretdown"
                                        style={LeaveApplyStyle.leaveDropDownIconStyle}
                                        size={14} color="#848f98">
                                    </AntDesign>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={LeaveApplyStyle.leaveCauseRow}>
                                <Text
                                    style={LeaveApplyStyle.leaveCauseText}>
                                    Cause:
                                </Text>
                            </View>
                            <View
                                style={LeaveApplyStyle.leaveTextInputRow}>
                                <TextInput
                                    style={LeaveApplyStyle.leaveCauseTextInputStyle}
                                    multiline={true}
                                    placeholderTextColor="#cbcbcb"
                                    placeholder="write cause here"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    onChangeText={text => setLeaveReason(text)}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Modal
                    style={LeaveApplyStyle.leaveTypeModalMainStyle}
                    position={"center"}
                    backdropPressToClose={false}
                    isOpen={LeaveTypeModal}
                    swipeToClose={false}>
                    <View>
                        <View
                            style={{ justifyContent: "space-between", flexDirection: "row" }}>
                            <View style={{ alignItems: "flex-start" }}>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <TouchableOpacity
                                    style={{ padding: 5, }}
                                    onPress={() => setLeaveTypeModal(false)}>
                                    <AntDesign name="closecircle"
                                        size={30} color="black">
                                    </AntDesign>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                        >
                            <ScrollView showsVerticalScrollIndicator={false}
                                style={{ height: (height * 50) / 100, }}>
                                <View style={{ width: "100%" }} >
                                    {LeaveArray != null ?
                                        renderLeaveArrayList()
                                        : <Text>No Leave Selected</Text>}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        </View >
    )
}

export default LeaveApply;

