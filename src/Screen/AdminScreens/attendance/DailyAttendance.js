import React, { useEffect, useState } from 'react';
import DailyAttendances from '../../EmployeeScreens/attendance/DailyAttendance';
import AdminTodayAttendance from '../attendance/AdminTodayAttendance';
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from 'expo-notifications';
import * as Update from 'expo-updates';
import Popup from '../../../components/Popup';
import NetInfo from '@react-native-community/netinfo';
import { toggleActive } from '../../../Redux/Slices/UserSlice';
import { useIsFocused } from '@react-navigation/native';


const DailyAttendance = ({ navigation }) => {
    const userDetails = useSelector((state) => state.user.currentUser);
    const [connectionPopup, setConnectionPopup] = useState(false);
    const [updatevisible, setUpdateVisible] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

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
        const unsubscribe = NetInfo.addEventListener(state => {
            if (!state.isConnected) {
                setConnectionPopup(true);
            } else {
                setConnectionPopup(false);
            }
        });
        dispatch(toggleActive(1));
        checkupdate();
        // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));   
        return unsubscribe;
    }, [connectionPopup]);
    return (
        <>
            {userDetails?.UserType == 'admin' ? <AdminTodayAttendance navigation={navigation} /> : <DailyAttendances navigation={navigation} />}
            <Popup
                show={updatevisible}
                title={'Update'}
                description={'New Updates Are Available'}
                onPress={() => Update.reloadAsync()}
                btnText="Update"
            />
            <Popup
                show={connectionPopup}
                title={'Connection Error!'}
                description={'Please turn on your internet connection!'}
                btnText='Try Again'
                onPress={() => setConnectionPopup(false)}
            />
        </>
    );
}
export default DailyAttendance