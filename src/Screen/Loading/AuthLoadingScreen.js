import React from "react";
import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser, toggleUser, toggleActive } from "../../Redux/Slices/UserSlice";
import MainStackNavigator from "../../Navigations/MainStackNavigator";
import { useState } from "react";
import LocalStorage from "../../common/LocalStorage";
import Loader from "../../components/Loader";
import * as Font from 'expo-font'

const AuthLoadingScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  const CheckStatus = async () => {
    setLoaded(false);
    await Font.loadAsync({
      'PRODUCT_SANS_REGULAR': require('../../../assets/fonts/PRODUCT_SANS_REGULAR.ttf'),
      'Montserrat_Bold': require('../../../assets/fonts/Montserrat_Bold.ttf'),
      'Montserrat_Medium': require('../../../assets/fonts/Montserrat_Medium.ttf'),
      'Montserrat_SemiBold': require('../../../assets/fonts/Montserrat_SemiBold.ttf'),
      'OPENSANS_BOLD': require('../../../assets/fonts/OPENSANS_BOLD.ttf'),
      'OPENSANS_REGULAR': require('../../../assets/fonts/OPENSANS_REGULAR.ttf'),
      'PRODUCT_SANS_BOLD': require('../../../assets/fonts/PRODUCT_SANS_BOLD.ttf')
    });
    const userLocal = await LocalStorage.GetData("CurrentUser");
    const userToken = await LocalStorage.GetData("userToken");
    if (userLocal && userToken) {
      const login = await LocalStorage.GetData("Login");
      dispatch(toggleUser(login));
      dispatch(addUser(JSON.parse(userLocal)));
      dispatch(toggleActive(1));
      setLoaded(true);
    } else {
      dispatch(toggleUser('Logout'));
      LocalStorage.ClearData();
      setLoaded(true);
    }
  }

  useEffect(() => {
    CheckStatus();
  }, [])

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