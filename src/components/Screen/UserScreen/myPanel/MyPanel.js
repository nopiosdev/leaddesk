import React, { useState, useEffect } from 'react';

import Modal from 'react-native-modalbox';
import Timeline from 'react-native-timeline-flatlist'
import { googlemapApiForAutoCheckPoint } from '../../../../services/api/config';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import NetInfo from "@react-native-community/netinfo";
import { MyPanelStyle } from './MyPanelStyle';

import {
    loadFromStorage,
    storage,
    CurrentUserProfile
} from "../../../../common/storage";

const options = {
    title: 'Select',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
import { Platform, ScrollView, Text, View, Image, StatusBar, ActivityIndicator, ToastAndroid, RefreshControl, Alert, TextInput, TouchableOpacity, BackHandler, StyleSheet, AppState } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
// import Geolocation from 'react-native-geolocation-service';

import {
    CheckIn, CheckOut, CheckPoint,
    GetMyTodayAttendance,
    GetMovementDetails,
} from '../../../../services/UserService/EmployeeTrackService';
import { getLocation } from '../../../../services/LocationService'

import { UpdateEmployee } from '../../../../services/UserService/AccountService'

import { NoticeStyle } from '../../notice/NoticeStyle'
import { ConvertUtcToLocalTime } from '../../../../common/commonFunction'
import {
    DailyAttendanceCombo,
} from '../../../MenuDrawer/DrawerContent';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { urlDev, urlResource } from '../../../../services/api/config';
import { useSelector } from 'react-redux';
import LocalStorage from '../../../../common/LocalStorage';
import CustomImagePicker from '../../../CustomImagePicker';
import CustomTimeLine from '../../../CustomTimeLine';
import { upLoadImage } from '../../../../services/TaskService';
import Header from '../../../Header';
import Loader from '../../../Loader';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;

let uIdd = "";
let comIdd = "";

const BACKGROUND_FETCH_TASK = 'background-fetch';
TaskManager.defineTask(BACKGROUND_FETCH_TASK, () => {
    try {
        const now = Date.now();
        console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
        const receivedNewData = _getLocationAsync(); // do your background fetch here
        console.log('receivedNewData', receivedNewData);
        return receivedNewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
    } catch (error) {
        console.log('failed', BackgroundFetch.Result.Failed);
        return BackgroundFetch.Result.Failed;
    }
});
const _getLocationAsync = async () => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            ToastAndroid.show('Permission to access location was denied', ToastAndroid.TOP);
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        await fetchlog(location.coords.latitude, location.coords.longitude);
    } catch (error) {
        console.log('l error', error);
    }
};

const createCheckPoint = async (Latitude, Longitude, loglocation) => {
    try {

        var data = new FormData();
        data.append('Latitude', Latitude);
        data.append('Longitude', Longitude);
        data.append('userId', uIdd);
        data.append('LogLocation', loglocation ? loglocation : '');
        data.append('DeviceName', "Ioo");
        data.append('DeviceOSVersion', Platform.OS === 'ios' ? Platform.systemVersion : Platform.Version);
        data.append('companyId', comIdd);

        console.log("TrackingModel response", data)


        const response = await CheckPoint(data);
        if (response && response.success) {
            console.log("createCheckPoint response", response)

        }
    } catch (errors) {
        console.log("createCheckPoint Errors", errors);
    }
}
const fetchlog = async (lat, long) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&sensor=true&key=' + googlemapApiForAutoCheckPoint + '', {
        method: 'GET',
        //Request Type
    })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
            //Success
            console.log('addlo', responseJson.results[0].formatted_address);
            createCheckPoint(JSON.stringify(lat), JSON.stringify(long), responseJson.results[0].formatted_address);
        })
        //If response is not in json then in error
        .catch(error => {
            //Error
            console.error(error);
        });
}
let interval = null;
const MyPanel = ({ navigation }) => {

    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [gps, setgps] = useState(false);
    const [svgLinHeight, setsvgLinHeight] = useState(60 * 0 - 60);
    const [touchabledisable, settouchabledisable] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const [location, setlocation] = useState('');
    const [touchabledisablepointcheckin, settouchabledisablepointcheckin] = useState(false);
    const [touchabledisablepoint, settouchabledisablepoint] = useState(false);
    const [touchabledisablepointcheckout, settouchabledisablepointcheckout] = useState(false);
    const [attendanceModel, setattendanceModel] = useState(null);
    const [EmpTrackList, setEmpTrackList] = useState([]);
    const [AttendanceDateVw, setAttendanceDateVw] = useState('');
    const [CheckInTimeVw, setCheckInTimeVw] = useState('');
    const [CheckOutTimeVw, setCheckOutTimeVw] = useState('');
    const [DepartmentName, setDepartmentName] = useState('');
    const [Designation, setDesignation] = useState('');
    const [EmployeeCode, setEmployeeCode] = useState('');
    const [EmployeeName, setEmployeeName] = useState('');
    const [IsCheckedIn, setIsCheckedIn] = useState(false);
    const [IsCheckedOut, setIsCheckedOut] = useState(false);
    const [OfficeStayHour, setOfficeStayHour] = useState('');
    const [Status, setStatus] = useState('');
    const [image, setimage] = useState(null);
    const [UserId, setUserId] = useState('');
    const [Latitude, setLatitude] = useState(null);
    const [Longitude, setLongitude] = useState(null);
    const [LogLocation, setLogLocation] = useState(null);
    const [DeviceOSVersion, setDeviceOSVersion] = useState(Platform.OS === 'ios' ? Platform.systemVersion : Platform.Version);
    const [CompanyId, setCompanyId] = useState('');
    const [Reason, setReason] = useState('');
    const [ImageFileName, setImageFileName] = useState('');
    const [mobile, setmobile] = useState('');
    const [name, setname] = useState('');
    const [gmail, setgmail] = useState('');
    const [Imageparam, setImageparam] = useState("resourcetracker");
    const [ImageFileId, setImageFileId] = useState(null);
    const [EmployeeId, setEmployeeId] = useState(null);
    const [data, setdata] = useState([]);
    const [currentLongitude, setcurrentLongitude] = useState('unknown');
    const [currentLatitude, setcurrentLatitude] = useState('unknown');
    const [myApiKey, setmyApiKey] = useState("AIzaSyAuojF8qZ_EOF1uLSddHckbEAKtbbwA2uY");
    const [pointcheck, setpointcheck] = useState('');
    const [fetchDate, setfetchDate] = useState(null);
    const [status, setstatus] = useState(null);
    const [isRegistered, setisRegistered] = useState(false);
    const [IsAutoCheckPoint, setIsAutoCheckPoint] = useState(false);
    const [AutoCheckPointTime, setAutoCheckPointTime] = useState('1:00:00');
    const user = useSelector((state) => state.user.currentUser);
    const [modalEditEmp, setmodalEditEmp] = useState(false);
    const [modalForImage, setmodalForImage] = useState(false);
    const [successMessage, setsuccessMessage] = useState(null);
    const [error, seterror] = useState(null);



    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);
        getMyTodayAttendance();
    };



    const _takeSelfiePhoto = async () => {
        await ImagePicker.getCameraPermissionsAsync()
        await ImagePicker.getMediaLibraryPermissionsAsync();
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            height: 250,
            width: 250,
        });
        if (pickerResult.cancelled == false) {
            handleSelfiePhoto(pickerResult)
        }
    };

    const handleSelfiePhoto = async (pickerResult) => {
        let filename = pickerResult?.uri?.split('/')?.pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        var data = new FormData();
        data.append('thumb', {
            uri: pickerResult.uri,
            name: filename,
            type: type
        })
        setprogressVisible(true);
        upLoadImage(data)
            .then(response => {
                setprogressVisible(false);
                console.log('ImagePath', response)
                if (response?.success) {
                    _sendToServer(response.image)
                } else {
                    ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
                }
            })
            .catch(error => {
                setprogressVisible(false);
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
            });
    };

    const _sendToServer = async (fileId) => {
        var s = await getLocation(Latitude, Longitude);
        setLogLocation(s);
        console.log(Latitude, 'Latitude', 'Longitude', Longitude, '_sendToServer setLogLocation', s)
        if (pointcheck == "CheckIn") {
            createCheckingIn(fileId);
        } else if (pointcheck == "CheckPoint") {
            createCheckPoint(fileId);
        } else {
            createCheckOut(fileId);
        }
    }

    const closeModalEditProfile = () => {
        updateEmployeeRecords();
    }
    const openModalEditProfile = () => {
        setmodalEditEmp(true);
    }
    const openmodalForImage = () => {
        setmodalForImage(true);
    }

    const updateEmployeeRecords = async () => {

        var data = new FormData();
        data.append('UserFullName', EmployeeName);
        data.append('EmployeeCode', EmployeeCode);
        data.append('DesignationName', Designation);
        data.append('Id', EmployeeId);
        data.append('ImageFileName', ImageFileName);
        data.append('ImageFileId', ImageFileId);
        data.append('AutoCheckPointTime', AutoCheckPointTime);
        data.append('IsAutoCheckPoint', IsAutoCheckPoint);
        data.append('IsActive', null);



        try {
            let response = await UpdateEmployee(data);
            console.log('UpdateEmployee', response)
            setsuccessMessage(response?.message);
            if (response && response?.success) {
                setmodalEditEmp(false);
                getMyTodayAttendance();
            } else {
                Alert.alert(
                    "",
                    response?.message,
                    [
                        { text: 'OK', },
                    ],
                    { cancelable: false }
                )

            }
        } catch (errors) {
            Alert.alert(
                "",
                "data does not saved",
                [
                    { text: 'OK', },
                ],
                { cancelable: false }
            )

        }
    }

    useEffect(() => {

        (async () => {
            const comId = await LocalStorage.GetData("companyId");
            await setname(user?.UserFullName);
            await setmobile(user?.PhoneNumber);
            await setgmail(user?.Email);
            setCompanyId(comId);
            getMyTodayAttendance();
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            ClearInterval();
        }
    }, [])

    const setInterval = () => {
        var t = getMinute(AutoCheckPointTime);
        interval = setInterval(() =>
            getAutoLocation()
            , 1000 * (t * 60));
    }
    const getAutoLocation = async () => {
        setpointcheck("CheckPoint");
        if (IsCheckedIn === 1 && IsCheckedOut !== 1) getLocationInfo();
        console.log('I do not leak!', new Date());
    }

    const ClearInterval = () => {
        clearInterval(interval);
    }
    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    // const goBack = () => {
    //     DailyAttendanceCombo();
    // }
    const getMyTodayAttendance = async () => {

        setprogressVisible(true);
        await GetMyTodayAttendance(user?.Id)
            .then(res => {
                console.log('GetMyTodayAttendance', res)
                if (!res?.success && res?.success !== false) {
                    setattendanceModel(res);
                    setEmployeeCode(res?.EmployeeCode);
                    setEmployeeName(res?.EmployeeName);
                    setDepartmentName(res?.DepartmentName);
                    setDesignation(res?.Designation);
                    setCheckInTimeVw(ConvertUtcToLocalTime(res?.CheckInTime));
                    setCheckOutTimeVw(ConvertUtcToLocalTime(res?.CheckOutTime));
                    setOfficeStayHour(res?.OfficeStayHour);
                    setIsCheckedIn(res?.CheckInTime && !res?.CheckOutTime ? 1 : 0);
                    setIsCheckedOut(res?.CheckInTime && res?.CheckOutTime ? 1 : 0);
                    setIsAutoCheckPoint(res?.IsAutoCheckPoint);
                    setAutoCheckPointTime(res?.AutoCheckPointTime);
                    setStatus(res?.Status);
                    setEmployeeId(res?.EmployeeId);
                    setImageFileName(res?.ImageFileName);
                }
                setprogressVisible(false);
            }).catch(() => {
                setprogressVisible(false);
                console.log("GetMyTodayAttendance error occured");
            });
        setprogressVisible(true);
        await GetMovementDetails(user?.Id)
            .then(res => {
                setdata([]);
                console.log('GetMovementDetails', res)
                if (!res?.success && res?.success !== false) {

                    setEmpTrackList(res);
                    let tempData = [];
                    res?.map((userData) => {

                        var title = '';
                        var color = '';
                        if (userData?.IsCheckedInPoint === 1) {
                            title = "Checked In";
                            color = "green"
                        } else if (userData?.IsCheckedOutPoint === 1) {
                            title = "Checked Out";
                            color = "red"
                        } else {
                            title = "Checked point";
                            color = "gray"
                        }

                        var myObj = {
                            "time": ConvertUtcToLocalTime(userData?.LogDateTime),
                            "title": title,
                            "description": userData?.LogLocation,
                            "circleColor": color
                        };
                        tempData.push(myObj);
                    })
                    setdata(tempData);
                }
                setprogressVisible(false);
            }).catch((error) => {
                setprogressVisible(false);
                console.log("GetMovementDetails error occured", error);
            });
    }

    const getLocationInfo = async () => {
        console.log('_getLocationAsync')
        var that = this;
        //Checking for the permission just after component loaded
        if (Platform.OS === 'android' && !Constants.isDevice) {
            seterrorMessage('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
            ToastAndroid.show(errorMessage, ToastAndroid.TOP);
            setprogressVisible(false)
        } else {
            await _getLocationAsync();
        }
    }


    const _getLocationAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            ToastAndroid.show('Permission to access location was denied', ToastAndroid.TOP);
        }
        await Location.getCurrentPositionAsync({
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 0,
            distanceFilter: 10
        }).then((position) => {
            console.log(position, 'test positions');
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            setLatitude(currentLatitude);
            setLongitude(currentLongitude);
            if (pointcheck == "CheckPoint") {
                _sendCheckpointToServer();
            }
            else {
                _takeSelfiePhoto();
            }
        });
    };

    const _sendCheckpointToServer = async () => {
        var s = await getLocation(currentLatitude, currentLongitude);
        setLogLocation(s);
        createCheckPoint();
    }
    // const _getLocationAsyncforgps = async () => {

    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             setLatitude(position?.coords?.latitude);
    //             setLongitude(position?.coords?.longitude);
    //             seterror(null);;
    //         },
    //         (error) => seterror(error?.message),
    //         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    //     );

    // }
    const getMinute = (value) => {
        var timeList = value.split(":");
        var hours = parseInt(timeList[0]),
            minutes = parseInt(timeList[1]),
            seconds = parseInt(timeList[2]);
        var tm = (hours * 60) + minutes + (seconds / 60);
        console.log('auto time in m', tm);
        return tm;

    }
    const toggle = async () => {
        if (isRegistered) {
            await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
        } else {
            if (IsAutoCheckPoint) {
                await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
                    minimumInterval: getMinute(AutoCheckPointTime) * 60, // 1 minute
                    stopOnTerminate: false,
                    startOnBoot: true,
                });
            }
        }
        console.log('auto checkpoint run');
        setisRegistered(!isRegistered);
    };
    const renderTrackList = () => {
        return <CustomTimeLine data={data} />
    }

    const createCheckingIn = async (fileId) => {
        try {
            var data = new FormData();
            data.append('Latitude', Latitude);
            data.append('Longitude', Longitude);
            data.append('userId', user?.Id);
            data.append('LogLocation', LogLocation ? LogLocation : '');
            data.append('DeviceName', '');
            data.append('DeviceOSVersion', DeviceOSVersion);
            data.append('companyId', CompanyId);
            data.append('CheckInTimeFile', fileId);

            setprogressVisible(true);
            const response = await CheckIn(data);
            console.log("createCheckingIn response", response)
            if (response.success) {
                // getEmpTrackingTodayList();GetMyTodayAttendance
                toggle();
                // this.setInterval();
                getMyTodayAttendance();
                setprogressVisible(false);

            } else {
                ToastAndroid.show('Something went wrong', ToastAndroid.TOP);
                setprogressVisible(false);
            }
        } catch (errors) {
            console.log("createCheckingIn Errors", errors);
            setprogressVisible(false);
        }
    }

    const createCheckPoint = async () => {
        try {
            setprogressVisible(true);

            var data = new FormData();
            data.append('Latitude', Latitude);
            data.append('Longitude', Longitude);
            data.append('userId', user?.Id);
            data.append('LogLocation', LogLocation ? LogLocation : '');
            data.append('DeviceName', '');
            data.append('DeviceOSVersion', DeviceOSVersion);
            data.append('companyId', CompanyId);


            const response = await CheckPoint(data);
            console.log("createCheckPoint response", response)
            if (response && response.success) {
                toggle();
                //  this.getEmpTrackingTodayList();
                getMyTodayAttendance();

                setprogressVisible(false);
            } else {
                ToastAndroid.show('Something went wrong', ToastAndroid.TOP);
                setprogressVisible(false);
            }
        } catch (errors) {
            console.log("createCheckPoint Errors", errors);
            setprogressVisible(false);
        }
    }

    const createCheckOut = async (fileId) => {
        try {

            var data = new FormData();
            data.append('Latitude', Latitude);
            data.append('Longitude', Longitude);
            data.append('userId', user?.Id);
            data.append('LogLocation', LogLocation ? LogLocation : '');
            data.append('DeviceName', '');
            data.append('DeviceOSVersion', DeviceOSVersion);
            data.append('companyId', CompanyId);
            data.append('CheckInTimeFile', fileId);
            data.append('LessTimeReason', '');


            const response = await CheckOut(data);
            setprogressVisible(true);

            console.log("createCheckOut response", response)
            if (response && response.success) {

                //  getEmpTrackingTodayList();
                getMyTodayAttendance();
                ClearInterval();
                toggle();
                setprogressVisible(false);

            } else {
                ToastAndroid.show('Something went wrong', ToastAndroid.TOP);
                setprogressVisible(false);
            }
        } catch (errors) {
            console.log("createCheckOut Errors", errors);
            setprogressVisible(false);
        }
    }

    const getCheckIn = async () => {

        setpointcheck('CheckIn')
        settouchabledisablepointcheckin(true);
        settouchabledisable(true);
        setprogressVisible(true);
        console.log('check for getCheckIn', IsCheckedIn);


        if (IsCheckedOut !== 1) {
            if (IsCheckedIn !== 1) {
                setprogressVisible(true);
                await getLocationInfo();
                settouchabledisablepointcheckin(false);
            } else {
                setprogressVisible(false);
                settouchabledisablepointcheckin(false);
                ToastAndroid.show('You have already checked in today', ToastAndroid.TOP);
            }
        } else {
            setprogressVisible(false);
            settouchabledisablepointcheckin(false);
            ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
        }

        // } else {
        //     ToastAndroid.show("No Internet Detected", ToastAndroid.TOP);
        // }
    }
    const getCheckOut = async () => {

        console.log('check for getCheckOut', IsCheckedOut);

        setpointcheck('CheckOut')
        // settouchabledisablepointcheckout(true);
        settouchabledisable(true);
        setprogressVisible(true);

        if (IsCheckedOut !== 1) {
            if (IsCheckedIn === 1 && IsCheckedOut !== 1) {
                setprogressVisible(false);
                await getLocationInfo();

            } else {
                setprogressVisible(false);
                settouchabledisablepointcheckout(false);
                ToastAndroid.show('You have not checked in today', ToastAndroid.TOP);
            }
        } else {
            setprogressVisible(false);
            settouchabledisablepointcheckout(false);
            ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
        }

    }

    const getCheckPoint = async () => {
        setpointcheck('CheckPoint')
        settouchabledisablepoint(true);
        settouchabledisable(true);
        setprogressVisible(true);

        console.log('check for getCheckPoint', IsCheckedIn);
        if (IsCheckedOut === 1) {
            setprogressVisible(false);
            settouchabledisablepoint(false);
            return ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
        }
        if (IsCheckedIn === 1 && IsCheckedOut !== 1) {

            getLocationInfo();
            // console.log("clicked");
            setprogressVisible(false);
            settouchabledisablepoint(false);

        } else {
            setprogressVisible(false);
            ToastAndroid.show('You have not checked in today', ToastAndroid.TOP);
            setprogressVisible(false);
            settouchabledisablepoint(false);
        }
    }


    const renderTimeStatusList = () => {
        return (
            <View
                style={MyPanelStyle.TimeInfoBar}>
                <View
                    style={MyPanelStyle.First2TimePanelView}>

                    <View
                        style={MyPanelStyle.AllTimePanelRow}>
                        <Text>
                            {CheckInTimeVw ?
                                (<AntDesign name="arrowdown"
                                    size={18} color="#07c15d"
                                    style={{ marginTop: 3, }}
                                />) : (<Text
                                    style={MyPanelStyle.TimeStatusText}>
                                    NOT YET
                                </Text>)
                            }
                        </Text>
                        <Text
                            style={MyPanelStyle.CheckedInText}>
                            {CheckInTimeVw}
                        </Text>
                    </View>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text
                            style={MyPanelStyle.TimeStatusText}>
                            CHECKED IN
                        </Text>
                    </View>
                </View>
                <View
                    style={MyPanelStyle.First2TimePanelView}>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text>
                            {OfficeStayHour ?
                                (<Entypo name="stopwatch"
                                    size={17} color="#a1b1ff"
                                    style={{
                                        marginTop: 2,
                                        marginRight: 2,
                                    }}
                                />) : (<Text
                                    style={MyPanelStyle.TimeStatusText}>
                                    NOT YET
                                </Text>)
                            }
                        </Text>
                        <Text
                            style={MyPanelStyle.WorkingTimeText}>
                            {OfficeStayHour}
                        </Text>
                    </View>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text
                            style={MyPanelStyle.TimeStatusText}>
                            WORKING TIME
                        </Text>
                    </View>
                </View>
                <View
                    style={MyPanelStyle.Last1TimePanelView}>
                    <View
                        style={MyPanelStyle.AllTimePanelRow}>
                        <Text>
                            {CheckOutTimeVw ?
                                (<AntDesign name="arrowup"
                                    size={18}
                                    style={{ marginTop: 3, }}
                                    color="#a1d3ff"
                                />) : (<Text
                                    style={MyPanelStyle.TimeStatusText}>
                                    NOT YET
                                </Text>)
                            }
                        </Text>
                        <Text style={MyPanelStyle.CheckedOutText}>
                            {CheckOutTimeVw}
                        </Text>
                    </View>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text
                            style={MyPanelStyle.TimeStatusText}>
                            CHECKED OUT
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={MyPanelStyle.container}>
            <Header
                title={"My Panel"}
                onPress={() => navigation.openDrawer()}
            />
            {!progressVisible ?
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                        />
                    }>
                    <View
                        style={MyPanelStyle.MainInfoBar}>
                        <View
                            style={MyPanelStyle.MainInfoBarTopRow}>
                            <View style={MyPanelStyle.MainInfoBarTopRowLeft}>
                                {ImageFileName ? (
                                    <Image resizeMode='cover' style={
                                        {
                                            ...Platform.select({
                                                ios: {
                                                    width: 80,
                                                    height: 80,
                                                    marginRight: 10,
                                                    borderRadius: 40,
                                                },
                                                android: {
                                                    width: 80,
                                                    height: 80,
                                                    // elevation: 10 ,
                                                    borderRadius: 40,
                                                },
                                            }),
                                        }
                                    } source={{ uri: urlResource + ImageFileName }} />) :

                                    (<Image style={
                                        {
                                            ...Platform.select({
                                                ios: {
                                                    width: 80,
                                                    height: 80,
                                                    marginRight: 10,
                                                    borderRadius: 40,
                                                },
                                                android: {
                                                    width: 80,
                                                    height: 80,
                                                    // elevation: 10 ,
                                                    borderRadius: 600,
                                                },
                                            }),
                                        }
                                    } resizeMode='contain' source={require('../../../../../assets/images/employee.png')} />)}
                                <View
                                    style={MyPanelStyle.TextInfoBar}>
                                    <Text style={MyPanelStyle.UserNameTextStyle}>
                                        {EmployeeName}
                                    </Text>
                                    <Text style={MyPanelStyle.DesignationTextStyle}>
                                        {Designation}
                                    </Text>
                                    <Text style={MyPanelStyle.DepartmentTextStyle}>
                                        {DepartmentName}
                                    </Text>
                                </View>
                            </View>
                            <View style={MyPanelStyle.MainInfoBarTopRowRight}>
                                <TouchableOpacity
                                    onPress={() => openModalEditProfile()}
                                    style={MyPanelStyle.EditButtonContainer}>
                                    <Image
                                        resizeMode='contain'
                                        source={require('../../../../../assets/images/editprofie.png')}
                                        style={{ width: 47, height: 50 }}>
                                    </Image>
                                </TouchableOpacity>
                            </View >
                        </View>
                    </View>
                    <View>

                        {renderTimeStatusList()}
                    </View>
                    <View
                        style={MyPanelStyle.ButtonBar}>
                        <TouchableOpacity
                            disabled={touchabledisablepointcheckin}
                            onPress={() => getCheckIn()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../../assets/images/checkin.png')}
                                style={MyPanelStyle.ButtonImage}>
                            </Image>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={touchabledisablepoint}
                            onPress={() => getCheckPoint()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../../assets/images/checkpoint.png')}
                                style={MyPanelStyle.ButtonImage}>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={touchabledisablepointcheckout}
                            onPress={() => getCheckOut()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../../assets/images/checkout.png')}
                                style={MyPanelStyle.ButtonImage}>
                            </Image>
                        </TouchableOpacity>
                    </View >

                    <View
                        style={MyPanelStyle.TimeLineMainView}>
                        <View
                            style={MyPanelStyle.TimeLineHeaderBar}>
                            <Image
                                resizeMode="contain"
                                style={{
                                    width: 19.8,
                                    height: 19.8,
                                }}
                                source={require('../../../../../assets/images/goal.png')}>
                            </Image>
                            <Text
                                style={MyPanelStyle.TimeLineHeaderText}>
                                Timeline
                            </Text>
                        </View>
                        <View style={{}}>

                            {renderTrackList()}
                        </View>
                    </View>
                </ScrollView>
                : <Loader />}

            <Modal style={[MyPanelStyle.modalForEditProfile]} position={"center"} isOpen={modalEditEmp}
                backdropPressToClose={false}
                swipeToClose={false}
            >

                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalEditEmp(false)} style={{
                            marginLeft: 0, marginTop: 0,
                        }}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={MyPanelStyle.modelContent}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                            EDIT PROFILE
                        </Text>
                        {image == null ? (ImageFileName ? (<Image style={{
                            ...Platform.select({
                                ios: {
                                    width: 60, height: 60, borderRadius: 50
                                },
                                android: {
                                    width: 60,
                                    height: 60,
                                    marginVertical: 12,
                                    borderRadius: 50,
                                    alignSelf: 'center'
                                },
                            }),
                        }} resizeMode='cover' source={{ uri: urlResource + ImageFileName }} />) : (<Image style={{
                            ...Platform.select({
                                ios: {
                                    width: 60, height: 60, borderRadius: 50
                                },
                                android: {
                                    width: 100,
                                    height: 100,
                                    marginVertical: 12,
                                    borderRadius: 50,
                                    alignSelf: 'center'
                                },
                            }),
                        }} resizeMode='contain' source={require('../../../../../assets/images/employee.png')} />)) : (<Image style={{
                            ...Platform.select({
                                ios: {
                                    width: 60, height: 60, borderRadius: 50
                                },
                                android: {
                                    width: 60,
                                    height: 60,
                                    marginVertical: 12,
                                    borderRadius: 600,
                                    alignSelf: 'center'
                                },
                            }),
                        }} resizeMode='contain' source={{ uri: image }} />)}

                    </View>

                    <View style={{
                        marginTop: -60,
                        marginLeft: "27%",
                    }}>
                        <TouchableOpacity onPress={() => openmodalForImage()}>
                            <Image resizeMode="contain" style={{
                                width: 40,
                                height: 40,

                            }} source={require('../../../../../assets/images/photo_camera.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    {progressVisible == true ?
                        (<ActivityIndicator size="large" color="#1B7F67"
                            style={MyPanelStyle.loaderIndicator} />) : null}
                    <View style={{ width: "100%" }}>

                        {/* <TextInput
                            style={{ height: 40, margin: 15, padding: 5, backgroundColor: "#f1f4f6", borderRadius: 10, }}
                            value={EmployeeCode}
                            placeholder="Employee Code"
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                            onChangeText={text => setEmployeeCode(text)}
                        >
                        </TextInput> */}
                        <TextInput
                            style={{ height: 40, margin: 15, padding: 5,  backgroundColor: "#f1f4f6", borderRadius: 10, }}
                            value={EmployeeName}
                            placeholder="Employee Name"
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                            onChangeText={text => setEmployeeName(text)}
                        >
                        </TextInput>

                        <TextInput
                            style={{ height: 40, margin: 15, padding: 5, marginTop: 0, backgroundColor: "#f1f4f6", borderRadius: 10, }}
                            value={mobile}
                            placeholder="Phone"
                            editable={false}
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                        >
                        </TextInput>
                        <TextInput
                            style={{ height: 40, margin: 10, marginTop: 0, padding: 5, backgroundColor: "#f1f4f6", borderRadius: 10, }}
                            value={Designation}
                            placeholder="Gmail"
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                            onChangeText={text => setDesignation(text)}
                        >
                        </TextInput>
                    </View>
                </View>
                <TouchableOpacity style={MyPanelStyle.addPeopleBtn} onPress={() => closeModalEditProfile()} >
                    <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>
            </Modal>
            <Modal
                style={NoticeStyle.ImagemodalContainer}
                position={"center"}
                isOpen={modalForImage}
                backdropPressToClose={true}
                swipeToClose={false}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>
                    <View
                        style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => setmodalForImage(false)}
                            style={NoticeStyle.modalClose}>
                            <Image
                                resizeMode="contain"
                                style={NoticeStyle.closeImage}
                                source={require('../../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <CustomImagePicker
                    setfileList={setImageFileName}
                    fileList={image}
                    setprogressVisible={setprogressVisible}
                    setmodalForImage={setmodalForImage}
                    single={true}
                />
            </Modal>
        </View>
    )
}
export default MyPanel;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20, paddingTop: 0,

        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
});