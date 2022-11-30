import React from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet, ToastAndroid
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions";
import Modal from 'react-native-modalbox';
import { LiveTrackingStyle } from './LiveTrackingStyle';
import { DrawerContentStyle } from "../../../components/MenuDrawer/DrawerContentStyle"
import {
    GetMovementDetailsAll,
    GetMovementDetails
} from '../../../services/EmployeeTrackService';
import Iconic from 'react-native-vector-icons/Feather'
import { CommonStyles } from '../../../common/CommonStyles';
import { GetEmployeeWithCompanyId } from "../../../services/AccountService";
import { urlDev, urlResource } from '../../../Utils/config';
import { googlemapApiForAutoCheckPoint } from '../../../Utils/config';
import * as Location from 'expo-location';
import LocalStorage from '../../../common/LocalStorage';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import Searchbar from '../../../components/Searchbar';
import Header from '../../../components/Header';
import { useIsFocused } from '@react-navigation/native';
import { toggleActive } from '../../../Redux/Slices/UserSlice'
const { width, height } = Dimensions.get('window');


const LiveTracking = ({ navigation, route }) => {

    const [employeeList, setemployeeList] = useState([]);
    const [DepartmentName, setDepartmentName] = useState('');
    const [Designation, setDesignation] = useState('');
    const [EmployeeName, setEmployeeName] = useState('');
    const [UserId, setUserId] = useState('');
    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);
    const [LogLocation, setLogLocation] = useState('');
    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [EmpTrackList, setEmpTrackList] = useState([]);
    const [data, setdata] = useState([]);
    const [markers, setmarkers] = useState([]);
    const [slectedEmployeeId, setslectedEmployeeId] = useState(0);
    const [selctedEmployeeValue, setselctedEmployeeValue] = useState('All Employee');
    const [errorMessage, seterrorMessage] = useState('');
    const [companyId, setcompanyId] = useState(null);
    const [employeeModal, setemployeeModal] = useState(false);
    const [tempList, setTempList] = useState([]);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    let mapView = null;

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            await getEmpTrackInfo(selctedEmployeeValue, cId);
            await getEmpAllWithCompanyId(cId);
        })();
    }, [isFocused])


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
            const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude));
            const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude));
            setLatitude(currentLatitude);
            setLongitude(currentLongitude);
        });
    };

    const getEmpAllWithCompanyId = async (companyId) => {
        try {
            setprogressVisible(true);
            await GetEmployeeWithCompanyId(companyId)
                .then(res => {
                    console.log('EMp', res)
                    setemployeeList(res);
                    setTempList(res);
                    setprogressVisible(false);
                })
                .catch(() => {
                    setprogressVisible(false);
                    console.log("error occured");
                });
        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
    }
    const getEmpTrackInfo = async (selectedVal, cId) => {
        try {
            setmarkers([]);
            if (selectedVal === 'All Employee') {
                await GetMovementDetailsAll(cId)
                    .then(res => {
                        console.log('companyId', cId, 'GetMovementDetailsAll', res)
                        setEmpTrackList(res)
                        var markerlist = [];
                        if (!res?.success && res?.length > 0) {
                            res?.map((userData, index) => {
                                var title = '';
                                var color = '';
                                if (userData?.IsCheckInPoint) {
                                    title = "Checked In";
                                    color = 'green';
                                } else if (userData?.IsCheckOutPoint) {
                                    title = "Checked Out";
                                    color = 'red';
                                } else {
                                    title = "Checked point";
                                    color = 'yellow';
                                }
                                var newMarkerObj = {
                                    "title": userData?.UserName + " " + title + " " + (index + 1),
                                    "description": userData?.LogLocation,
                                    "color": color,
                                    coordinates: {
                                        "latitude": Number(userData?.Latitude),
                                        "longitude": Number(userData?.Longitude)
                                    },
                                }
                                markerlist.push(newMarkerObj);
                            });
                            setmarkers(markers.concat(markerlist))
                            setLongitude(Number(res[res?.length - 1]?.Longitude));
                            setLatitude(Number(res[res?.length - 1]?.Latitude));
                            setLogLocation(res[res?.length - 1]?.LogLocation);

                        } else {
                            _getLocationAsync();
                        }
                    })
                    .catch((ex) => {
                        console.log(ex, "GetMovementDetails error occured");
                    });
            } else {
                await GetMovementDetails(selectedVal?.UserId)
                    .then(res => {
                        console.log(selectedVal, 'GetMovementDetails', res)
                        setEmpTrackList(res);
                        var markerlist = [];
                        if (!res?.success && res?.length > 0) {
                            res?.map((userData, index) => {
                                var title = '';
                                var color = '';
                                if (userData?.IsCheckInPoint) {
                                    title = "Checked In";
                                    color = 'green';
                                } else if (userData?.IsCheckOutPoint) {
                                    title = "Checked Out";
                                    color = 'red';
                                } else {
                                    title = "Checked point";
                                    color = index === res?.length - 1 ? 'red' : 'yellow';
                                }
                                var newMarkerObj = {
                                    "title": title + " " + (index + 1),
                                    "description": userData?.LogLocation,
                                    "color": color,
                                    coordinates: {
                                        "latitude": Number(userData?.Latitude),
                                        "longitude": Number(userData?.Longitude)
                                    },
                                }
                                markerlist.push(newMarkerObj);

                            });
                            setmarkers(markers.concat(markerlist))
                            setLongitude(Number(res[res?.length - 1]?.Longitude));
                            setLatitude(Number(res[res?.length - 1]?.Latitude));
                            setLogLocation(res[res?.length - 1]?.LogLocation);
                        }
                    })
                    .catch((ex) => {
                        console.log(ex, "GetMovementDetails error occured");
                    });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const closeEmployeeModal = async (item) => {
        setemployeeModal(false);
        if (item?.UserName) {
            setslectedEmployeeId(item.UserId);
            setselctedEmployeeValue(item?.UserName);
            getEmpTrackInfo(item, companyId);
        } else {
            setselctedEmployeeValue(item);
            getEmpTrackInfo(item, companyId);
        }
    }
    const searchFilterFunction = text => {
        if (text !== '') {
            const newData = tempList?.filter(item => {
                const itemData = `${item.UserName.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setemployeeList(newData);
        } else {
            setemployeeList(tempList)
        }
    };


    const onReady = (result) => {
        mapView?.fitToCoordinates(result?.coordinates, {
            edgePadding: {
                right: (width / 20),
                bottom: (height / 20),
                left: (width / 20),
                top: (height / 20),
            }
        });
    }
    const onStart = (result) => {
        console.log('onstart', result);
    }
    const onError = (errorMessage) => {
        console.log(errorMessage);
    }

    const renderMapView = () => {
        return (
            <View style={{
                flexDirection: 'column'
            }}>
                <View style={{ margin: 10 }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{
                            height: (height * 95) / 100,
                        }}
                        ref={c => mapView = c}
                        loadingEnabled={true}
                        showsUserLocation={false}
                        followUserLocation={false}
                        zoomEnabled={true}
                        region={{
                            latitude: Latitude,
                            longitude: Longitude,
                            latitudeDelta: 0.0922,//0.001200,
                            longitudeDelta: 0.0922 * (width / height)//0.001200 * .60
                        }}

                    >
                        {markers?.map((marker, index) => (
                            <MapView.Marker
                                key={index}
                                tracksViewChanges={true}
                                tracksInfoWindowChanges={true}
                                pinColor={marker.color}
                                coordinate={marker.coordinates}
                                title={marker.title}
                                description={marker.description}
                            />
                        ))}
                        {(selctedEmployeeValue != "All Employee" && markers.length > 1) ?
                            <MapViewDirections
                                origin={markers[0]?.coordinates}
                                destination={markers[markers.length - 1]?.coordinates}
                                apikey={googlemapApiForAutoCheckPoint}
                                strokeWidth={4}
                                strokeColor="#43B6D5"
                                optimizeWaypoints={true}
                                onReady={onReady}
                                onError={onError}
                                onStart={onStart}
                            /> : null
                        }
                    </MapView>
                </View>
            </View>
        )
    }

    return (
        <View style={LiveTrackingStyle.container}>

            <Header
                onSelect={() => setemployeeModal(true)}
                selected={selctedEmployeeValue}
                onPress={() => { navigation.openDrawer(); }}
                onGoBack={() => { dispatch(toggleActive(1)); navigation.goBack() }}
            />
            {renderMapView()}
            <Modal style={{
                height: "85%",
                width: "100%",
                borderRadius: 10,
                backgroundColor: '#EBEBEB',
                marginTop: "10%"
            }}
                isOpen={employeeModal}
                position={"center"}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={{ padding: 10 }}>Employee Select</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setemployeeModal(false)} style={{
                            marginLeft: 0, marginTop: 0,
                        }}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingVertical: 20, }}>
                    <Searchbar searchFilterFunction={searchFilterFunction} />
                    <TouchableOpacity onPress={() => closeEmployeeModal('All Employee')}>
                        <View
                            style={LiveTrackingStyle.FlatlistMainView}>
                            <Text style={[LiveTrackingStyle.EmpText, { fontSize: 14 }]}>
                                All Employees
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <FlatList
                        data={employeeList}
                        keyExtractor={(x, i) => i.toString()}
                        style={{ height: '100%' }}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => closeEmployeeModal(item)}>
                                <View
                                    style={LiveTrackingStyle.FlatlistMainView}>
                                    <View style={{ paddingRight: 10, }}>
                                        {item.ImageFileName && item.ImageFileName !== 'null' ?
                                            (<Image style={LiveTrackingStyle.imageradious} resizeMode="contain" source={{ uri: urlResource + item.ImageFileName }} />) :
                                            (<Image style={
                                                LiveTrackingStyle.imageradious
                                            } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />)}

                                    </View>
                                    <View>
                                        <Text style={LiveTrackingStyle.EmpText}>
                                            {item.UserName}
                                        </Text>
                                        <Text style={LiveTrackingStyle.EmpText}>
                                            {item.Designation}
                                        </Text>
                                        <Text style={LiveTrackingStyle.EmpText}>
                                            {item.DepartmentName}
                                        </Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </Modal>
        </View>
    );
}

export default LiveTracking;

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
