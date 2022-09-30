import React, { useEffect, useState } from 'react';

import {
    Platform, RefreshControl,
    TouchableOpacity, View, Text, FlatList, Image, ScrollView,
    ActivityIndicator, BackHandler,
} from 'react-native';
import { DailyAttendanceCombo } from '../../../MenuDrawer/DrawerContent';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { GetLeaveList } from '../../../../services/UserService/Leave';
import { LeaveListStyle } from './LeaveListStyle';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { toggleActive } from '../../../../Redux/Slices/UserSlice';


const LeaveList = ({ navigation, route }) => {

    const user = useSelector((state) => state.user.currentUser);
    const [leaveList, setleaveList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();


    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getLeaveList(false);
    };
    const goBack = () => {
        DailyAttendanceCombo();
    }

    useEffect(() => {
        getLeaveList(true);
        dispatch(toggleActive(4))
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [isFocused])

    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    const getLeaveList = async (isProgress) => {
        try {
            setprogressVisible(isProgress);
            await GetLeaveList(user?.Id)
                .then(res => {
                    setleaveList(res?.result);
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

    return (
        <View style={LeaveListStyle.container}>
            <View
                style={LeaveListStyle.HeaderContent}>
                <View
                    style={LeaveListStyle.HeaderFirstView}>
                    <TouchableOpacity
                        style={LeaveListStyle.HeaderMenuicon}
                        onPress={() => { navigation.openDrawer(); }}>
                        <Image resizeMode="contain" style={LeaveListStyle.HeaderMenuiconstyle}
                            source={require('../../../../../assets/images/menu_b.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={LeaveListStyle.HeaderTextView}>
                        <Text
                            style={LeaveListStyle.HeaderTextstyle}>
                            LEAVE LIST
                        </Text>
                    </View>
                </View>
                <View
                    style={LeaveListStyle.ApplyButtonContainer}>
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

            <View style={{ flex: 1, marginTop: 5, }}>

                {progressVisible == true ? (<ActivityIndicator size="large"
                    color="#1B7F67" style={LeaveListStyle.loaderIndicator} />) :

                    // <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                    //     <RefreshControl
                    //         refreshing={refreshing}
                    //         onRefresh={_onRefresh}
                    //     />
                    // }>
                    <View style={{
                        flex: 1,
                        // padding: 10, 
                    }}>

                        <FlatList
                            data={leaveList}
                            keyExtractor={(x, i) => i.toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={_onRefresh}
                                />
                            }
                            renderItem={({ item }) =>
                                <View
                                    style={LeaveListStyle.listContainer}
                                >
                                    <View style={LeaveListStyle.listInnerContainer}>
                                        <Text style={LeaveListStyle.leaveType}>

                                            Cause:
                                        </Text>
                                        <Text style={LeaveListStyle.leaveFrom}>
                                            From:

                                        </Text>
                                    </View>

                                    <View style={LeaveListStyle.leaveReasonContainer}>
                                        <Text
                                            style={[LeaveListStyle.leaveReasonText,
                                            { fontFamily: 'Montserrat_SemiBold' }]}>

                                            {item.LeaveReason}
                                        </Text>
                                        <Text
                                            style={LeaveListStyle.reasonFromDate}>
                                            {item.FromDateVw}


                                        </Text>
                                    </View>
                                    <View
                                        style={LeaveListStyle.causeContainer}>
                                        <Text
                                            style={LeaveListStyle.causeText}>

                                            Leave Type:
                                        </Text>
                                        <Text
                                            style={LeaveListStyle.leaveToText}>
                                            To:
                                        </Text>
                                    </View>

                                    <View
                                        style={LeaveListStyle.detailsContainer}>
                                        <Text
                                            style={LeaveListStyle.reasonFromDate}>
                                            {item.LeaveType}

                                        </Text>
                                        <Text
                                            style={LeaveListStyle.detailsTextInner}>
                                            {item.ToDateVw}
                                        </Text>
                                    </View>




                                    {(item.ApprovedBy != null && item.ApprovedBy != '') ?
                                        <View
                                            style={LeaveListStyle.approvedByContainer}>
                                            <Text
                                                style={LeaveListStyle.approvedByText}>
                                                Approved By: {item.ApprovedBy}
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.approvedAtText}>
                                                Approved At: {item.ApprovedAtVw}
                                            </Text>
                                        </View>
                                        : null}

                                    <View
                                        style={LeaveListStyle.statusButton}>
                                        <View
                                            style={LeaveListStyle.statusButtonInner}>

                                            {item.IsApproved == true ?
                                                (<Text style={{ color: 'green', }}>
                                                    Approved
                                                </Text>) :
                                                (item.IsRejected == true
                                                    ? (<Text style={{ color: 'red', }}>
                                                        Rejected
                                                    </Text>) :
                                                    (<Text style={{ color: '#f1b847', }}>
                                                        Pending
                                                    </Text>))}

                                        </View>
                                        <View style={LeaveListStyle.daysBox}>
                                            <Text
                                                style={LeaveListStyle.statusDate}>
                                                {item.LeaveInDays} Days

                                            </Text>
                                        </View>
                                    </View>
                                </View>

                            }
                        />
                    </View>
                    // </ScrollView>
                }
            </View>
        </View>
    );
}

export default LeaveList;
