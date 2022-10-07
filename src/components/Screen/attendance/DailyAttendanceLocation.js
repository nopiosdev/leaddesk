import React, { useEffect } from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Timeline from 'react-native-timeline-flatlist'
import * as actions from '../../../common/actions';
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import {
    GetMyTodayAttendance,
    GetMovementDetails
} from '../../../services/EmployeeTrackService';

import { CommonStyles } from '../../../common/CommonStyles';

import call from 'react-native-phone-call'
import { useState } from 'react';
import { useSelector,useDispatch } from "react-redux";
import { updateUserEmployee } from '../../../Redux/Slices/UserSlice';
import { useIsFocused } from '@react-navigation/native';


const DailyAttendanceLocation =({navigation})=> {

    const [DepartmentName, setDepartmentName] = useState('');
    const [Designation, setDesignation] = useState('');
    const [EmployeeName, setEmployeeName] = useState('');
    const [UserId, setUserId] = useState('');
    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);
    const [LogLocation, setLogLocation] = useState('');
    const [EmpTrackList, setEmpTrackList] = useState([]);
    const [data, setdata] = useState([]);
    const [markers, setmarkers] = useState([]);
    const [refreshing, setrefreshing] = useState(false);
    const [svgLinHeight, setsvgLinHeight] = useState(null);
    const user = useSelector((state) => state.user.currentUser);
    const dispatch=useDispatch();
    const clientId = useSelector((state) => state.user.clientId);
    const isFocused = useIsFocused();
    
    const Call = () => {
        //handler to make a call
        const args = {
            number: user.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }

    useEffect(() => {
        (async()=>{
        getEmpTrackInfo();
        getEmpInfo();
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    })();
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      }
    }, [isFocused])
    

    const handleBackButton = () => {
        navigation.navigate('DailyAttendance');
        return true;
    }
    console.log('clientId',clientId)
    const getEmpTrackInfo = async () => {
        try {
            await GetMovementDetails(clientId)
                .then(res => {
                    setEmpTrackList(res)
                    console.log('movement details', res)
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
                            "time": userData.LogTimeVw,
                            "title": title,
                            "description": userData.LogLocation,
                            "circleColor": color
                        };
                        var newMarkerObj = {
                            "title": title + " " + (index + 1),
                            "description": userData.LogLocation,
                            coordinates: {
                                "latitude":Number(userData.Latitude),
                                "longitude": Number(userData.Longitude)
                            },
                        }
                        // setmarkers([...markers,...newMarkerObj])
                        setmarkers([newMarkerObj])
                    });
                    console.log('Lat',res[res?.length - 1])

                    setLongitude(Number(res[res?.length - 1]?.Longitude));
                    setLatitude(Number(res[res?.length - 1]?.Latitude));
                    setLogLocation(res[res?.length - 1]?.LogLocation);
                    const tcount = 60 * res?.length - 60;
                    setsvgLinHeight(tcount === 0 ? 60 : tcount);
                })
                .catch((ex) => {
                    console.log(ex, "GetMovementDetails error occured");
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    const goBack=()=> {
         navigation.navigate('DailyAttendance');
    };

    const getEmpInfo = async () => {
        try {

            await GetMyTodayAttendance(clientId)
                .then(res => {
                    console.log(res, "getEmpInfo");
                    
                    setEmployeeName(res?.EmployeeName);
                    setDepartmentName(res?.DepartmentName);
                    setDesignation(res?.Designation);
                    dispatch(updateUserEmployee(res?.EmployeeName));
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
    const renderItem = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 0, height: 45 }}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ color: '#313131' }}>
                        {item.LogTimeVw}
                    </Text>
                </View>
                <Text style={{
                    marginLeft: 5, color: '#7d7d7d',
                    fontFamily: 'PRODUCT_SANS_REGULAR', width: 240,
                    textAlign: 'justify'
                }}>
                    Checked In at {item.LogLocation}
                </Text>
            </View>
        );
    }
    const renderMapView = () => {
        var { width, height } = Dimensions.get('window');
        return (
            <View style={{
                flexDirection: 'column'
            }}>
                <View style={{ margin: 10 }}>
                    <MapView

                        provider={PROVIDER_GOOGLE}
                        style={{
                            height: (height * 80) / 100,
                        }}
                        showsUserLocation={true}
                        followUserLocation={true}
                        zoomEnabled={true}
                        region={{
                            latitude: Latitude,
                            longitude: Longitude,
                            latitudeDelta: 0.001200,
                            longitudeDelta: 0.001200 * .60
                        }}

                    >
                        {markers?.map((marker,i) => (
                            <MapView.Marker
                                coordinate={marker?.coordinates}
                                title={marker?.title}
                                description={marker?.description}
                                key={i.toString()+"_"}
                            />
                        ))}
                        <MapView.Marker coordinate={{
                            latitude: Latitude,
                            longitude: Longitude,
                        }} title={EmployeeName + " Last Location"} description={LogLocation} />
                    </MapView>
                </View>
            </View>
        )
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
                            onPress={Call}
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
                {renderMapView()}
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

export default  DailyAttendanceLocation;


