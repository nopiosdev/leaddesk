import React from 'react';
import {
    loadFromStorage,
    storage,
    CurrentUserProfile
} from "../../../common/storage";
import DailyAttendances from '../UserScreen/attendance/DailyAttendance';
import AdminTodayAttendance from '../attendance/AdminTodayAttendance';
import { useSelector } from "react-redux";

const DailyAttendance = ({ navigation }) => {
    // console.log('DailyAttendance',navigation)

    const userDetails = useSelector((state) => state.user.currentUser);
    console.log('userDetails',userDetails)
    if (userDetails?.UserType == 'admin') {
        return (<AdminTodayAttendance navigation={navigation} />);
    }
    else {
        // console.log('i am going to attendance');
        return (<DailyAttendances navigation={navigation} />)
    }
}
export default DailyAttendance