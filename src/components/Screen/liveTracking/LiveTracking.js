import React from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions";
import Modal from 'react-native-modalbox';
import { LiveTrackingStyle } from './LiveTrackingStyle';
import { DrawerContentStyle } from "../../MenuDrawer/DrawerContentStyle"
import {
    GetMovementDetailsAll,
    GetMovementDetails
} from '../../../services/EmployeeTrackService';
import Iconic from 'react-native-vector-icons/Feather'
import { CommonStyles } from '../../../common/CommonStyles';
import { SearchBar } from 'react-native-elements';
import { GetEmployeeWithCompanyId } from "../../../services/AccountService";
import { urlDev, urlResource } from '../../../services/api/config';
import { googlemapApiForAutoCheckPoint } from '../../../services/api/config';
import * as Location from 'expo-location';
import LocalStorage from '../../../common/LocalStorage';
import { useState } from 'react';
import { useSelector } from "react-redux";
import { useEffect } from 'react';

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
    const [search, setsearch] = useState('');
    const [tempList, setTempList] = useState([]);

    let mapView = null;

    const user = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            await getEmpTrackInfo();
            await getEmpAllWithCompanyId(cId);
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [])

    const handleBackButton = () => {
        navigation.navigate('DailyAttendance');
        return true;
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
            const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude));
            const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude));
            setLatitude(currentLatitude);
            setLongitude(currentLongitude);
        });
        console.log("currentloc", Latitude, Longitude);
    };

    const getEmpAllWithCompanyId = async (companyId) => {
        try {
            setprogressVisible(true);
            await GetEmployeeWithCompanyId(companyId)
                .then(res => {
                    setemployeeList(res?.result);
                    setTempList(res?.result);
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
    const getEmpTrackInfo = async () => {
        try {
            setmarkers([]);
            if (selctedEmployeeValue === "All Employee") {
                await GetMovementDetailsAll(companyId)
                    .then(res => {
                        setEmpTrackList(res?.result)
                        var markerlist = [];
                        console.log('movement details', res.result)
                        if (res.result.length > 0) {
                            res.result.map((userData, index) => {
                                var title = '';
                                var color = '';
                                if (userData.IsCheckInPoint) {
                                    title = "Checked In";
                                    color = 'green';
                                } else if (userData.IsCheckOutPoint) {
                                    title = "Checked Out";
                                    color = 'red';
                                } else {
                                    title = "Checked point";
                                    color = 'yellow';
                                }
                                var newMarkerObj = {
                                    "title": userData.UserName + " " + title + " " + (index + 1),
                                    "description": userData.LogLocation,
                                    "color": color,
                                    coordinates: {
                                        "latitude": userData.Latitude,
                                        "longitude": userData.Longitude
                                    },
                                }
                                markerlist.push(newMarkerObj);
                            });
                            setmarkers(markers.concat(markerlist))
                            setLongitude(res.result[res.result.length - 1].Longitude);
                            setLatitude(res.result[res.result.length - 1].Latitude);
                            setLogLocation(res.result[res.result.length - 1].LogLocation);

                        } else {
                            _getLocationAsync();
                        }
                    })
                    .catch((ex) => {
                        console.log(ex, "GetMovementDetails error occured");
                    });
            } else {
                await GetMovementDetails(slectedEmployeeId)
                    .then(res => {
                        setEmpTrackList(res.result);
                        var markerlist = [];
                        console.log('movement details', res.result)
                        res.result.map((userData, index) => {
                            var title = '';
                            var color = '';
                            if (userData.IsCheckInPoint) {
                                title = "Checked In";
                                color = 'green';
                            } else if (userData.IsCheckOutPoint) {
                                title = "Checked Out";
                                color = 'red';
                            } else {
                                title = "Checked point";
                                color = index === res.result.length - 1 ? 'red' : 'yellow';
                            }
                            var newMarkerObj = {
                                "title": title + " " + (index + 1),
                                "description": userData.LogLocation,
                                "color": color,
                                coordinates: {
                                    "latitude": userData.Latitude,
                                    "longitude": userData.Longitude
                                },
                            }
                            markerlist.push(newMarkerObj);

                        });
                        setmarkers(markers.concat(markerlist))
                        setLongitude(res.result[res.result.length - 1].Longitude);
                        setLatitude(res.result[res.result.length - 1].Latitude);
                        setLogLocation(res.result[res.result.length - 1].LogLocation);
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


    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);

        }, 2000);
        getEmpTrackInfo();
    };

    const closeEmployeeModal = async (item) => {
        setemployeeModal(false);
        await setselctedEmployeeValue(item.UserName);
        await setslectedEmployeeId(item.UserId);
        getEmpTrackInfo();
    }
    const searchFilterFunction = text => {

        if (text != '') {
            const newData = tempList?.filter(item => {
                const itemData = `${item.UserName.toUpperCase()} ${item.DepartmentName.toUpperCase()} ${item.Designation.toUpperCase()}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setemployeeList(newData);
        } else {
            setemployeeList(tempList);
        }

    };
    const renderSearchHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                style={{ position: 'absolute', zIndex: 1, marginBottom: 0 }}
                lightTheme
                containerStyle={{ backgroundColor: '#f6f7f9', }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                round
                onChangeText={text => { setsearch(text); searchFilterFunction(text) }}
                autoCorrect={false}
                value={search}
            />

        );
    };

    const onReady = (result) => {
        mapView.fitToCoordinates(result.coordinates, {
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
        console.log('coor', markers)
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
                        {selctedEmployeeValue != "All Employee" && markers.length > 1 ?
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
                            flexDirection: 'row', justifyContent: "center", alignItems: "center"
                        }]}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}
                            onPress={() => setemployeeModal(true)}>
                            <Text
                                style={DrawerContentStyle.employeeModalTextStyle}>
                                {selctedEmployeeValue}

                            </Text>
                            <Iconic
                                name="chevrons-down" size={14} color="#d6d6d6"
                                style={DrawerContentStyle.employeeModalIconStyle}>
                            </Iconic>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
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
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: "100%" }}>
                        <View style={{ flex: 1, padding: 10, }}>
                            <FlatList
                                data={employeeList}
                                keyExtractor={(x, i) => i.toString()}
                                renderItem={({ item }) =>
                                    <TouchableOpacity onPress={() => closeEmployeeModal(item)}>
                                        <View
                                            style={LiveTrackingStyle.FlatlistMainView}>
                                            <View style={{ paddingRight: 10, }}>
                                                {item.ImageFileName !== "" ?
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
                                ListHeaderComponent={renderSearchHeader()}
                            />
                        </View>
                    </ScrollView>
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
