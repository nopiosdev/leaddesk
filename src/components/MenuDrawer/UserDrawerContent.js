import React from 'react';

import { ScrollView, StatusBar, Platform, Dimensions, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { DrawerContentStyle } from './DrawerContentStyle';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActive, toggleUser } from '../../Redux/Slices/UserSlice';
import LocalStorage from '../../common/LocalStorage';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;

const drawerSelectedOption = (id, dispatch) => {
  dispatch(toggleActive(id));
};

const DailyAttendanceCombo = (navigation, dispatch) => {
  navigation.navigate('DailyAttendance');
  drawerSelectedOption(1, dispatch);
}

const TasksCombo = (navigation, dispatch) => {
  navigation.navigate('TaskListBottomTab');
  drawerSelectedOption(2, dispatch);
}

//user
const MyPanelCombo = (navigation, dispatch) => {
  navigation.navigate('MyPanel');
  drawerSelectedOption(3, dispatch);
}
const LeavesCombo = (navigation, dispatch) => {
  navigation.navigate('LeaveList');
  drawerSelectedOption(4, dispatch);
}


const NoticeCombo = (navigation, dispatch) => {
  navigation.navigate('NoticeUser');
  drawerSelectedOption(5, dispatch);
}
const LeaderBoardCombo = (navigation, dispatch) => {
  navigation.navigate('LeaderBoard');
  drawerSelectedOption(6, dispatch);
}
const SettingsCombo = (dispatch) => {
  drawerSelectedOption(7,dispatch);
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

export {
  DailyAttendanceCombo,
  TasksCombo,
  LeavesCombo,
  NoticeCombo, SettingsCombo,
  drawerSelectedOption,
  MyPanelCombo,
}

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
  const userDetails = useSelector((state) => state.user.currentUser);
  const active = useSelector((state) => state.user.active);
  const dispatch = useDispatch();

  // const getMyPanel = () => {
  //   if (userDetails?.UserType == "user") {
  //     return (<TouchableOpacity
  //       onPress={() => MyPanelCombo(navigation, dispatch)}
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
          style={{ height: 38, width: 108, marginVertical: 15, }}
          source={require('../../../assets/images/icon.png')} >
        </Image>
        <Text style={{
          marginLeft: 5,
          fontSize: 26,
          fontWeight: "bold",
          color: "#000000",
          fontFamily: "Montserrat_Bold",
        }}>
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
            source={require('../../../assets/images/attndt.png')} >
          </Image>

          <Text style={DrawerContentStyle.itemTextStyle}>
            Attendance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => MyPanelCombo(navigation, dispatch)}
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
          onPress={() => TasksCombo(navigation, dispatch)}
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
          onPress={() => LeavesCombo(navigation, dispatch)}
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
          onPress={() => NoticeCombo(navigation, dispatch)}
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
          onPress={() => LeaderBoardCombo(navigation, dispatch)}
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
          onPress={() => SettingsCombo(dispatch)}
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
