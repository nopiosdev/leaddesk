import React, { useEffect,useState } from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet,
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
import { useSelector,useDispatch } from "react-redux";
import { setClientId, updateUserEmployee, updateUserPhone } from '../../../Redux/Slices/UserSlice';
import { useIsFocused } from '@react-navigation/native';



const DailyAttendanceDetails =({navigation,route})=> {

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
    const [refreshing, setrefreshing] = useState(false);
    const userDetails = useSelector((state) => state.user.currentUser);
    const paramsData=route?.params;
    const user = useSelector((state) => state.user.currentUser);
    const clientId = useSelector((state) => state.user.clientId);
    const isFocused = useIsFocused();

    const dispatch=useDispatch();
    const makeCall=()=>{
        //handler to make a call
        const args = {
            number: user?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }


    useEffect(() => {
        (async()=>{
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
console.log('paramsData',paramsData)
    const getEmpTrackInfo = async () => {
        try {
            console.log("getEmpTrackInfo", user?.Id);
            await GetMovementDetails(paramsData?.aItem?.UserId)
                .then(res => {      
                    console.log(res.result)            
                    setEmpTrackList(res.result);
                    res?.result?.map((userData, index) => {
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
                            "description":  userData.LogLocation,
                            "circleColor": color
                        };
                        setdata([...data,...myObj]);
                    });                    
                    setLongitude(res?.result[res?.result?.length - 1]?.Longitude);
                    setLatitude(res?.result[res?.result?.length - 1]?.Latitude);
                    setLogLocation(res?.result[res?.result?.length - 1]?.LogLocation);
                })
                .catch((ex) => {
                    console.log(ex, "GetMovementDetails error occured");
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    const goBack = () => {       
        navigation.navigate('DailyAttendance')
    };

    const getEmpInfo = async () => {
        try {

            await GetMyTodayAttendance(clientId)
                .then(res => {
                    console.log("getEmpInfo",user?.Id);
                    setEmployeeName(res?.result?.EmployeeName);
                    setDepartmentName(res?.result?.DepartmentName);
                    setDesignation(res?.result?.Designation);
                    // global.aItemEmployeeName = res.result.EmployeeName;
                    dispatch(updateUserEmployee(res?.result?.EmployeeName))
                })
                .catch(() => {
                    console.log("error occured");
                });

        } catch (error) {
            console.log(error);
        }
    }
    const _onRefresh = async () => {
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
             
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
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
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={()=>makeCall()}
                            style={{
                                padding: 8, paddingVertical: 2,

                            }}>
                            <Image style={{ width: 20, height: 20, alignItems: 'center', marginTop: 5, }}
                                resizeMode='contain'
                                source={require('../../../../assets/images/call.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>


                <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
                <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#f5f7f9',
                    }}>
                    <View style={{ backgroundColor: '#ffffff' }}>
                        <View style={{ flexDirection: 'column' }}>
                            {renderTrackList()}
                            {data.length>0?renderTrackList():<View><Text>No Activities Found to show</Text></View>}
                        </View>
                    </View>
                </View>
            </ScrollView>
         
            </View>
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


