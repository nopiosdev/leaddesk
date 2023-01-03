import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modalbox';
import { googlemapApiForAutoCheckPoint } from '../../../Utils/config';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { MyPanelStyle } from './MyPanelStyle';
import { Platform, ScrollView, Text, View, Image, StatusBar, ActivityIndicator, ToastAndroid, RefreshControl, Alert, TextInput, TouchableOpacity, BackHandler, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
// import Geolocation from 'react-native-geolocation-service';
import { CheckIn, CheckOut, CheckPoint } from '../../../services/EmployeeService/EmployeeTrackService';
import { GetMovementDetails, GetMyTodayAttendance } from '../../../services/EmployeeTrackService';
import { getLocation } from '../../../services/LocationService'
import { UpdateEmployee } from '../../../services/AccountService'
import { NoticeStyle } from '../../AdminScreens/notice/NoticeStyle'
import { ConvertUtcToLocalTime } from '../../../common/commonFunction'
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { urlDev, urlResource } from '../../../Utils/config';
import { useDispatch, useSelector } from 'react-redux';
import LocalStorage from '../../../common/LocalStorage';
import CustomImagePicker from '../../../components/CustomImagePicker';
import CustomTimeLine from '../../../components/CustomTimeLine';
import { upLoadImage } from '../../../services/TaskService';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import moment, { isMoment } from 'moment';
import { toggleActive } from '../../../Redux/Slices/UserSlice';


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
        let { status2 } = await Location.requestBackgroundPermissionsAsync();
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
    const [ImageFileName, setImageFileName] = useState(null);
    const [mobile, setmobile] = useState('');
    const [Imageparam, setImageparam] = useState("resourcetracker");
    const [ImageFileId, setImageFileId] = useState(null);
    const [EmployeeId, setEmployeeId] = useState(null);
    const [EmployeeReason, setEmployeeReason] = useState('');
    const [data, setdata] = useState([]);
    const [pointcheck, setpointcheck] = useState('');
    const [fetchDate, setfetchDate] = useState(null);
    const [status, setstatus] = useState(null);
    const [isRegistered, setisRegistered] = useState(false);
    const [IsAutoCheckPoint, setIsAutoCheckPoint] = useState(false);
    const [AutoCheckPointTime, setAutoCheckPointTime] = useState('1:00:00');
    const [maximumOfficeHours, setMaximumOfficeHours] = useState('1:00:00');
    const user = useSelector((state) => state.user.currentUser);
    const [modalEditEmp, setmodalEditEmp] = useState(false);
    const [modalForImage, setmodalForImage] = useState(false);
    const [lessTimeReasonModal, setLessTimeReasonModal] = useState(false);
    const [successMessage, setsuccessMessage] = useState(null);
    const [error, seterror] = useState(null);
    const dispatch = useDispatch();


    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);
        getMyTodayAttendance();
    };



    const _takeSelfiePhoto = async (statusPoint, Latd, Logtd) => {
        await ImagePicker.getCameraPermissionsAsync()
        await ImagePicker.getMediaLibraryPermissionsAsync();
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            height: 250,
            width: 250,
            quality: 0.1
        });
        if (pickerResult.cancelled == false) {
            handleSelfiePhoto(pickerResult, statusPoint, Latd, Logtd)
        }
    };

    const handleSelfiePhoto = async (pickerResult, statusPoint, Latd, Logtd) => {
        setprogressVisible(true);
        let filename = pickerResult?.uri?.split('/')?.pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        var data = new FormData();
        data.append('thumb', {
            uri: pickerResult.uri,
            name: filename,
            type: type
        })
        upLoadImage(data)
            .then(response => {
                if (response?.success) {
                    setimage(response?.image)
                    _sendToServer(response?.image, statusPoint, Latd, Logtd)
                } else {
                    setprogressVisible(false);
                    ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
                }
            })
            .catch(error => {
                console.log("upload error", error);
                setprogressVisible(false);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
            });
    };

    const _sendToServer = async (fileId, statusPoint, Latd, Logtd) => {
        var loaction = await getLocation(Latd, Logtd);
        setLogLocation(loaction);
        console.log(loaction, 'getLocation', Latd, Logtd)
        if (statusPoint == "CheckIn") {
            createCheckingIn(fileId, Latd, Logtd, loaction);
        } else if (statusPoint == "CheckPoint") {
            createCheckPoint(Latd, Logtd, loaction);
        } else {
            createCheckOut(fileId, Latd, Logtd, loaction);
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
        console.log('ImageFileName', ImageFileName, 'ImageFileId', ImageFileId)
        var data = new FormData();
        data.append('UserFullName', EmployeeName);
        data.append('EmployeeCode', EmployeeCode);
        data.append('Designation', Designation);
        data.append('Id', EmployeeId);
        data.append('ImageFileName', ImageFileName);
        data.append('ImageFileId', ImageFileId);
        data.append('AutoCheckPointTime', AutoCheckPointTime);
        data.append('IsAutoCheckPoint', IsAutoCheckPoint);
        data.append('IsActive', 1);
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
            setEmployeeName(user?.UserFullName);
            setmobile(user?.PhoneNumber);
            //setgmail(user?.Email);
            setCompanyId(comId);
            getMyTodayAttendance();
        })();

        return () => {
            ClearInterval();
        }
    }, [])

    // const SetInterval = () => {
    //     var t = getMinute(AutoCheckPointTime);
    //     interval = setInterval(() =>
    //         getAutoLocation()
    //         , 1000 * (t * 60));
    // }
    // const getAutoLocation = async () => {
    //     setpointcheck("CheckPoint");
    //     if (IsCheckedIn === 1 && IsCheckedOut !== 1) getLocationInfo();
    //     console.log('I do not leak!', new Date());
    // }

    const ClearInterval = () => {
        clearInterval(interval);
    }

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
                    if (res?.AutoCheckPointTime) { setAutoCheckPointTime(res?.AutoCheckPointTime); }
                    setStatus(res?.Status);
                    setEmployeeId(res?.EmployeeId);
                    setImageFileName(res?.ImageFileName);
                    setMaximumOfficeHours(res?.MaximumOfficeHours);
                }
            }).catch(() => {
                console.log("GetMyTodayAttendance error occured");
            });
        await GetMovementDetails(user?.Id)
            .then(res => {
                console.log('GetMovementDetails', res)
                setdata([]);
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
                        let temp = ConvertUtcToLocalTime(userData?.LogDateTime)
                        var myObj = {
                            "time": moment(temp, 'h:mm A').format('hh:mm A'),
                            "title": title,
                            "description": userData?.LogLocation,
                            "circleColor": color
                        };
                        tempData.push(myObj);
                    })
                    setdata(tempData);
                }
            }).catch((error) => {
                console.log("GetMovementDetails error occured", error);
            });
        setprogressVisible(false);
    }

    const getLocationInfo = async (statusPoint) => {
        var that = this;
        //Checking for the permission just after component loaded
        // if (Platform.OS === 'android' && !Constants.isDevice) {
        //     ToastAndroid.show('Oops, this will not work on Sketch in an Android emulator. Try it on your device!', ToastAndroid.TOP);
        //     setprogressVisible(false)
        // } else {
        await _getLocationAsync(statusPoint);
        // }
    }


    const _getLocationAsync = async (statusPoint) => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let { status2 } = await Location.requestBackgroundPermissionsAsync();
        if (status !== 'granted') {
            ToastAndroid.show('Permission to access location was denied', ToastAndroid.TOP);
        }
        await Location.getCurrentPositionAsync({
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 0,
            distanceFilter: 10
        }).then((position) => {
            console.log(' positions', position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            setLatitude(currentLatitude);
            setLongitude(currentLongitude);
            if (statusPoint == "CheckPoint") {
                _sendCheckpointToServer(currentLatitude, currentLongitude);
            } else {
                setprogressVisible(false);
                _takeSelfiePhoto(statusPoint, currentLatitude, currentLongitude);
            }
        });
    };

    const _sendCheckpointToServer = async (currentLatitude, currentLongitude) => {
        setprogressVisible(true);
        var location = await getLocation(currentLatitude, currentLongitude);
        setLogLocation(location);
        createCheckPoint(currentLatitude, currentLongitude, location);
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

    const createCheckingIn = async (fileId, Latd, Logtd, loaction) => {
        try {
            var data = new FormData();
            data.append('Latitude', Latd);
            data.append('Longitude', Logtd);
            data.append('userId', user?.Id);
            data.append('LogLocation', loaction);
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

    const createCheckPoint = async (Latd, Logtd, loaction) => {
        try {
            setprogressVisible(true);

            var data = new FormData();
            data.append('Latitude', Latd);
            data.append('Longitude', Logtd);
            data.append('userId', user?.Id);
            data.append('LogLocation', loaction);
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
    const createCheckOut = async (fileId, Latd, Logtd, loaction) => {
        try {
            console.log('createCheckOutDATA', fileId, Latd, Logtd, loaction)
            setLessTimeReasonModal(false);
            setprogressVisible(true);
            setEmployeeReason("");
            var data = new FormData();
            data.append('Latitude', Latd);
            data.append('Longitude', Logtd);
            data.append('userId', user?.Id);
            data.append('LogLocation', loaction);
            data.append('DeviceName', '');
            data.append('DeviceOSVersion', DeviceOSVersion);
            data.append('companyId', CompanyId);
            data.append('CheckOutTimeFile', fileId);
            data.append('LessTimeReason', EmployeeReason);

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
        if (IsCheckedOut !== 1) {
            if (IsCheckedIn !== 1) {
                await getLocationInfo('CheckIn');
            }
            else {
                ToastAndroid.show('You have already checked in today', ToastAndroid.TOP);
                settouchabledisablepointcheckin(false);
            }
        } else {
            ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
            settouchabledisablepointcheckin(false);
        }
    }
    const getCheckOut = async () => {
        settouchabledisablepointcheckout(true);
        settouchabledisable(true);
        setprogressVisible(true);

        if (IsCheckedOut !== 1) {
            if (IsCheckedIn === 1 && IsCheckedOut !== 1) {
                if (EmployeeReason == "" && moment(OfficeStayHour, "hh:mm").isBefore(moment(maximumOfficeHours, "hh:mm"))) {
                    setprogressVisible(false);
                    setLessTimeReasonModal(true);
                    return false;
                } 
                setEmployeeReason("");
                setLessTimeReasonModal(false);
                await getLocationInfo('CheckOut');
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
        settouchabledisablepoint(true);
        settouchabledisable(true);
        setprogressVisible(true);

        if (IsCheckedOut === 1) {
            setprogressVisible(false);
            settouchabledisablepoint(false);
            return ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
        }
        if (IsCheckedIn === 1 && IsCheckedOut !== 1) {
            await getLocationInfo('CheckPoint');
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
                onGoBack={() => { dispatch(toggleActive(1)); navigation.goBack(); }}
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
                                {ImageFileName && ImageFileName !== 'null' && ImageFileName !== 'undefined' ? (
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
                                    } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />)
                                }
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
                                        source={require('../../../../assets/images/editprofie.png')}
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
                            onPress={() => getCheckIn()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../assets/images/checkin.png')}
                                style={MyPanelStyle.ButtonImage}>
                            </Image>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => getCheckPoint()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../assets/images/checkpoint.png')}
                                style={MyPanelStyle.ButtonImage}>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => getCheckOut()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../assets/images/checkout.png')}
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
                                source={require('../../../../assets/images/goal.png')}>
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
            <Modal style={[MyPanelStyle.modalForLessTimeReason]} position={"center"} isOpen={lessTimeReasonModal}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={MyPanelStyle.modelContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        Please give reason for checking out too early.
                    </Text>
                    <View style={{ width: "100%" }}>
                        <TextInput
                            style={{ height: 60, margin: 0, marginTop: 10, padding: 5, paddingHorizontal: 15, backgroundColor: "#f7f7f7", borderRadius: 10, }}
                            value={EmployeeReason}
                            placeholder="Reason"
                            placeholderTextColor="darkgrey"
                            autoCapitalize="none"
                            onChangeText={text => setEmployeeReason(text)}
                            multiline={true}
                        >
                        </TextInput>
                    </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <TouchableOpacity style={MyPanelStyle.addPeopleBtn} onPress={() => { 
                        if(EmployeeReason.trim() != ""){
                            getCheckOut()
                        } else {
                            ToastAndroid.show('Please specify a reason to checkout', ToastAndroid.TOP);
                        }
                    }} >
                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Checkout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={MyPanelStyle.closeReasonPopup} onPress={() => { 
                        setEmployeeReason("");
                        setLessTimeReasonModal(false);
                    }} >
                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


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
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={MyPanelStyle.modelContent}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                            EDIT PROFILE
                        </Text>
                        {(ImageFileName && ImageFileName !== 'null') ?
                            <Image style={{
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
                            }} resizeMode='cover' source={{ uri: urlResource + ImageFileName }} />
                            :
                            <Image style={{
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
                            }} resizeMode='contain' source={require('../../../../assets/images/employee.png')} />
                        }

                    </View>

                    <View style={{
                        marginTop: -60,
                        marginLeft: "27%",
                    }}>
                        <TouchableOpacity onPress={() => openmodalForImage()}>
                            <Image resizeMode="contain" style={{
                                width: 40,
                                height: 40,

                            }} source={require('../../../../assets/images/photo_camera.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    {progressVisible == true ?
                        (<ActivityIndicator size="large" color="#1B7F67"
                            style={MyPanelStyle.loaderIndicator} />) : null}
                    <View style={{ width: "100%" }}>
                        <TextInput
                            style={{ height: 40, margin: 15, padding: 5, backgroundColor: "#f1f4f6", borderRadius: 10, }}
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
                            placeholder="Email"
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                            onChangeText={text => setDesignation(text)}
                            onSubmitEditing={() => closeModalEditProfile()}
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
                                source={require('../../../../assets/images/close.png')}>
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