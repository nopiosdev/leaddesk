
import React from 'react';
import { Platform, StatusBar, TouchableOpacity, View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { ReportStyle } from './ReportStyle';
import ModalSelector from 'react-native-modal-selector';
import { urlDev, urlResource } from '../../../Utils/config';
import { useIsFocused } from '@react-navigation/native';
import { GetAllEmployeeAttendanceWithMonth } from '../../../services/Report'
import { CommonStyles } from '../../../common/CommonStyles';
import { DailyAttendanceStyle } from "../attendance/DailyAttendanceStyle"
import moment from 'moment';
import LocalStorage from '../../../common/LocalStorage';
import { useState } from 'react';
import { useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Header from '../../../components/Header';
import { toggleActive } from '../../../Redux/Slices/UserSlice';
import { useDispatch } from 'react-redux';


const ReportScreen = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const [yearList] = useState([
        { label: '2019', key: '2019' },
        { label: '2020', key: '2020' },
        { label: '2021', key: '2021' },
        { label: '2022', key: '2022' },
        { label: '2023', key: '2023' },
        { label: '2024', key: '2024' },
        { label: '2025', key: '2025' },
        { label: '2026', key: '2026' },
        { label: '2027', key: '2027' },
        { label: '2028', key: '2028' },
        { label: '2029', key: '2029' },
        { label: '2030', key: '2030' },
    ]);
    const [monthList] = useState([
        { label: 'January', key: '1' },
        { label: 'February', key: '2' },
        { label: 'March', key: '3' },
        { label: 'April', key: '4' },
        { label: 'May', key: '5' },
        { label: 'June', key: '6' },
        { label: 'July', key: '7' },
        { label: 'August', key: '8' },
        { label: 'September', key: '9' },
        { label: 'October', key: '10' },
        { label: 'November', key: '11' },
        { label: 'December', key: '12' },
    ]);
    const [VistNumber, setVistNumber] = useState(moment(new Date()).format("M"));
    const [year, setyear] = useState(moment(new Date()).format("YYYY"));
    const [workingReportList, setworkingReportList] = useState([]);
    const [companyId, setcompanyId] = useState(0);
    const [progressVisible, setprogressVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getAllEmployeeAttendanceWithMonth(VistNumber, year);
    }, [isFocused])

    const selectedItem = async (itemValue) => {
        setVistNumber(itemValue);
        getAllEmployeeAttendanceWithMonth(itemValue, year);
    }
    const getAllEmployeeAttendanceWithMonth = async (monthNo, yearNo) => {
        try {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            setprogressVisible(true);
            await GetAllEmployeeAttendanceWithMonth(cId, monthNo, yearNo)
                .then(res => {
                    console.log("cId, monthNo, yearNo", res)
                    if (!res?.success) {
                        setworkingReportList(res);
                    }
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


    const selectedItemYear = async (itemValue) => {
        setyear(itemValue);
        getAllEmployeeAttendanceWithMonth(VistNumber, itemValue);
    }
    const goToDetail = (item) => {
        navigation.navigate("DetailScreen", { detailItem: item, month: VistNumber, year: year });
    }
    const renderDropDownMonth = () => {
        if (Platform.OS === 'android') {
            return (
                <Picker
                    selectedValue={VistNumber}
                    itemStyle={{ borderWidth: 1, borderColor: 'red', fontSize: 12, fontWeight: '500', padding: 0, borderColor: '#798187', borderRadius: 10, borderWidth: 1 }}
                    style={{ height: 50, width: 130, borderWidth: 1, marginTop: -15, padding: 0, borderColor: '#798187', borderRadius: 10, }}
                    onValueChange={(itemValue, itemIndex) => {
                        console.log(itemValue)
                        selectedItem(itemValue)
                    }
                    }>
                    {monthList.map((item, key) => {
                        return <Picker.Item value={item.key} label={item.label} key={key} />
                    })}
                </Picker>
            )
        } else {
            return (
                <ModalSelector
                    style={CommonStyles.ModalSelectorStyle}
                    data={monthList}
                    initValue={VistNumber}
                    onChange={(option) => {
                        const newUser = option.key
                        selectedItem(newUser)
                    }}
                />
            )
        }
    }
    const renderDropDownYear = () => {
        if (Platform.OS === 'android') {
            return (
                <Picker
                    selectedValue={year}
                    itemStyle={{ borderWidth: 1, borderColor: 'red', fontSize: 12, padding: 0, borderColor: 'black', borderRadius: 10, borderWidth: 1 }}
                    style={{ height: 50, width: 100, borderWidth: 1, marginTop: -15, padding: 0, borderColor: 'black', borderRadius: 10, }}
                    onValueChange={(itemValue, itemIndex) =>
                        selectedItemYear(itemValue)
                    }>
                    {yearList.map((item, key) => { return <Picker.Item value={item.key} label={item.label} key={key} /> })}
                </Picker>
            )
        } else {
            return (
                <ModalSelector
                    style={CommonStyles.ModalSelectorStyle}
                    data={yearList}
                    initValue={year}
                    onChange={(option) => {
                        const newUser = option.key
                        selectedItemYear(newUser)
                    }}
                />
            )
        }
    }

    return (
        <View style={ReportStyle.container}>
            <Header
                title={'ATTENDANCE REPORT'}
                onPress={() => { navigation.openDrawer() }}
                onGoBack={() => { dispatch(toggleActive(1)); navigation.goBack() }}
            />
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10, marginBottom: 0, padding: 10, paddingBottom: 0, }}>
                <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
                    <Text style={{ color: '#d2d6d9', fontFamily: 'PRODUCT_SANS_BOLD', fontSize: 16 }}>Month:</Text>
                    {renderDropDownMonth()}

                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
                    <Text style={{ color: '#d2d6d9', fontFamily: 'PRODUCT_SANS_BOLD', fontSize: 16 }}>Year:</Text>
                    {renderDropDownYear()}
                </View>
            </View>
            {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={ReportStyle.loaderIndicator} />) :
                workingReportList?.length > 0 &&
                <FlatList
                    data={workingReportList}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => goToDetail(item)}>
                            <View style={DailyAttendanceStyle.FlatListTouchableOpacitywork}>
                                <View style={DailyAttendanceStyle.FlatListLeft}>
                                    <View style={{ paddingRight: 10, }}>
                                        {item.ImageFileName ?
                                            <Image resizeMode="contain" style={
                                                DailyAttendanceStyle.ImageLocal
                                            } source={{ uri: urlResource + item.ImageFileName }} /> : <Image style={
                                                DailyAttendanceStyle.ImagestyleFromServer
                                            } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />}
                                    </View>
                                    <View style={DailyAttendanceStyle.RightTextView}>
                                        <Text style={DailyAttendanceStyle.NameText}>
                                            {item.EmployeeName}
                                        </Text>
                                        <Text style={DailyAttendanceStyle.DesignationText}>
                                            {item.Designation}
                                        </Text>
                                        <Text style={DailyAttendanceStyle.DepartmentText}>
                                            {item.DepartmentName}
                                        </Text>
                                    </View>
                                </View>
                                <View style={DailyAttendanceStyle.TimeContainerwork}>
                                    <View style={DailyAttendanceStyle.TimeContentwork}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text
                                                style={
                                                    [DailyAttendanceStyle.CheckintimeStyle, { color: '#c49602' }]}>
                                                Present:
                                            </Text>

                                            <Text
                                                style={
                                                    [DailyAttendanceStyle.CheckintimeStyle, { color: '#c49602' }]}>
                                                {item.TotalPresent}
                                            </Text>
                                        </View>
                                        <Text style={DailyAttendanceStyle.CheckinTimeText}>
                                            {item?.CheckInTime ? moment(item?.CheckInTime).format('DD/MM/YY') : ("")}
                                        </Text>

                                    </View>

                                    <View style={DailyAttendanceStyle.CheckOutTimeView}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[DailyAttendanceStyle.CheckOutTimetext, { color: '#3b875e' }]}>
                                                Completed:
                                            </Text>
                                            <Text style={[DailyAttendanceStyle.CheckOutTimetext, { color: '#3b875e' }]}>
                                                {(item.TotalStayTime)} h
                                            </Text>
                                        </View>
                                        <Text style={DailyAttendanceStyle.CheckOutTimeText}></Text>
                                    </View>
                                    {item.TotalCheckedOutMissing ?
                                        <View style={DailyAttendanceStyle.CheckOutTimeView}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text
                                                    style={
                                                        [DailyAttendanceStyle.CheckOutMissingTimeText, { color: '#FF0000' }]}>
                                                    Checkout Missing:{" "}  
                                                </Text>
                                                <Text style={[DailyAttendanceStyle.CheckOutMissingTimeText, { color: '#FF0000' }]}>
                                                    {item.TotalCheckedOutMissing}
                                                </Text>
                                            </View>
                                            <Text style={DailyAttendanceStyle.CheckOutMissingTimeText}></Text>
                                        </View> : null
                                    }
                                </View>
                            </View>
                            <View style={{ borderBottomColor: '#edeeef', borderBottomWidth: 1, marginLeft: "24%", marginRight: 10, }}></View>
                        </TouchableOpacity>
                    } />
            }

        </View>
    );
}

export default ReportScreen;