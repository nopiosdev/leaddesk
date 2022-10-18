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
import { setClientId, updateUserEmployee, updateUserPhone } from '../../../Redux/Slices/UserSlice';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../Header';



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
    const paramsData = route?.params;
    const user = useSelector((state) => state.user.currentUser);
    const clientId = useSelector((state) => state.user.clientId);
    const isFocused = useIsFocused();

    const dispatch = useDispatch();
    const makeCall = () => {
        //handler to make a call
        const args = {
            number: user?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }


    useEffect(() => {
        (async () => {
            dispatch(setClientId(paramsData?.aItem?.UserId));
            await getEmpTrackInfo();
            await getEmpInfo();
            dispatch(updateUserPhone(paramsData?.aItem?.PhoneNumber))
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })()
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [isFocused])


    const handleBackButton = () => {
        navigation.navigate('DailyAttendance');
        return true;
    }

    const getEmpTrackInfo = async () => {
        setrefreshing(true);
        try {
            await GetMovementDetails(paramsData?.aItem?.UserId)
                .then(res => {
                    console.log("getEmpTrackInfo", res);
                    if (!res?.success && res?.success !== false) {
                        setEmpTrackList(res);
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
                            setdata([myObj]);
                        });
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
        navigation.navigate('DailyAttendance')
    };

    const getEmpInfo = async () => {
        try {

            await GetMyTodayAttendance(clientId)
                .then(res => {
                    console.log("getEmpInfo", res);
                    setEmployeeName(res?.EmployeeName);
                    setDepartmentName(res?.DepartmentName);
                    setDesignation(res?.Designation);
                    dispatch(updateUserEmployee(res?.EmployeeName))
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
        return (
            <View style={styles.container}>
                <Timeline
                    style={styles.list}
                    data={data}
                    circleSize={20}
                    circleColor={"circleColor"}
                    lineColor='rgb(45,156,219)'
                    timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                    timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13, marginTop: 5, }}
                    descriptionStyle={{ color: 'gray' }}
                    options={{
                        style: { paddingTop: 5 }
                    }}
                    innerCircle={'dot'}
                />
            </View>
        );
    }

    return (
        <View style={DailyAttendanceStyle.container}>

                     <Header
                        title={EmployeeName}
                        navigation={navigation}
                        goBack={true}
                        onPress={() => { goBack() }}
                        makeCall={makeCall}
                    />
                {/* <View
                    style={CommonStyles.HeaderFirstView}>
                    <TouchableOpacity
                        style={CommonStyles.HeaderMenuicon}
                        onPress={() => { goBack() }}>
                        <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                            source={require('../../../../assets/images/left_arrow.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={CommonStyles.HeaderTextView}>
                        <Text
                            style={CommonStyles.HeaderTextstyle}>
                            {EmployeeName}

                        </Text>
                    </View>
                </View>
                 */}


            <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                <View
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#f5f7f9',
                    }}>
                    <View style={{ backgroundColor: '#ffffff' }}>
                        <View style={{ flexDirection: 'column' }}>
                            {!refreshing ? data?.length > 0 ? renderTrackList() : <View style={{ width: '100%', padding: 10 }}><Text style={{ textAlign: 'center' }}>No Activities Found!</Text></View> : <ActivityIndicator />}
                        </View>
                    </View>
                </View>
            </ScrollView>

        </View >
    );
}


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

export default DailyAttendanceDetails;


