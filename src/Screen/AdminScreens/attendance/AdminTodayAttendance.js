import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, BackHandler } from 'react-native';
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import Modal from 'react-native-modalbox';
import { GetCompanyByUserId } from "../../../services/CompanyService"
import { useDispatch, useSelector } from "react-redux";
import { GetAttendanceFeed } from '../../../services/EmployeeTrackService';
import { urlResource } from '../../../Utils/config';
import ImageViewer from 'react-native-image-zoom-viewer';
import LocalStorage from '../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../components/Header';
import { ActivityIndicator } from 'react-native';
import { TaskStyle } from '../tasks/TaskStyle';
import moment from 'moment';
import { setSelectedEmployee } from '../../../Redux/Slices/UserSlice';


const AdminTodayAttendance = ({ navigation }) => {

    const [employeeList, setemployeeList] = useState([]);
    const [statusCount, setstatusCount] = useState({ TotalEmployee: 0, TotalCheckIn: 0, TotalCheckOut: 0 });
    const [refreshing, setrefreshing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedId, setselectedId] = useState(1);
    const [displayAbleEmployeeList, setdisplayAbleEmployeeList] = useState([]);
    const [companyId, setcompanyId] = useState(0);
    const [slectedCompanyIndex, setslectedCompanyIndex] = useState(0);
    const [selctedCompanyValue, setselctedCompanyValue] = useState('');
    const [companyList, setcompanyList] = useState([]);
    const [ZoomImage, setZoomImage] = useState('');
    const [ViewerModal, setViewerModal] = useState(false);
    const [CompanyModal, setCompanyModal] = useState(false);
    const user = useSelector((state) => state.user.currentUser);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const handleBackButton = () => {
        BackHandler.exitApp()
    }
    const _onRefresh = async () => {
        setrefreshing(true);
        setselectedId(1);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getAttendanceFeed(companyId);
    }

    const ShowImageViewer = (f) => {
        var images = [{ url: urlResource + f }];
        setZoomImage(images)
        setViewerModal(true);
    }

    const goToDetail = (item) => {
        dispatch(setSelectedEmployee(item))
        navigation.navigate('Tab', {
            screen: 'DailyAttendanceDetails',
        })
    };

    const setSelectedOption = (id) => {
        setselectedId(id);
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
            setIsLoaded(false);
            const isIndexvalue = await LocalStorage.GetData("isIndexvalue");
            if (isIndexvalue == "yes") {
                await getCompanyforIndex();
            } else {
                await getCompany();
            }
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            getAttendanceFeed(cId);
            setIsLoaded(true);
        })();

    }, [isFocused])


    const closeCompanyModal = async (index, value) => {
        setCompanyModal(false);
        await LocalStorage.SetData("companyId", index.toString());
        await LocalStorage.SetData("companyName", value);
        setslectedCompanyIndex(index);
        setselctedCompanyValue(value);
        getAttendanceFeed(index);
        await LocalStorage.SetData("isIndexvalue", "yes");
    }

    const renderCompanyList = () => {
        let content = companyList.map((catName, i) => {
            return (
                <TouchableOpacity style={{
                    paddingVertical: 7, borderBottomColor: '#D5D5D5',
                    borderBottomWidth: 2
                }} key={i}
                    onPress={() => { closeCompanyModal(catName.Value, catName.Text) }}>
                    <Text style={{
                        textAlign: 'center', fontWeight: 'bold',
                        fontSize: 20,
                        color: '#535353'
                    }}
                        key={catName.Value}>{catName.Text}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }

    const getCompanyforIndex = async () => {
        try {
            await GetCompanyByUserId(user?.Id)
                .then(res => {
                    if (res?.length > 0) {
                        const cList = [];
                        res?.forEach(function (item) {
                            const ob = {
                                'Text': item?.CompanyName,
                                'Value': item?.Id,
                                'Address': item?.Address,
                                'phone': item?.PhoneNumber,
                                'MaximumOfficeHours': item?.MaximumOfficeHours,
                                'OfficeOutTime': item?.OfficeOutTime,
                            }
                            cList.push(ob);
                        });
                        setcompanyList(cList);
                    }
                })
                .catch((e) => {
                    console.log("error occured", e);
                });
        } catch (error) {
            console.log(error);
        }
    }
    const getCompany = async () => {
        try {

            await GetCompanyByUserId(user?.Id)
                .then(res => {
                    if (res?.length > 0) {
                        const cList = [];
                        res?.forEach(function (item) {
                            const ob = {
                                'Text': item?.CompanyName,
                                'Value': item?.Id,
                                'Address': item?.Address,
                                'phone': item?.PhoneNumber,
                                'MaximumOfficeHours': item?.MaximumOfficeHours,
                                'OfficeOutTime': item?.OfficeOutTime,
                            }
                            cList.push(ob);
                        });
                        setcompanyList(cList);
                        setslectedCompanyIndex(cList[0].Value.toString());
                        setselctedCompanyValue(cList[0].Text);
                        LocalStorage.SetData("companyId", cList[0].Value.toString());
                        LocalStorage.SetData("companyName", cList[0].Text);
                    }
                })
                .catch(() => {

                });
        } catch (error) {
            console.log(error);
        }
    }

    const getAttendanceFeed = async (cId) => {
        await GetAttendanceFeed(cId)
            .then(res => {
                setemployeeList(res?.EmployeeList);
                setdisplayAbleEmployeeList(res?.EmployeeList);
                setstatusCount(res?.StatusCount);
            }).catch(() => {
            });
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
                            {statusCount?.TotalEmployee}
                        </Text>
                        <Text
                            style={selectedId == 1 ?
                                DailyAttendanceStyle.countBoxColumn1LabelActive :
                                DailyAttendanceStyle.countBoxColumn1LabelInactive}>
                            EMPLOYEES
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedOption(2)}>
                    <View style={DailyAttendanceStyle.countBoxColumn2}>
                        <Text
                            style={selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2NumberActive :
                                DailyAttendanceStyle.countBoxColumn2NumberInactive}>
                            {statusCount?.TotalCheckIn}
                        </Text>
                        <Text
                            style={selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2LabelActive :
                                DailyAttendanceStyle.countBoxColumn2LabelInactive}>
                            CHECKED IN
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedOption(3)}>
                    <View style={DailyAttendanceStyle.countBoxColumn3}>
                        <Text
                            style={selectedId == 3 ?
                                DailyAttendanceStyle.countBoxColumn3NumberActive :
                                DailyAttendanceStyle.countBoxColumn3NumberInactive
                            }
                        >
                            {statusCount?.TotalNotAttend}
                        </Text>
                        <Text
                            style={selectedId == 3 ?
                                DailyAttendanceStyle.countBoxColumn3LabelActive :
                                DailyAttendanceStyle.countBoxColumn3LabelInactive}
                        >
                            NOT ATTEND
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            {isLoaded ?
                <View style={DailyAttendanceStyle.container}>
                    <Header
                        onSelect={() => setCompanyModal(true)}
                        selected={selctedCompanyValue}
                        onPress={() => { navigation.openDrawer(); }}
                        onGoBack={() => handleBackButton()}
                    />
                    <View
                        style={
                            DailyAttendanceStyle.ListContainer
                        }>
                        {renderStatusList()}
                    </View>
                    <View style={DailyAttendanceStyle.FlatListContainer}>
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={_onRefresh}
                                />
                            }
                            data={displayAbleEmployeeList}
                            keyExtractor={(x, i) => i.toString()}
                            renderItem={({ item }) =>
                                <View style={DailyAttendanceStyle.FlatListTouchableOpacity}>
                                    <TouchableOpacity onPress={() => goToDetail(item)}>
                                        <View style={DailyAttendanceStyle.FlatListAttendanceLeft}>
                                            <View style={{ paddingRight: 10 }}>
                                                {item?.ImageFileName && item?.ImageFileName !== 'null' ?
                                                    <Image resizeMode='cover' style={
                                                        DailyAttendanceStyle.ImageLocal
                                                    } source={{ uri: urlResource + item?.ImageFileName }} /> : <Image style={
                                                        DailyAttendanceStyle.ImagestyleFromServer
                                                    } resizeMode='cover' source={require('../../../../assets/images/employee.png')} />}


                                                {(item?.CheckInTime && item?.CheckOutTime) ?
                                                    (<Image resizeMode="contain"
                                                        style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                                                        source={require('../../../../assets/images/icon_gray.png')} />)
                                                    : ((item?.CheckInTime && !item?.CheckOutTime) ?
                                                        (<Image style={DailyAttendanceStyle.styleForonlineOfflineIcon
                                                        } resizeMode='contain' source={require('../../../../assets/images/icon_green.png')} />)
                                                        : (<Image style={
                                                            DailyAttendanceStyle.styleForonlineOfflineIcon
                                                        } resizeMode='contain' source={require('../../../../assets/images/icon_gray.png')} />))
                                                }
                                            </View>
                                            <View style={DailyAttendanceStyle.RightTextView}>
                                                <Text style={DailyAttendanceStyle.NameText}>
                                                    {item?.EmployeeName}
                                                </Text>
                                                <Text style={DailyAttendanceStyle.DesignationText}>
                                                    {item?.Designation}
                                                </Text>
                                                <Text style={DailyAttendanceStyle.DepartmentText} >
                                                    {item?.DepartmentName}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    {item?.CheckInTime &&
                                        <View style={DailyAttendanceStyle.TimeContainer}>
                                            <TouchableOpacity onPress={() => ShowImageViewer(item?.CheckInTimeFile)}>
                                                <View style={DailyAttendanceStyle.AttendanceImageView1}>
                                                    <Image resizeMode='cover' style={
                                                        DailyAttendanceStyle.AttendanceImage
                                                    } source={{ uri: urlResource + item?.CheckInTimeFile }} />
                                                    <Text style={
                                                        DailyAttendanceStyle.CheckinTimeText
                                                    }>
                                                        {item?.CheckInTime ? moment(item?.CheckInTime).format('DD/MM/YY') : ("")}</Text>
                                                </View>

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => ShowImageViewer(item?.CheckOutTimeFile)}>
                                                <View style={DailyAttendanceStyle.AttendanceImageView2}>
                                                    <Image resizeMode='cover' style={
                                                        DailyAttendanceStyle.AttendanceImage
                                                    } source={{ uri: urlResource + item?.CheckOutTimeFile }} />
                                                    <Text style={
                                                        DailyAttendanceStyle.CheckOutTimeText
                                                    }>{item?.CheckOutTime ? moment(item?.CheckOutTime).format('DD/MM/YY') : ("")}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            }>
                        </FlatList>
                    </View>
                    <Modal style={{
                        height: 350,
                        width: "75%",
                        borderRadius: 20,
                        backgroundColor: '#EBEBEB',
                    }}
                        position={"center"}
                        isOpen={CompanyModal}
                        backdropPressToClose={false}
                        swipeToClose={false}
                    >
                        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                            <View style={{ alignItems: "flex-start" }}>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <TouchableOpacity
                                    onPress={() => setCompanyModal(false)}
                                    style={{
                                        marginLeft: 0, marginTop: 0,
                                    }}>
                                    <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                        source={require('../../../../assets/images/close.png')}>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ paddingVertical: 20, }}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                                <View style={{}} >
                                    {renderCompanyList()}
                                </View>
                            </ScrollView>
                        </View>
                    </Modal>


                    <Modal
                        style={{
                            height: "90%",
                            width: "98%",
                            marginTop: 20,
                            borderRadius: 20,
                            backgroundColor: '#EBEBEB',
                        }}
                        transparent={false}
                        position={"center"}
                        backdropPressToClose={false}
                        swipeToClose={false}
                        onRequestClose={() => setViewerModal(false)}
                        isOpen={ViewerModal}
                    >
                        <View
                            style={{
                                width: "100%",
                                padding: 5,
                                backgroundColor: 'black',
                                justifyContent: 'space-between',
                            }}>

                            <TouchableOpacity
                                style={{ alignItems: "flex-end", padding: 10, }}
                                onPress={() => setViewerModal(false)}
                            >
                                <Image resizeMode="contain" style={{ width: 15, height: 15 }}
                                    source={require('../../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                        <ImageViewer imageUrls={ZoomImage} >
                        </ImageViewer>
                    </Modal>

                </View> :
                <ActivityIndicator size="large" color="#1B7F67"
                    style={TaskStyle.loaderIndicator} />
            }
        </>
    )
}

export default AdminTodayAttendance
