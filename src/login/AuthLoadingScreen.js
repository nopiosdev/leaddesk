import React from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadFromStorage,
  storage,
  CurrentUserProfile,
  clearStorageValue
} from "../common/storage";
import { RemoveDeviceToken } from "../services/AccountService";
import { getPushNotificationExpoTokenAsync } from "../services/api/RegisterForPushNotificationsAsync";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser, toggleUser, toggleActive } from "../Redux/Slices/UserSlice";
import MainStackNavigator from "../Navigations/MainStackNavigator";
import { useState } from "react";
import LocalStorage from "../common/LocalStorage";
import Loader from "../components/Loader";
import * as Font from 'expo-font'

const AuthLoadingScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  // Fetch the token from storage then navigate to our appropriate place
  // const _bootstrapAsync = async () => {
  //   var response = await loadFromStorage(storage, CurrentUserProfile);

  //   if (response && response.isSuccess && response.item.UserName) {
  //     const userToken = await AsyncStorage.getItem("userToken");
  //     if (userToken) {
  //       props.navigation.navigate('DailyAttendance');
  //     }
  //     else {
  //       await clearStorageValue();
  //       props.navigation.navigate('login');
  //     }
  //   } else {
  //     await clearStorageValue();
  //     props.navigation.navigate('login');
  //   }
  // };

  // const _signOutAsync = async () => {
  //   var token = await getPushNotificationExpoTokenAsync();
  //   if (token) {
  //     await RemoveDeviceToken(token);
  //   }

  //   await AsyncStorage.clear();

  //   props.navigation.navigate("Auth");
  // };

  const CheckStatus = async () => {
    await Font.loadAsync({
      'PRODUCT_SANS_REGULAR': require('../../assets/fonts/PRODUCT_SANS_REGULAR.ttf'),
      'Montserrat_Bold': require('../../assets/fonts/Montserrat_Bold.ttf'),
      'Montserrat_Medium': require('../../assets/fonts/Montserrat_Medium.ttf'),
      'Montserrat_SemiBold': require('../../assets/fonts/Montserrat_SemiBold.ttf'),
      'OPENSANS_BOLD': require('../../assets/fonts/OPENSANS_BOLD.ttf'),
      'OPENSANS_REGULAR': require('../../assets/fonts/OPENSANS_REGULAR.ttf'),
      'PRODUCT_SANS_BOLD': require('../../assets/fonts/PRODUCT_SANS_BOLD.ttf')
    });
    const userLocal = await LocalStorage.GetData("CurrentUser");
    const login = await LocalStorage.GetData("Login");
    dispatch(toggleUser(login));
    dispatch(addUser(JSON.parse(userLocal)));
    dispatch(toggleActive(1));
    setLoaded(true);
  }

  useEffect(() => {
    CheckStatus();
  }, [])
  // useEffect(() => {
  //   _bootstrapAsync();
  // }, [])


  // Render any loading content that you like here
  return (
    <View style={styles.container}>
      {!loaded ?
        <Loader />
        :
        <MainStackNavigator navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AuthLoadingScreen;

// import React from "react";
// import {
//   ActivityIndicator,
//   StatusBar,
//   StyleSheet,
//   View
// } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Actions } from 'react-native-router-flux';
// import {
//   loadFromStorage,
//   storage,
//   CurrentUserProfile,
//   clearStorageValue
// } from "../common/storage";
// import { RemoveDeviceToken } from "../services/AccountService";
// import { getPushNotificationExpoTokenAsync } from "../services/api/RegisterForPushNotificationsAsync";


// export default class AuthLoadingScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this._bootstrapAsync();
//   }

//   // Fetch the token from storage then navigate to our appropriate place
//   _bootstrapAsync = async () => {
//     var response = await loadFromStorage(storage, CurrentUserProfile);

//     if (response && response.isSuccess && response.item.UserName) {
//       const userToken = await AsyncStorage.getItem("userToken");
//       if (userToken) {
//         Actions.DailyAttendance();
//       }
//       else {
//         await clearStorageValue();
//         Actions.login();
//       }
//     } else {
//       await clearStorageValue();
//       Actions.login();
//     }
//   };

//   _signOutAsync = async () => {
//     var token = await getPushNotificationExpoTokenAsync();
//     if (token) {
//       await RemoveDeviceToken(token);
//     }

//     await AsyncStorage.clear();

//     this.props.navigation.navigate("Auth");
//   };

//   // Render any loading content that you like here
//   render() {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator />
//         <StatusBar barStyle="default" />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   }
// });
