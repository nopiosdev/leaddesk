import React, { useEffect, useState } from 'react';
import DailyAttendances from '../../EmployeeScreens/attendance/DailyAttendance';
import AdminTodayAttendance from '../attendance/AdminTodayAttendance';
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from 'expo-notifications';
import * as Update from 'expo-updates';
import Popup from '../../../components/Popup';
import { View } from 'react-native';
import { toggleActive } from '../../../Redux/Slices/UserSlice';
import { useIsFocused } from '@react-navigation/native';


const DailyAttendance = ({ navigation }) => {
    const userDetails = useSelector((state) => state.user.currentUser);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [updatevisible, setUpdateVisible] = useState(false);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    // const registerForPushNotificationsAsync = async() => {
    //     let token;

    //     if (Platform.OS === 'android') {
    //       await Notifications.setNotificationChannelAsync('default', {
    //         name: 'default',
    //         importance: Notifications.AndroidImportance.MAX,
    //         vibrationPattern: [0, 250, 250, 250],
    //         lightColor: '#FF231F7C',
    //       });
    //     }

    //       const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //       let finalStatus = existingStatus;
    //       if (existingStatus !== 'granted') {
    //         const { status } = await Notifications.requestPermissionsAsync();
    //         finalStatus = status;
    //       }
    //       if (finalStatus !== 'granted') {
    //         alert('Failed to get push token for push notification!');
    //         return;
    //       }
    //       token = (await Notifications.getExpoPushTokenAsync())?.data;
    //       console.log(token);


    //     return token;
    //   }

    const checkupdate = async () => {
        if (__DEV__) return;
        const updateCheck = await Update.checkForUpdateAsync();
        if (updateCheck.isAvailable) {
            await Update.fetchUpdateAsync();
            setUpdateVisible(true);
        }
    }

    useEffect(() => {
        dispatch(toggleActive(1));
        checkupdate();
        // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));   
    }, []);
    return (
        <>
            {userDetails?.UserType == 'admin' ? <AdminTodayAttendance navigation={navigation} /> : <DailyAttendances navigation={navigation} />}
            <Popup
                show={updatevisible}
                title={'Update'}
                description={'New Updates Are Available'}
            />
        </>
    );
}
export default DailyAttendance