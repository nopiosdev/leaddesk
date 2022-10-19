import React, { useState, useEffect } from 'react';
import { RefreshControl, TouchableOpacity, View, Text, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { LeaveApproved, LeaveRejected } from '../../../services/Leave';
import { LeaveListStyle } from '../UserScreen/leaves/LeaveListStyle';
import { CommonStyles } from '../../../common/CommonStyles';
import { useSelector } from 'react-redux';
import LocalStorage from '../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../Loader';
import Searchbar from '../../Searchbar';
import LeaveBox from '../../LeaveBox';
import { GetLeaveList } from '../../../services/UserService/Leave';
import { FontAwesome } from '@expo/vector-icons';


const LeaveList = ({ navigation, route }) => {

    const user = useSelector((state) => state.user.currentUser);
    const [leaveList, setleaveList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [companyId, setcompanyId] = useState(null);
    const [search, setSearch] = useState('');
    const isFocused = useIsFocused();


    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
            setcompanyId(0);
        }, 2000);

        getLeaveList(companyId, false);
    };

    const searchFilterFunction = text => {
        if (text !== '') {
            const newData = tempList?.filter(item => {
                const itemData = `${item.EmployeeName.toUpperCase()} ${item.EmployeeName.toUpperCase()} ${item.EmployeeName.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setleaveList(newData);
        } else {
            setleaveList(tempList);
        }
    };

    useEffect(() => {
        (async () => {
            setIsLoaded(false);
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId)
            getLeaveList(cId, true);
            setIsLoaded(true);
        })();
    }, [isFocused])

    const getLeaveList = async (companyId, isProgress) => {
        try {
            setprogressVisible(isProgress);
            if (user.UserType == 'admin') {
                await GetLeaveList(companyId)
                    .then(res => {
                        console.log('GetLeaveList', res)
                        setleaveList(res);
                        setTempList(res);
                        setprogressVisible(false);
                    })
                    .catch(() => {
                        setprogressVisible(false);
                        console.log("error occured");
                    });
            } else {
                await GetLeaveList(user?.Id)
                    .then(res => {
                        console.log('GetLeaveList', res)
                        setleaveList(res);
                        setTempList(res);
                        setprogressVisible(false);
                    })
                    .catch(() => {
                        setprogressVisible(false);
                        console.log("error occured");
                    });
            }

        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
    }

    const leaveApprove = async (item) => {
        await LeaveApproved(item.Id, user?.Id)
            .then(res => {
                getLeaveList(companyId, true);
            })
            .catch(() => {
                setprogressVisible(false);
                console.log("error occured");
            });
    }

    const leaveReject = async (item) => {
        await LeaveRejected(item.Id)
            .then(res => {
                getLeaveList(companyId, true);
            })
            .catch(() => {
                setprogressVisible(false);
                console.log("error occured");
            });
    }

    return (
        <>
            {
            // isLoaded ?
                <View style={LeaveListStyle.container}>
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
                                style={CommonStyles.HeaderTextView}>
                                <Text
                                    style={CommonStyles.HeaderTextstyle}>
                                    LEAVE REQUESTS
                                </Text>
                            </View>
                        </View>
                        <View style={LeaveListStyle.ApplyButtonContainer}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('LeaveApply')}
                                style={LeaveListStyle.ApplyButtonTouch}>
                                <View style={LeaveListStyle.plusButton}>
                                    <FontAwesome
                                        name="plus" size={Platform.OS === 'ios' ? 16.6 : 18} color="#ffffff">
                                    </FontAwesome>
                                </View>
                                <View style={LeaveListStyle.ApplyTextButton}>
                                    <Text style={LeaveListStyle.ApplyButtonText}>
                                        LEAVE
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1, }}>

                        {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={LeaveListStyle.loaderIndicator} />) :
                            <View style={{ flex: 1, }}>

                                <FlatList
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={_onRefresh}
                                        />
                                    }
                                    data={leaveList}
                                    keyExtractor={(x, i) => i.toString()}
                                    renderItem={({ item }) =>
                                        <LeaveBox
                                            item={item}
                                            onApprove={() => leaveApprove(item)}
                                            onReject={() => leaveReject(item)}
                                        />
                                    }
                                    ListHeaderComponent={<Searchbar searchFilterFunction={searchFilterFunction} />}
                                />
                            </View>
                        }
                    </View>
                </View> 
                // :
                // <Loader />
            }
        </>
    );
}
export default LeaveList;