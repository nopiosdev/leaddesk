import React, { useState, useEffect } from 'react';
import { RefreshControl, TouchableOpacity, View, Text, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { GetLeaveList, LeaveApproved, LeaveRejected } from '../../../services/Leave';
import { LeaveListStyle } from './LeaveListStyle';
import { SearchBar } from 'react-native-elements';
import { CommonStyles } from '../../../common/CommonStyles';
import { useSelector } from 'react-redux';
import LocalStorage from '../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../Loader';
import Searchbar from '../../Searchbar';


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
    const goBack = () => {
        navigation.goBack();
    }

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
            await GetLeaveList(companyId)
                .then(res => {
                    setleaveList(res);
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
        <>
            {isLoaded ?
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
                    </View>
                    <View style={{ flex: 1, }}>

                        {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={LeaveListStyle.loaderIndicator} />) : null}

                        <ScrollView showsVerticalScrollIndicator={false}>
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
                                        <View
                                            style={LeaveListStyle.listContainer}
                                        >
                                            <View style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: .4, padding: 8, paddingLeft: 0 }}>

                                                <Text style={{ fontFamily: 'Montserrat_SemiBold', fontSize: 14 }}>{item.EmployeeName}</Text>
                                            </View>
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

                                            {(!item.IsApproved && !item.IsRejected) ?
                                                <View
                                                    style={LeaveListStyle.buttonContainer}
                                                >
                                                    <View style={LeaveListStyle.foraligmentitem}>
                                                        <TouchableOpacity
                                                            onPress={() => leaveApprove(item)}
                                                            style={LeaveListStyle.buttonTouchable}
                                                        >
                                                            <Text style={LeaveListStyle.approveText}>
                                                                APPROVE
                                                            </Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            onPress={() => leaveReject(item)}

                                                            style={LeaveListStyle.rejectButtonTouchable}
                                                        >
                                                            <Text
                                                                style={LeaveListStyle.rejectText}
                                                            >
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

                                                        {item.IsApproved == true ? (<Text style={{ color: 'green', }}>Approved</Text>) : (item.IsRejected == true ? (<Text style={{ color: 'red', }}>Rejected</Text>) : (<Text style={{ color: '#f1b847', }}>Pending</Text>))}

                                                    </View>

                                                    <Text
                                                        style={LeaveListStyle.statusDate}
                                                    >
                                                        {item.LeaveInDays} Days

                                                    </Text>

                                                </View>
                                            }
                                        </View>

                                    }
                                    ListHeaderComponent={<Searchbar searchFilterFunction={searchFilterFunction}/>}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View> :
                <Loader />
            }
        </>
    );
}
export default LeaveList;