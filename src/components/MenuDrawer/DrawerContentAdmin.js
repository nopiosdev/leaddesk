import React, { useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { DrawerContentStyle } from './DrawerContentStyle';
import { Feather, } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import LocalStorage from '../../common/LocalStorage';
import { toggleActive, toggleUser } from '../../Redux/Slices/UserSlice';

const logOut = (dispatch) => {

    dispatch(toggleActive(8));
    Alert.alert(
        'Log Out'
        ,
        'Log Out From The App?', [{
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
        }, {
            text: 'OK',
            style: 'ok',
            onPress: () => {
                LocalStorage.ClearData();
                dispatch(toggleUser('Logout'));
            }
        },], {
        cancelable: false
    }
    )
    return true;
};

const drawerSelectedOption = (id, dispatch) => {
    dispatch(toggleActive(id));

};
const LiveTrackingCombo = (navigation, dispatch) => {
    navigation.navigate('LiveTraking');
    drawerSelectedOption(2, dispatch);
}
const DailyAttendanceCombo = (navigation, dispatch) => {
    navigation.navigate('DailyAttendance');
    drawerSelectedOption(1, dispatch);
}
const TasksCombo = (navigation, dispatch) => {
    navigation.navigate('TaskListBottomTab');
    drawerSelectedOption(3, dispatch);
}
const TasksboardCombo = (navigation, dispatch) => {
    navigation.navigate('TaskBoardScreen');
    drawerSelectedOption(4, dispatch);
}

const LeavesCombo = (navigation, dispatch) => {
    navigation.navigate('LeaveList');
    drawerSelectedOption(5, dispatch);
}



const ReportsCombo = (navigation, dispatch) => {
    navigation.navigate('ReportScreen');
    drawerSelectedOption(6, dispatch);
}

const NoticeCombo = (navigation, dispatch) => {
    navigation.navigate('Notice');
    drawerSelectedOption(7, dispatch);
}
const LeaderBoardCombo = (navigation, dispatch) => {
    navigation.navigate('LeaderBoard');
    drawerSelectedOption(8, dispatch);
}
const SettingsCombo = (navigation, dispatch) => {
    navigation.navigate('SettingScreen');
    drawerSelectedOption(9, dispatch);
}

const LogoutCombo = (dispatch) => {
    logOut(dispatch);
}

export {
    DailyAttendanceCombo,
    LiveTrackingCombo,
    TasksCombo,
    LeavesCombo,
    ReportsCombo, NoticeCombo, SettingsCombo,
    drawerSelectedOption,
    TasksboardCombo,
    LogoutCombo
}

const DrawerContentAdmin = ({ navigation }) => {
    const active = useSelector((state) => state.user.active);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(toggleActive(2));
    }, [])

    return (
        <View style={DrawerContentStyle.container}>

            <View
                style={[DrawerContentStyle.logoImage,
                {
                    marginBottom: 5, marginTop: 10,
                    justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row'
                }
                ]}>
                <Image
                    resizeMode='contain'
                    style={{ height: 38, width: 38, marginVertical: 15, }}
                    source={require('../../../assets/images/icon.png')} >
                </Image>
                <Text style={{
                    marginLeft: 5,
                    fontSize: 26,
                    fontWeight: "bold",
                    color: "#000000",
                    fontFamily: "Montserrat_Bold",
                }}>
                    LeadDesk
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                <TouchableOpacity
                    onPress={() => DailyAttendanceCombo(navigation, dispatch)}
                    style={
                        active == 1 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 23, height: 23, }}
                        source={require('../../../assets/images/home.png')} >
                    </Image>

                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Today Attendance
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => LiveTrackingCombo(navigation, dispatch)}
                    style={
                        active == 2 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 23, height: 23, }}
                        source={require('../../../assets/images/pin_s.png')} >
                    </Image>

                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Live Tracking
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => TasksCombo(navigation, dispatch)}
                    style={
                        active == 3 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>

                    <Image
                        resizeMode='contain'
                        style={{ width: 23, height: 23, }}
                        source={require('../../../assets/images/task.png')} >

                    </Image>
                    <Text style={DrawerContentStyle.itemTextStyle}>
                        All Tasks
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => LeavesCombo(navigation, dispatch)}
                    style={
                        active == 5 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 23, height: 23, }}
                        source={require('../../../assets/images/leaves.png')} >

                    </Image>
                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Leaves
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => ReportsCombo(navigation, dispatch)}
                    style={
                        active == 6 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>

                    <Image
                        resizeMode='contain'
                        style={{ width: 23, height: 23, }}
                        source={require('../../../assets/images/report.png')} >

                    </Image>
                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Attendance Report
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => NoticeCombo(navigation, dispatch)}
                    style={
                        active == 7 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>

                    <Image
                        resizeMode='contain'
                        style={{ width: 23, height: 23, }}
                        source={require('../../../assets/images/notice.png')} >

                    </Image>
                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Notice Board
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => LeaderBoardCombo(navigation, dispatch)}
                    style={
                        active == 8 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>

                    <Feather name="activity" size={24} color="#218f6f"
                        style={{ transform: [{ scaleX: -1 }] }}
                    />
                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Leader Board
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => SettingsCombo(navigation, dispatch)}
                    style={
                        active == 9 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 23, height: 23, }}
                        source={require('../../../assets/images/setting.png')} >

                    </Image>
                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Settings
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => LogoutCombo(dispatch)}
                    style={
                        active == 10 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>
                    <Feather name="log-out" size={25} color="#c24a4a" />

                    <Text style={DrawerContentStyle.itemTextStyle}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View >
    )
}

export default DrawerContentAdmin