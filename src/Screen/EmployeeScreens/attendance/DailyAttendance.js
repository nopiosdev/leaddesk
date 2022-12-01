import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, RefreshControl, BackHandler } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import { GetAttendanceFeed } from '../../../services//EmployeeTrackService'
// import { MyPanelCombo } from '../../../../components/MenuDrawer/DrawerContent';
import { urlDev, urlResource } from '../../../Utils/config';
import LocalStorage from '../../../common/LocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActive } from '../../../Redux/Slices/UserSlice';
import Header from '../../../components/Header';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../../components/Loader';


const DailyAttendances = ({ navigation }) => {
    const [employeeList, setemployeeList] = useState([]);
    const [statusCount, setstatusCount] = useState({ TotalEmployee: 0, TotalCheckIn: 0, TotalNotAttend: 0 });
    const [refreshing, setrefreshing] = useState(false);
    const [selectedId, setselectedId] = useState(1);
    const [displayAbleEmployeeList, setdisplayAbleEmployeeList] = useState([]);
    const [CompanyId, setCompanyId] = useState(0);
    const [employeeDetail, setemployeeDetail] = useState({});
    const user = useSelector((state) => state.user.currentUser);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    const _onRefresh = async () => {
        setrefreshing(true);
        setselectedId(1);
        getAttendanceFeed(CompanyId);
    }

    const setSelectedOption = (id) => {
        setselectedId(id);
        console.log(id)
        switch (id) {
            case 1: //All
                setdisplayAbleEmployeeList(employeeList);
                break;
            case 2: //checked in
                setdisplayAbleEmployeeList(employeeList?.filter(x => x.CheckInTime));
                break;
            case 3: //not attend
                setdisplayAbleEmployeeList(employeeList?.filter(x => !x.CheckInTime || !x.CheckOutTime));
                break;
        }
    };

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setCompanyId(cId);
            console.log(cId)
            getAttendanceFeed(cId);
        })();
    }, [isFocused])



    const getAttendanceFeed = async (cId) => {
        await GetAttendanceFeed(cId)
            .then(res => {
                console.log(res, "employeeDetail....");
                setemployeeList(res?.EmployeeList.filter(x => x.UserId != user.Id));
                setdisplayAbleEmployeeList(res?.EmployeeList);
                setstatusCount(res?.StatusCount);
                setemployeeDetail(res?.EmployeeList.filter(x => x.UserId == user.Id)[0])
                setrefreshing(false);
            }).catch(() => { console.log("error occured"); setrefreshing(false); });
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
                        <Text style={selectedId == 2 ? DailyAttendanceStyle.countBoxColumn2NumberActive : DailyAttendanceStyle.countBoxColumn2NumberInactive}>
                            {statusCount.TotalCheckIn}
                        </Text>
                        <Text style={selectedId == 2 ? DailyAttendanceStyle.countBoxColumn2LabelActive : DailyAttendanceStyle.countBoxColumn2LabelInactive}>
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
            <Header
                title={"Today's Feed"}
                onPress={() => navigation.openDrawer()}
                onGoBack={() => handleBackButton()}
            />
            {!refreshing ?
                <>
                    <View
                        style={[
                            DailyAttendanceStyle.FlatListTouchableOpacity,
                            style = {
                                padding: 10,
                                height: 100,
                                backgroundColor: "#f8f9fb"
                            }
                        ]}>
                        <View style={DailyAttendanceStyle.FlatListLeft}>
                            <View style={{ paddingRight: 10, }}>
                                {employeeDetail != null && employeeDetail?.ImageFileName && employeeDetail?.ImageFileName !== 'null' ? (
                                    <Image resizeMode='cover' style={
                                        DailyAttendanceStyle.ImageLocal
                                    } source={{ uri: urlResource + employeeDetail?.ImageFileName }} />) :

                                    (<Image style={
                                        DailyAttendanceStyle.ImagestyleFromServer
                                    } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />)}


                                {employeeDetail?.CheckOutTime ? (<Image resizeMode="contain"
                                    style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                                    source={require('../../../../assets/images/icon_gray.png')} />)
                                    :
                                    (employeeDetail?.CheckInTime ?
                                        (<Image style={DailyAttendanceStyle.styleForonlineOfflineIcon
                                        } resizeMode='contain' source={require('../../../../assets/images/icon_green.png')} />)
                                        : (<Image style={
                                            DailyAttendanceStyle.styleForonlineOfflineIcon
                                        } resizeMode='contain' source={require('../../../../assets/images/icon_gray.png')} />))
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
                            <TouchableOpacity onPress={() => { dispatch(toggleActive(3)); navigation.navigate('MyPanel') }}>
                                <Image resizeMode="contain" style={{
                                    width: 67,
                                    height: 56
                                }}
                                    source={require('../../../../assets/images/panelb.png')}>
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
                                                } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />}


                                            {item?.CheckOutTime ? (<Image resizeMode="contain"
                                                style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                                                source={require('../../../../assets/images/icon_gray.png')} />)
                                                : (item?.CheckInTime ?
                                                    (<Image style={DailyAttendanceStyle.styleForonlineOfflineIcon
                                                    } resizeMode='contain' source={require('../../../../assets/images/icon_green.png')} />)
                                                    : (<Image style={
                                                        DailyAttendanceStyle.styleForonlineOfflineIcon
                                                    } resizeMode='contain' source={require('../../../../assets/images/icon_gray.png')} />))
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
                                                {item?.CheckInTime &&
                                                    (<AntDesign
                                                        name="arrowdown" size={10}
                                                        color="#07c15d"
                                                        style={DailyAttendanceStyle.AntDesignstyle}>
                                                    </AntDesign>)}
                                            </Text>
                                            <Text style={
                                                DailyAttendanceStyle.CheckinTimeText
                                            }>
                                                {item?.CheckInTime && item?.CheckInTime}</Text>

                                        </View>

                                        <View
                                            style={
                                                DailyAttendanceStyle.CheckOutTimeView
                                            }>
                                            <Text
                                                style={
                                                    DailyAttendanceStyle.CheckOutTimetext
                                                }>
                                                {item?.CheckOutTime &&
                                                    (<AntDesign
                                                        name="arrowup" size={10}
                                                        color="#a1d3ff"
                                                        style={
                                                            DailyAttendanceStyle.CheckOutTimeIconstyle
                                                        }>
                                                    </AntDesign>)}
                                            </Text>
                                            <Text style={
                                                DailyAttendanceStyle.CheckOutTimeText
                                            }>{item?.CheckOutTime && item?.CheckOutTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            }>
                        </FlatList>
                    </View>
                </>
                :
                <Loader />
            }
        </View >
    )
}


export default DailyAttendances;