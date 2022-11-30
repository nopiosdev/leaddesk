import React, { useEffect, useState } from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import {
    GetMyTodayAttendance,
    GetMovementDetails
} from '../../../services/EmployeeTrackService';

import { CommonStyles } from '../../../common/CommonStyles';
import { ConvertUtcToLocalTime } from '../../../common/commonFunction';
import LocalStorage from '../../../common/LocalStorage';
import call from 'react-native-phone-call'
import { useSelector, useDispatch } from "react-redux";
import { setSelectedEmployee, updateUserEmployee, updateUserPhone } from '../../../Redux/Slices/UserSlice';
import { useIsFocused } from '@react-navigation/native';
import CustomTimeLine from '../../../components/CustomTimeLine';
import Header from '../../../components/Header';
import EmptyScreen from '../../../components/EmptyScreen';
import { Feather } from '@expo/vector-icons';



const DailyAttendanceDetails = ({ navigation, route }) => {

    const [DepartmentName, setDepartmentName] = useState('');
    const [Designation, setDesignation] = useState('');
    const [EmployeeName, setEmployeeName] = useState('');
    const [UserId, setUserId] = useState('');
    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);
    const [LogLocation, setLogLocation] = useState('');
    const [EmpTrackList, setEmpTrackList] = useState([]);
    const [data, setdata] = useState([]);
    const [aItemUserId, setaItemUserId] = useState('');
    const [refreshing, setrefreshing] = useState(true);
    const userDetails = useSelector((state) => state.user.currentUser);
    const user = useSelector((state) => state.user.currentUser);
    const selectedEmp = useSelector((state) => state.user.selectedEmp);
    const isFocused = useIsFocused();

    const dispatch = useDispatch();
    const makeCall = () => {
        //handler to make a call
        const args = {
            number: selectedEmp?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }


    useEffect(() => {
        (async () => {
            await getEmpTrackInfo();
            await getEmpInfo();
            // dispatch(updateUserPhone(paramsData?.aItem?.PhoneNumber))
            // BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })()
        // return () => {
        //     BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        // }
    }, [isFocused])


    const handleBackButton = () => {
        navigation.navigate('DailyAttendance');
        return true;
    }

    const getEmpTrackInfo = async () => {
        setrefreshing(true);
        try {
            await GetMovementDetails(selectedEmp?.UserId)
                .then(res => {
                    console.log("getEmpTrackInfo", res);
                    setdata([]);
                    if (!res?.success && res?.success !== false) {
                        setEmpTrackList(res);
                        let tempData = [];
                        res?.map((userData, index) => {
                            var title = '';
                            var color = '';
                            if (userData.IsCheckInPoint) {
                                title = "Checked In";
                                color = "green"
                            } else if (userData.IsCheckOutPoint) {
                                title = "Checked Out";
                                color = "red"
                            } else {
                                title = "Checked point";
                                color = "gray"
                            }
                            var myObj = {
                                "time": ConvertUtcToLocalTime(userData.LogDateTime),
                                "title": title,
                                "description": userData.LogLocation,
                                "circleColor": color
                            };
                            tempData.push(myObj);
                        });
                        setdata(tempData);
                        setLongitude(res[res?.length - 1]?.Longitude);
                        setLatitude(res[res?.length - 1]?.Latitude);
                        setLogLocation(res[res?.length - 1]?.LogLocation);
                    }
                })
                .catch((ex) => {
                    console.log(ex, "GetMovementDetails error occured");
                });
        }
        catch (error) {
            console.log(error);
        }
        setrefreshing(false);
    }

    const goBack = () => {
        // navigation.navigate('DailyAttendance')
    };

    const getEmpInfo = async () => {
        try {

            await GetMyTodayAttendance(selectedEmp?.UserId)
                .then(res => {
                    console.log("getEmpInfo", res);
                    setEmployeeName(res?.EmployeeName);
                    setDepartmentName(res?.DepartmentName);
                    setDesignation(res?.Designation);
                    // dispatch(updateUserEmployee(res?.EmployeeName))
                })
                .catch(() => {
                    console.log("error occured");
                });

        } catch (error) {
            console.log(error);
        }
    }
    const onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);
        getEmpTrackInfo();
    };
    const renderTrackList = () => {
        return <CustomTimeLine data={data} />
    }

    return (
        <View style={DailyAttendanceStyle.container}>
            <Header
                title={EmployeeName}
                navigation={navigation}
                goBack={true}
                onPress={() => { navigation.goBack() }}
                makeCall={makeCall}
            />
            {!refreshing ? data?.length > 0 ?
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                    <View style={{ flexDirection: 'column', backgroundColor: '#f5f7f9' }}>
                        <View style={{ backgroundColor: '#ffffff' }}>
                            <View style={{ flexDirection: 'column' }}>
                                {renderTrackList()}
                            </View>
                        </View>
                    </View>
                </ScrollView >
                :
                <EmptyScreen
                    title={"This employee has no activity!"}
                    description="This section will list the activities made for this employee."
                    icon={<Feather color="purple" name="activity" size={Dimensions.get('window').width * 0.3} />}
                />
                : <ActivityIndicator />}
        </View >
    );
}




export default DailyAttendanceDetails;


