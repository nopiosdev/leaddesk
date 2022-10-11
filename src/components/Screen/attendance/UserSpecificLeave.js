import React, { useEffect } from 'react';

import { RefreshControl, TouchableOpacity, View, Text, FlatList, ScrollView, ActivityIndicator, BackHandler, Image } from 'react-native';

import { GetUserLeaves, LeaveApproved, LeaveRejected } from '../../../services/Leave';

import call from 'react-native-phone-call'
import { LeaveListStyle } from '../leaves/LeaveListStyle';

import { SearchBar } from 'react-native-elements';


import { CommonStyles } from '../../../common/CommonStyles';
import { useState } from 'react';
import LocalStorage from '../../../common/LocalStorage';
import { useSelector } from "react-redux";


const UserSpecificLeave = ({ navigation }) => {

    const [companyId, setcompanyId] = useState('');
    const [leaveList, setleaveList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(true);
    const [refreshing, setrefreshing] = useState(false);
    const [search, setsearch] = useState('');
    const user = useSelector((state) => state.user.currentUser);
    const [tempList, settempList] = useState([]);

    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getLeaveList(user?.Id, false);
    };

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId)
            getLeaveList(user?.Id, true);
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [])

    const Call = () => {
        //handler to make a call
        const args = {
            number: user?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }
    const handleBackButton = () => {
        navigation.navigate('DailyAttendance');
        return true;
    }

    const renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
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

    const searchFilterFunction = text => {

        if (search) {
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

    const getLeaveList = async (userId, isProgress) => {
        try {
            setprogressVisible(isProgress);
            await GetUserLeaves(userId)
                .then(res => {
                    setleaveList(res);
                    setprogressVisible(false);
                    settempList(res);
                    console.log(res, 'leaveresultlist.............')
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

        getLeaveList(companyId, true);
    }


    return (
        <View style={LeaveListStyle.container}>

            <View
                style={CommonStyles.HeaderContent}>
                <View
                    style={CommonStyles.HeaderFirstView}>
                    <TouchableOpacity
                        style={CommonStyles.HeaderMenuicon}
                        onPress={() => { handleBackButton() }}>
                        <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                            source={require('../../../../assets/images/left_arrow.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={CommonStyles.HeaderTextView}>
                        <Text
                            style={CommonStyles.HeaderTextstyle}>
                            {user?.aItemEmployeeName}
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


            <View style={{ flex: 1, }}>

                {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={LeaveListStyle.loaderIndicator} />) : null}

                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                <View style={{ flex: 1, padding: 10, }}>
                    {renderHeader()}
                    {leaveList?.length > 0 && <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={_onRefresh}
                            />
                        }
                        data={leaveList}
                        keyExtractor={(x, i) => i.toString()}
                        renderItem={({ item }) =>
                            <View
                                style={LeaveListStyle.listContainer}
                            >
                                <View style={LeaveListStyle.listInnerContainer}>
                                    <Text style={LeaveListStyle.leaveType}>
                                        Name:
                                    </Text>
                                    <Text style={LeaveListStyle.leaveFrom}>
                                        From:
                                    </Text>
                                </View>

                                <View style={LeaveListStyle.leaveReasonContainer}>
                                    <Text
                                        style={LeaveListStyle.leaveReasonText}>
                                        {item.EmployeeName}
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
                                        Cause:
                                    </Text>
                                    <Text
                                        style={LeaveListStyle.leaveToText}>
                                        To:
                                    </Text>
                                </View>

                                <View
                                    style={LeaveListStyle.detailsContainer}>
                                    <Text
                                        style={LeaveListStyle.detailsText}>
                                        {item.LeaveReason}
                                    </Text>
                                    <Text
                                        style={LeaveListStyle.detailsTextInner}>
                                        {item.ToDateVw}
                                    </Text>
                                </View>

                                <View
                                    style={LeaveListStyle.causeContainer1}>
                                    <Text style={LeaveListStyle.causeText}>
                                        Leave Type:
                                    </Text>
                                    <Text style={LeaveListStyle.causeText1}>
                                        {item.LeaveType}
                                    </Text>
                                </View>


                                {(item.ApprovedBy != null && item.ApprovedBy != '') ?
                                    <View
                                        style={LeaveListStyle.approvedByContainer}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text
                                                style={LeaveListStyle.approvedByText}>
                                                Approved By:
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.approvedByText1}>
                                                {item.ApprovedBy}

                                            </Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={LeaveListStyle.approvedAtText}>
                                                Approved At:
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.approvedAtText1}>
                                                {item.ApprovedAtVw}
                                            </Text>
                                        </View>
                                    </View>
                                    : null}

                                {(!item.IsApproved && !item.IsRejected) ?
                                    <View
                                        style={LeaveListStyle.buttonContainer}>
                                        <View style={LeaveListStyle.foraligmentitem}>
                                            <TouchableOpacity
                                                onPress={() => leaveApprove(item)}
                                                style={LeaveListStyle.buttonTouchable}>
                                                <Text style={LeaveListStyle.approveText}>
                                                    APPROVE
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => leaveReject(item)}
                                                style={LeaveListStyle.rejectButtonTouchable}>
                                                <Text
                                                    style={LeaveListStyle.rejectText}>
                                                    REJECT
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={LeaveListStyle.statusDate1}>
                                            {item.LeaveInDays} Days
                                        </Text>
                                    </View>
                                    :
                                    <View
                                        style={LeaveListStyle.statusButton}>
                                        <View
                                            style={LeaveListStyle.statusButtonInner}>
                                            {item.IsApproved == true ?
                                                (<Text style={{ color: 'green', }}>
                                                    Approved
                                                </Text>)
                                                : (item.IsRejected == true ?
                                                    (<Text style={{ color: 'red', }}>
                                                        Rejecected
                                                    </Text>)
                                                    : (<Text style={{ color: '#f1b847', }}>
                                                        Pending
                                                    </Text>))}

                                        </View>

                                        <Text
                                            style={LeaveListStyle.statusDate}>
                                            {item.LeaveInDays} Days
                                        </Text>
                                    </View>
                                }
                            </View>
                        }
                    />}
                </View>
                {/* </ScrollView> */}
            </View>
        </View>
    );
}

export default UserSpecificLeave;

