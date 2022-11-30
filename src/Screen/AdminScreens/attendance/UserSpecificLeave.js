import React, { useEffect } from 'react';
import { RefreshControl, TouchableOpacity, View, Text, FlatList, ScrollView, ActivityIndicator, BackHandler, Image } from 'react-native';
import { GetUserLeaves, LeaveApproved, LeaveRejected } from '../../../services/Leave';
import call from 'react-native-phone-call'
import { LeaveListAdminStyle, LeaveListStyle } from '../leaves/LeaveListStyle';
import { CommonStyles } from '../../../common/CommonStyles';
import { useState } from 'react';
import LocalStorage from '../../../common/LocalStorage';
import { useSelector } from "react-redux";
import Searchbar from '../../../components/Searchbar';
import LeaveBox from '../../../components/LeaveBox';
import Header from '../../../components/Header';


const UserSpecificLeave = ({ navigation }) => {

    const [companyId, setcompanyId] = useState('');
    const [leaveList, setleaveList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(true);
    const [refreshing, setrefreshing] = useState(false);
    const [search, setsearch] = useState('');
    const user = useSelector((state) => state.user.currentUser);
    const [tempList, settempList] = useState([]);
    const selectedEmp = useSelector((state) => state.user.selectedEmp);

    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getLeaveList(false);
    };

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId)
            getLeaveList(true);
        })();
    }, [])

    const Call = () => {
        //handler to make a call
        const args = {
            number: selectedEmp?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }

    const searchFilterFunction = text => {

        if (search) {
            const newData = tempList?.filter(item => {
                const itemData = `${item.EmployeeName.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setleaveList(newData);
        } else {
            setleaveList(tempList);
        }
    };

    const getLeaveList = async (isProgress) => {
        try {
            setprogressVisible(isProgress);
            await GetUserLeaves(selectedEmp?.UserId)
                .then(res => {
                    setleaveList(res);
                    console.log('leaveresultlist.............', res)
                    setprogressVisible(false);
                    settempList(res);
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
                if (res?.success) {
                    getLeaveList(true);
                }
            })
            .catch(() => {
                setprogressVisible(false);
                console.log("error occured");
            });
    }

    const leaveReject = async (item) => {
        await LeaveRejected(item.Id)
            .then(res => {
                console.log('REJECTED', res)
                if (res?.success) {
                    getLeaveList(true);
                }
            })
            .catch(() => {
                setprogressVisible(false);
                console.log("error occured");
            });

    }


    return (
        <View style={(user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle)?.container}>
            <Header
                title={selectedEmp?.EmployeeName}
                navigation={navigation}
                goBack={true}
                onPress={() => { navigation.goBack() }}
                makeCall={Call}
            />
            <View style={{ flex: 1, }}>

                {progressVisible == true ?
                    <ActivityIndicator size="large" color="#1B7F67" style={(user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle)?.loaderIndicator} />
                    :
                    <View style={{ flex: 1, padding: 10, }}>
                        {<Searchbar searchFilterFunction={searchFilterFunction} />}
                        {leaveList?.length > 0 && <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={_onRefresh}
                                />
                            }
                            keyboardShouldPersistTaps='always'
                            data={leaveList}
                            keyExtractor={(x, i) => i.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) =>
                                <LeaveBox
                                    item={item}
                                    onApprove={() => leaveApprove(item)}
                                    onReject={() => leaveReject(item)}
                                    styles={user?.UserType == 'admin' ? LeaveListAdminStyle : LeaveListStyle}
                                />
                            }
                        />}
                    </View>
                }
            </View>
        </View>
    );
}

export default UserSpecificLeave;

