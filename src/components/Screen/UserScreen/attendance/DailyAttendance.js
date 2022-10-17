import React, { useState, useEffect } from 'react';
import {
    FlatList, Text, View, Image, StatusBar,
    TouchableOpacity, Platform,
    RefreshControl, BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AntDesign from 'react-native-vector-icons/AntDesign'

import { DailyAttendanceStyle } from './DailyAttendanceStyle';

import { GetAttendanceFeed } from '../../../../services/UserService/EmployeeTrackService'

import { MyPanelCombo } from '../../../MenuDrawer/DrawerContent';
import { urlDev, urlResource } from '../../../../services/api/config';
import LocalStorage from '../../../../common/LocalStorage';
import { useSelector } from 'react-redux';


const DailyAttendances = ({ navigation }) => {
    const [employeeList, setemployeeList] = useState([]);
    const [statusCount, setstatusCount] = useState({ TotalEmployee: 0, TotalCheckIn: 0, TotalCheckOut: 0 });
    const [refreshing, setrefreshing] = useState(false);
    const [selectedId, setselectedId] = useState(1);
    const [displayAbleEmployeeList, setdisplayAbleEmployeeList] = useState([]);
    const [CompanyId, setCompanyId] = useState(0);
    const [employeeDetail, setemployeeDetail] = useState({});
    const user = useSelector((state) => state.user.currentUser);

    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    const _onRefresh = async () => {
        setrefreshing(true);
        setselectedId(1);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);
        getAttendanceFeed(CompanyId);
    }

    const setSelectedOption = (id) => {
        setselectedId(id);
        switch (id) {
            case 1: //All
                setdisplayAbleEmployeeList(employeeList);
                break;
            case 2: //checked in
                setdisplayAbleEmployeeList(employeeList?.filter(x => x.IsCheckedIn));
                break;
            case 3: //not attend
                setdisplayAbleEmployeeList(employeeList?.filter(x => x.NotAttend));
                break;
        }
    };

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setCompanyId(cId);
            getAttendanceFeed(cId);
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);

        }
    }, [])



    const getAttendanceFeed = async (cId) => {
        await GetAttendanceFeed(cId)
            .then(res => {
                if (res?.success) {
                    var cEmployee = res?.EmployeeList.filter(x => x.UserId === user.Id);
                    console.log('cEmployee' + cEmployee);
                    if (cEmployee == null) {
                        navigation.navigate('login');
                    }
                    setemployeeList(res?.EmployeeList.filter(x => x.UserId != user.Id));
                    setdisplayAbleEmployeeList(res?.EmployeeList);
                    setstatusCount(res?.StatusCount);
                    setemployeeDetail(res?.EmployeeList.filter(x => x.UserId === user.Id)[0])

                }
                console.log(res?.EmployeeList, "employeeDetail....");

            }).catch(() => { console.log("error occured"); });
    }

    const renderStatusList = () => {
        return (
            <View style={DailyAttendanceStyle.countBoxContainer}>
                <TouchableOpacity onPress={() => setSelectedOption(1)}>
                    <View style={DailyAttendanceStyle.countBoxColumn1}>
                        <Text
                            style={selectedId == 1 ?
                                DailyAttendanceStyle.countBoxColumn1NumberActive :
                                DailyAttendanceStyle.countBoxColumn1NumberInactive}>
                            {statusCount.TotalEmployee}
                        </Text>
                        <Text
                            style={selectedId == 1 ?
                                DailyAttendanceStyle.countBoxColumn1LabelActive :
                                DailyAttendanceStyle.countBoxColumn1LabelInactive}>
                            TOTAL
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedOption(2)}>
                    <View style={DailyAttendanceStyle.countBoxColumn2}>
                        <Text style={
                            selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2NumberActive :
                                DailyAttendanceStyle.countBoxColumn2NumberInactive}>
                            {statusCount.TotalCheckIn}
                        </Text>
                        <Text style={
                            selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2LabelActive
                                :
                                DailyAttendanceStyle.countBoxColumn2LabelInactive}>
                            CHECKED IN
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedOption(3)}>
                    <View style={DailyAttendanceStyle.countBoxColumn3}>
                        <Text style={
                            selectedId == 3 ?
                                DailyAttendanceStyle.countBoxColumn3NumberActive :
                                DailyAttendanceStyle.countBoxColumn3NumberInactive
                        }
                        >
                            {statusCount.TotalNotAttend}
                        </Text>
                        <Text style={
                            selectedId == 3 ? DailyAttendanceStyle.countBoxColumn3LabelActive
                                :
                                DailyAttendanceStyle.countBoxColumn3LabelInactive}
                        >
                            Not Attend
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <View style={DailyAttendanceStyle.container}>

            <View
                style={DailyAttendanceStyle.HeaderContent}>
                <View
                    style={DailyAttendanceStyle.HeaderFirstView}>
                    <TouchableOpacity
                        style={DailyAttendanceStyle.HeaderMenuicon}
                        onPress={() => { navigation.openDrawer(); }}>
                        <Image resizeMode="contain" style={DailyAttendanceStyle.HeaderMenuiconstyle}
                            // source={require('../../../../../assets/images/menu_b.png')}
                            source={require('../../../../../assets/images/menu_b.png')}

                        >
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={DailyAttendanceStyle.HeaderTextView}>
                        <Text
                            style={DailyAttendanceStyle.HeaderTextstyle}>
                            TODAY'S FEED
                        </Text>
                    </View>
                </View>
            </View>
            <View
                style={[
                    DailyAttendanceStyle.FlatListTouchableOpacity,
                    style = {
                        padding: 10,
                        height: 100,
                        // paddingVertical: 20,
                        backgroundColor: "#f8f9fb"
                    }
                ]}>
                <View
                    style={
                        DailyAttendanceStyle.FlatListLeft
                    }>
                    <View style={{ paddingRight: 10, }}>
                        {employeeDetail != null && employeeDetail?.ImageFileName !== "" ? (
                            <Image resizeMode='cover' style={
                                DailyAttendanceStyle.ImageLocal
                            } source={{ uri: urlResource + employeeDetail?.ImageFileName }} />) :

                            (<Image style={
                                DailyAttendanceStyle.ImagestyleFromServer
                            } resizeMode='contain' source={require('../../../../../assets/images/employee.png')} />)}


                        {employeeDetail?.IsCheckedOut ? (<Image resizeMode="contain"
                            style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                            source={require('../../../../../assets/images/icon_gray.png')} />)
                            :
                            (employeeDetail?.IsCheckedIn ?
                                (<Image style={DailyAttendanceStyle.styleForonlineOfflineIcon
                                } resizeMode='contain' source={require('../../../../../assets/images/icon_green.png')} />)
                                : (<Image style={
                                    DailyAttendanceStyle.styleForonlineOfflineIcon
                                } resizeMode='contain' source={require('../../../../../assets/images/icon_gray.png')} />))
                        }

                    </View>
                    <View style={DailyAttendanceStyle.RightTextView}>
                        <Text style={
                            DailyAttendanceStyle.NameText
                        }
                        >
                            {employeeDetail?.EmployeeName}
                        </Text>
                        <Text style={
                            DailyAttendanceStyle.DesignationText
                        }
                        >
                            {employeeDetail?.Designation}
                        </Text>
                        <Text style={
                            DailyAttendanceStyle.DepartmentText
                        }
                        >
                            {employeeDetail?.DepartmentName}
                        </Text>
                    </View>
                </View>
                <View style={DailyAttendanceStyle.TimeContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('MyPanel')}>
                        <Image resizeMode="contain" style={{
                            width: 67,
                            height: 56
                        }}
                            source={require('../../../../../assets/images/panelb.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={
                    DailyAttendanceStyle.ListContainer
                }>
                {renderStatusList()}
            </View>
            <View
                style={
                    DailyAttendanceStyle.FlatListContainer
                }>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                        />
                    }
                    data={employeeList}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem=
                    {({ item }) =>
                        <View
                            style={
                                DailyAttendanceStyle.FlatListTouchableOpacity
                            }>
                            <View
                                style={
                                    DailyAttendanceStyle.FlatListLeft
                                }>
                                <View style={{ paddingRight: 10, }}>
                                    {item.ImageFileName ?
                                        <Image resizeMode='cover' style={
                                            DailyAttendanceStyle.ImageLocal
                                        } source={{ uri: urlResource + item.ImageFileName }} /> : <Image style={
                                            DailyAttendanceStyle.ImagestyleFromServer
                                        } resizeMode='contain' source={require('../../../../../assets/images/employee.png')} />}


                                    {item.IsCheckedOut ? (<Image resizeMode="contain"
                                        style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                                        source={require('../../../../../assets/images/icon_gray.png')} />)
                                        : (item.IsCheckedIn ?
                                            (<Image style={DailyAttendanceStyle.styleForonlineOfflineIcon
                                            } resizeMode='contain' source={require('../../../../../assets/images/icon_green.png')} />)
                                            : (<Image style={
                                                DailyAttendanceStyle.styleForonlineOfflineIcon
                                            } resizeMode='contain' source={require('../../../../../assets/images/icon_gray.png')} />))
                                    }

                                </View>
                                <View style={DailyAttendanceStyle.RightTextView}>
                                    <Text style={
                                        DailyAttendanceStyle.NameText
                                    }
                                    >
                                        {item.EmployeeName}
                                    </Text>
                                    <Text style={
                                        DailyAttendanceStyle.DesignationText
                                    }
                                    >
                                        {item.Designation}
                                    </Text>
                                    <Text style={
                                        DailyAttendanceStyle.DepartmentText
                                    }
                                    >
                                        {item.DepartmentName}
                                    </Text>
                                </View>
                            </View>
                            <View style={DailyAttendanceStyle.TimeContainer}>
                                <View
                                    style={
                                        DailyAttendanceStyle.TimeContent
                                    }>
                                    <Text
                                        style={
                                            DailyAttendanceStyle.CheckintimeStyle
                                        }>
                                        {item.CheckInTime !== "" ?
                                            (<AntDesign
                                                name="arrowdown" size={10}
                                                color="#07c15d"
                                                style={DailyAttendanceStyle.AntDesignstyle}>
                                            </AntDesign>) : ("")}
                                    </Text>
                                    <Text style={
                                        DailyAttendanceStyle.CheckinTimeText
                                    }>
                                        {item.CheckInTime !== "" ? item.CheckInTime : ("")}</Text>

                                </View>

                                <View
                                    style={
                                        DailyAttendanceStyle.CheckOutTimeView
                                    }>
                                    <Text
                                        style={
                                            DailyAttendanceStyle.CheckOutTimetext
                                        }>
                                        {item.IsCheckedOut ?
                                            (<AntDesign
                                                name="arrowup" size={10}
                                                color="#a1d3ff"
                                                style={
                                                    DailyAttendanceStyle.CheckOutTimeIconstyle
                                                }>
                                            </AntDesign>) : ("")}
                                    </Text>
                                    <Text style={
                                        DailyAttendanceStyle.CheckOutTimeText
                                    }>{item.IsCheckedOut ? item.CheckOutTime : ("")}</Text>
                                </View>
                            </View>
                        </View>

                    }>
                </FlatList>
            </View>

        </View >
    )
}


export default DailyAttendances;