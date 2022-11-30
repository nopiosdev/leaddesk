import React, { useState, useEffect } from 'react';
import { RefreshControl, TouchableOpacity, View, Text, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { GetAdminLeaveList, LeaveApproved, LeaveRejected } from '../../../services/Leave';
import { LeaveListAdminStyle, LeaveListStyle } from './LeaveListStyle';
import { useDispatch, useSelector } from 'react-redux';
import LocalStorage from '../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import Searchbar from '../../../components/Searchbar';
import LeaveBox from '../../../components/LeaveBox';
import { GetLeaveList } from '../../../services/EmployeeService/Leave';
import Header from '../../../components/Header';
import { toggleActive } from '../../../Redux/Slices/UserSlice';


const LeaveList = ({ navigation, route }) => {

    const user = useSelector((state) => state.user.currentUser);
    const [leaveList, setleaveList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [companyId, setcompanyId] = useState(null);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

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
                await GetAdminLeaveList(companyId)
                    .then(res => {
                        console.log(companyId, 'adminGetLeaveList', res)
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

            <View style={(user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle)?.container}>
                <Header
                    title={user?.UserType === 'admin' ? 'Leave Requests' : 'Leave List'}
                    onPress={() => { navigation.openDrawer() }}
                    btnAction={user?.UserType === 'admin' ? null : () => navigation.navigate('LeaveApply')}
                    btnTitle='LEAVE'
                    btnContainerStyle={(user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle)?.ApplyTextButton}
                    btnStyle={(user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle)?.plusButton}
                    onGoBack={() => { dispatch(toggleActive(1)); navigation.goBack() }}
                />
                <View style={{ flex: 1, }}>
                    {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={(user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle)?.loaderIndicator} />) :
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
                                        styles={user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle}
                                    />
                                }
                                ListHeaderComponent={<Searchbar searchFilterFunction={searchFilterFunction} />}
                            />
                        </View>
                    }
                </View>
            </View>
        </>
    );
}
export default LeaveList;