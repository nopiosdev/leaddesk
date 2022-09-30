import React from 'react';
import DrawerContentAdmin from './DrawerContentAdmin';
import { useSelector } from "react-redux";
import UserDrawerContent from './UserDrawerContent';

const DrawerContent = ({ navigation }) => {
    const userDetails = useSelector((state) => state.user.currentUser);


    if (userDetails?.UserType == 'admin') {
        return (<DrawerContentAdmin navigation={navigation} />);
    }
    else {
        return (<UserDrawerContent navigation={navigation} />)
    }
}

export default DrawerContent;
