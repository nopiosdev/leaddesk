import React, { Component, useEffect, useState } from 'react';
import {
    FlatList, Text, View, Image, StatusBar, TouchableOpacity, ScrollView,
    Platform, RefreshControl, BackHandler, Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Iconic from 'react-native-vector-icons/Feather'
import { CommonStyles } from '../../../common/CommonStyles';
import {
    loadFromStorage,
    storage,
    CurrentUserProfile
} from "../../../common/storage";
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import Modal from 'react-native-modalbox';

import { GetCompanyByUserId } from "../../../services/CompanyService"
import { useSelector } from "react-redux";

import { GetAttendanceFeed } from '../../../services/EmployeeTrackService';
import { urlDev, urlResource } from '../../../services/api/config';
import ImageViewer from 'react-native-image-zoom-viewer';
import { DrawerContentStyle } from "../../MenuDrawer/DrawerContentStyle"
import LocalStorage from '../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../Loader';

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

        getAttendanceFeed(companyId);
    }

    const ShowImageViewer = (f) => {
        var images = [{ url: urlResource + f, },];
        setZoomImage(images)
        setViewerModal(true);
    }

    const goToDetail = (item) => {
        console.log(item.PhoneNumber)
        navigation.navigate('Tab', {
            screen: 'DailyAttendanceDetails',
            params: { aItem: item }
        })
    };

    const setSelectedOption = (id) => {
        setselectedId(id);
        switch (id) {
            case 1: //All
                setdisplayAbleEmployeeList(employeeList);
                break;
            case 2: //checked in
                setdisplayAbleEmployeeList(employeeList?.filter(x => x.IsCheckedIn || x.IsCheckedOut));
                break;
            case 3: //not attend
                setdisplayAbleEmployeeList(employeeList?.filter(x => x.NotAttend));
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
            setselctedCompanyValue(user?.CompanyName);
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            getAttendanceFeed(cId);
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
            setIsLoaded(true);
        })();
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
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
                    // console.log('company...', res.result);
                    if (res.result === null) {
                        <AppLoading></AppLoading>
                    } else if (res.result.length > 0) {

                        const cList = [];
                        res.result.forEach(function (item) {
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
                    }
                })
                .catch(() => {
                    console.log("error occured");
                });
        } catch (error) {
            console.log(error);
        }
    }
    const getCompany = async () => {
        try {

            await GetCompanyByUserId(user?.Id)
                .then(res => {
                    console.log('company...', res.result);
                    if (res.result === null) {
                        <AppLoading></AppLoading>
                    } else if (res.result.length > 0) {
                        const cList = [];
                        res.result.forEach(function (item) {
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
                        // console.log(companyList, 'compaylist....')
                        LocalStorage.SetData("companyId", companyList[0].Value.toString());
                        LocalStorage.SetData("companyName", companyList[0].Text);
                    }
                })
                .catch(() => {

                });
        } catch (error) {
            console.log(error);
        }
    }


    const goBack = () => {
        navigation.goBack();
    }

    const getAttendanceFeed = async (cId) => {

        await GetAttendanceFeed(cId)
            .then(res => {
                console.log("first", res)
                setemployeeList(res.result.EmployeeList);
                setdisplayAbleEmployeeList(res.result.EmployeeList);
                setstatusCount(res.result.StatusCount);
                // console.log(res.result.EmployeeList, 'emplist');
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
                            {statusCount.TotalEmployee}
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
                            {statusCount.TotalCheckIn}
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
                            {statusCount.TotalNotAttend}
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
                    <View
                        style={CommonStyles.HeaderContent}>
                        <View
                            style={CommonStyles.HeaderFirstView}>
                            <TouchableOpacity
                                style={CommonStyles.HeaderMenuicon}
                                onPress={() => { navigation.openDrawer(); }}>
                                <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                    source={require('../../../../assets/images/menu_b.png')}>
                                </Image>
                            </TouchableOpacity>
                            <View
                                style={[DrawerContentStyle.logoImage, {

                                }]}>
                                <TouchableOpacity
                                    style={DrawerContentStyle.CompanyModalStyle}
                                    onPress={() => setCompanyModal(true)}
                                >
                                    <Text
                                        style={DrawerContentStyle.CompanyModalTextStyle}>
                                        {selctedCompanyValue}

                                    </Text>
                                    <Iconic
                                        name="chevrons-down" size={14} color="#d6d6d6"
                                        style={DrawerContentStyle.CompanyModalIconStyle}>
                                    </Iconic>
                                </TouchableOpacity>
                            </View>
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
                            data={displayAbleEmployeeList}
                            keyExtractor={(x, i) => i.toString()}
                            renderItem={({ item }) =>

                                <View style={
                                    DailyAttendanceStyle.FlatListTouchableOpacity
                                }>

                                    <TouchableOpacity onPress={() => goToDetail(item)}>
                                        <View
                                            style={
                                                DailyAttendanceStyle.FlatListAttendanceLeft
                                            }>
                                            <View style={{ paddingRight: 10, }}>
                                                {item.ImageFileName !== "" ?
                                                    <Image resizeMode='cover' style={
                                                        DailyAttendanceStyle.ImageLocal
                                                    } source={{ uri: urlResource + item.ImageFileName }} /> : <Image style={
                                                        DailyAttendanceStyle.ImagestyleFromServer
                                                    } resizeMode='cover' source={require('../../../../assets/images/employee.png')} />}


                                                {item.IsCheckedOut ? (<Image resizeMode="contain"
                                                    style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                                                    source={require('../../../../assets/images/icon_gray.png')} />)
                                                    : (item.IsCheckedIn ?
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
                                    </TouchableOpacity>

                                    <View style={DailyAttendanceStyle.TimeContainer}>
                                        <TouchableOpacity onPress={() => ShowImageViewer(item.CheckInTimeFile)}>
                                            <View style={DailyAttendanceStyle.AttendanceImageView1}>
                                                <Image resizeMode='cover' style={
                                                    DailyAttendanceStyle.AttendanceImage
                                                } source={{ uri: urlResource + item.CheckInTimeFile }} />
                                                <Text style={
                                                    DailyAttendanceStyle.CheckinTimeText
                                                }>
                                                    {item.CheckInTimeVw !== "" ? item.CheckInTimeVw : ("")}</Text>
                                            </View>

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => ShowImageViewer(item.CheckOutTimeFile)}>
                                            <View style={DailyAttendanceStyle.AttendanceImageView2}>
                                                <Image resizeMode='cover' style={
                                                    DailyAttendanceStyle.AttendanceImage
                                                } source={{ uri: urlResource + item.CheckOutTimeFile }} />
                                                <Text style={
                                                    DailyAttendanceStyle.CheckOutTimeText
                                                }>{item.IsCheckedOut ? item.CheckOutTimeVw : ("")}</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
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
                <Loader />
            }
        </>
    )
}

export default AdminTodayAttendance
