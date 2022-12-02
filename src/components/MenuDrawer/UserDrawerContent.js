import React from 'react';

import { ScrollView, StatusBar, Platform, Dimensions, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { DrawerContentStyle } from './DrawerContentStyle';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActive, toggleUser } from '../../Redux/Slices/UserSlice';
import LocalStorage from '../../common/LocalStorage';




// const StatusBarPlaceHolder = () => {
//   return (
//     <View style={{
//       width: "100%",
//       height: STATUS_BAR_HEIGHT,
//       backgroundColor: '#F3F3F3',
//     }}>
//       <StatusBar />
//     </View>
//   );
// }

const UserDrawerContent = ({ navigation }) => {
  const active = useSelector((state) => state.user.active);
  const dispatch = useDispatch();

  const drawerSelectedOption = (id, screen) => {
    dispatch(toggleActive(id));
    if (screen) { navigation.navigate(screen); }
  };
 
  const Logout = () => {
    drawerSelectedOption(7);
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
        onPress: async () => {
          LocalStorage.ClearData();
          dispatch(toggleUser('Logout'));
        }
      },], {
      cancelable: false
    }
    )
    return true;

  }

  // const getMyPanel = () => {
  //   if (userDetails?.UserType == "user") {
  //     return (<TouchableOpacity
  //       onPress={() => MyPanelCombo()}
  //       style={
  //         active == 3 ?
  //           DrawerContentStyle.itemContainerSelected :
  //           DrawerContentStyle.itemContainer}>
  //       <Feather name="map" size={24} color="#218f6f"
  //         style={{ transform: [{ scaleX: -1 }] }}
  //       />
  //       <Text style={DrawerContentStyle.itemTextStyle}>
  //         My panel
  //       </Text>
  //     </TouchableOpacity>)
  //   }
  // }

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
          onPress={() => drawerSelectedOption(1, 'DailyAttendance')}
          style={
            active == 1 ?
              DrawerContentStyle.itemContainerSelected :
              DrawerContentStyle.itemContainer}>
          <Image
            resizeMode='contain'
            style={{ width: 23, height: 23, }}
            source={require('../../../assets/images/attndt.png')} >
          </Image>

          <Text style={DrawerContentStyle.itemTextStyle}>
            Attendance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => drawerSelectedOption(3, 'MyPanel')}
          style={
            active == 3 ?
              DrawerContentStyle.itemContainerSelected :
              DrawerContentStyle.itemContainer}>
          <Feather name="map" size={24} color="#218f6f"
            style={{ transform: [{ scaleX: -1 }] }}
          />
          <Text style={DrawerContentStyle.itemTextStyle}> My Panel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => drawerSelectedOption(2, 'TaskListBottomTab')}
          style={
            active == 2 ?
              DrawerContentStyle.itemContainerSelected :
              DrawerContentStyle.itemContainer}>

          <Image
            resizeMode='contain'
            style={{ width: 23, height: 23, }}
            source={require('../../../assets/images/taskList.png')} >

          </Image>
          <Text style={DrawerContentStyle.itemTextStyle}>My Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => drawerSelectedOption(4, 'LeaveList')}
          style={
            active == 4 ?
              DrawerContentStyle.itemContainerSelected :
              DrawerContentStyle.itemContainer}>
          <Image
            resizeMode='contain'
            style={{ width: 23, height: 23, }}
            source={require('../../../assets/images/leave_s.png')} >

          </Image>
          <Text style={DrawerContentStyle.itemTextStyle}>
            Leaves
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => drawerSelectedOption(5, 'Notice')}
          style={
            active == 5 ?
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
          onPress={() => drawerSelectedOption(6, 'LeaderBoard')}
          style={
            active == 6 ?
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
          onPress={() => Logout()}
          style={
            active == 7 ?
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

export default UserDrawerContent;
