import React, { useEffect, useState } from 'react';
import DailyAttendances from '../UserScreen/attendance/DailyAttendance';
import AdminTodayAttendance from '../attendance/AdminTodayAttendance';
import { useSelector } from "react-redux";
import * as Notifications from 'expo-notifications';


const DailyAttendance = ({ navigation }) => {
    const userDetails = useSelector((state) => state.user.currentUser);
    const [expoPushToken, setExpoPushToken] = useState('');

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

    useEffect(() => {
        // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));   
      }, []);

    if (userDetails?.UserType == 'admin') {
        return (<AdminTodayAttendance navigation={navigation} />);
    }
    else {
        return (<DailyAttendances navigation={navigation} />)
    }
}
export default DailyAttendance