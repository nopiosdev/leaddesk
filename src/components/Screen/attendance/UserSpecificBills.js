
import React,{ useState,useEffect } from 'react';
import { Platform, StatusBar, Dimensions, RefreshControl, TouchableOpacity, View, Text, FlatList, Image, ScrollView, ActivityIndicator, BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from 'expo';
import { Actions } from 'react-native-router-flux';
// // import * as actions from '../../../common/actions';

import { FinanceStyle } from '../finance/FinanceStyle';

import { useSelector } from "react-redux";

import { DailyAttendanceStyle } from './DailyAttendanceStyle';

import InvoiceList from '../finance/InvoiceListComponent';

import { GetMyInvoiceList } from '../../../services/UserService/FinancialService'

import { SearchBar } from 'react-native-elements';
import call from 'react-native-phone-call'

import { CommonStyles } from '../../../common/CommonStyles';
import LocalStorage from '../../../common/LocalStorage';


const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
const StatusBarPlaceHolder = ({navigation}) => {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#F3F3F3',
        }}>
            <StatusBar />
        </View>
    );
}


const UserSpecificBills=()=>{

    const [companyId, setcompanyId] = useState(0);
    const [invoiceDataList, setinvoiceDataList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(true);
    const [refreshing, setrefreshing] = useState(false);
    const [userId, setuserId] = useState(global.aItemUserId);
    const [search, setsearch] = useState('');
    let arrayholder=[];
    const user = useSelector((state) => state.user.currentUser);
    const clientId = useSelector((state) => state.user.clientId);

    
    const Call = () => {
        //handler to make a call
        const args = {
            number: user?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }

    const  handleBackButton = ()=> {
        navigation.navigate('DailyAttendance')
        return true;
    }


    const _onRefresh = async () =>
    {
        setrefreshing(true);
        setTimeout(function (){
            setrefreshing(false);
        }, 2000);

        GetInvoiceList(clientId, false);
    };

    useEffect(() => {
        (async()=>{
        const cId = await LocalStorage.GetData("companyId");
        setcompanyId(cId)
        GetInvoiceList(clientId, true);
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    })();
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      }
    }, [])
    
    const GetInvoiceList = async (userId, isProgress) =>
    {
        try
        {
            setprogressVisible(isProgress);
            await GetMyInvoiceList(clientId)
                .then(res =>
                {
                    setinvoiceDataList(res?.result);
                    setprogressVisible(false);
                    arrayholder = res.result;
                    console.log(res.result, 'invoiceDataList.............')
                })
                .catch(() =>
                {
                    setprogressVisible(false);
                    console.log("error occured");
                });

        } catch (error)
        {
            setprogressVisible(false);
            console.log(error);
        }
    }

    const searchFilterFunction = text => {
      
        setsearch(text)
        const newData = arrayholder.filter(item =>
        {
            const itemData = `${item.InvoiceNo.toUpperCase()} ${item.CreatedByName.toUpperCase()} ${item.Title.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        setinvoiceDataList(newData);
    };

    const renderHeader = () =>
    {
        return (
            <SearchBar
                placeholder="Type Here..."
                style={{ position: 'absolute', zIndex: 1 }}
                lightTheme
                containerStyle={{ backgroundColor: '#f6f7f9', }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                round
                onChangeText={text => searchFilterFunction(text)}
                autoCorrect={false}
                value={search}
            />

        );
    };

        return (
            <View style={FinanceStyle.container}>
                <StatusBarPlaceHolder />
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={() => { handleBackButton() }}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/left_arrow.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                {global.aItemEmployeeName}

                            </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={call}
                            style={{
                                padding: 8, paddingVertical: 2,
                               
                            }}>
                            <Image style={{ width: 20, height: 20,alignItems:'center',marginTop:5, }}
                                resizeMode='contain'
                                source={require('../../../../assets/images/call.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>



                <InvoiceList itemList={invoiceDataList} headerRenderer={renderHeader()} />
            </View>
        );
}

export default  UserSpecificBills;

