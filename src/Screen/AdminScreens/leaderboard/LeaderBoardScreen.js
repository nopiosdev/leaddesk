
import React from 'react';
import { Platform, StatusBar, TouchableOpacity, View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { LeaderBoardStyle } from './LeaderBoardStyle';
import ModalSelector from 'react-native-modal-selector';
import Leaderboard from 'react-native-leaderboard';
import { GetLeaderboardData } from '../../../services/EmployeeTrackService'
import { CommonStyles } from '../../../common/CommonStyles';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import LocalStorage from '../../../common/LocalStorage';
import { useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Header from '../../../components/Header';
import { toggleActive } from '../../../Redux/Slices/UserSlice';
import { useDispatch } from 'react-redux';



const LeaderBoardScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const [yearList] = useState([
        { label: '2019', key: '2019' },
        { label: '2020', key: '2020' },
        { label: '2021', key: '2021' },
        { label: '2022', key: '2022' },
        { label: '2023', key: '2023' },
        { label: '2024', key: '2024' },
        { label: '2025', key: '2025' },
        { label: '2026', key: '2026' },
        { label: '2027', key: '2027' },
        { label: '2028', key: '2028' },
        { label: '2029', key: '2029' },
        { label: '2030', key: '2030' },
    ]);
    const [monthList] = useState([
        { label: 'January', key: '1' },
        { label: 'February', key: '2' },
        { label: 'March', key: '3' },
        { label: 'April', key: '4' },
        { label: 'May', key: '5' },
        { label: 'June', key: '6' },
        { label: 'July', key: '7' },
        { label: 'August', key: '8' },
        { label: 'September', key: '9' },
        { label: 'October', key: '10' },
        { label: 'November', key: '11' },
        { label: 'December', key: '12' },
    ]);
    const [VistNumber, setVistNumber] = useState(moment(new Date()).format("M"));
    const [year, setyear] = useState(moment(new Date()).format("YYYY"));
    const [workingReportList, setworkingReportList] = useState([]);
    const [companyId, setcompanyId] = useState(0);
    const [progressVisible, setprogressVisible] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        GetLeaderboardDataWithMonth(VistNumber, year);
    }, [isFocused])


    const selectedItem = async (itemValue) => {
        setVistNumber(itemValue);
        GetLeaderboardDataWithMonth(itemValue, year);
    }
    const GetLeaderboardDataWithMonth = async (monthNo, yearNo) => {
        try {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            setprogressVisible(true);
            await GetLeaderboardData(cId, monthNo, yearNo)
                .then(res => {
                    console.log('GetLeaderboardData', res)
                    if (!res?.success && res?.success !== false) {
                        res?.forEach(element => {
                            element.imagePath = "http://medilifesolutions.blob.core.windows.net/resourcetracker/" + element.ImageFileName;
                        });
                        setworkingReportList(res);
                    } else {
                        setworkingReportList([]);
                    }
                    setprogressVisible(false);
                })
                .catch(() => {
                    setprogressVisible(false);
                    console.log("error occured");
                });

        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
    }


    const selectedItemYear = async (itemValue) => {
        setyear(itemValue);
        GetLeaderboardDataWithMonth(VistNumber, itemValue);
    }
    const goToDetail = (item) => {
        navigation.navigate("DetailScreen", { detailItem: item, month: VistNumber, year: year })
        //  Actions.DetailScreen();
    }
    const renderDropDownMonth = () => {
        if (Platform.OS === 'android') {
            return (
                <Picker
                    selectedValue={VistNumber}
                    itemStyle={{ borderWidth: 1, borderColor: 'purple', fontSize: 12, fontWeight: '500', padding: 0, borderColor: '#798187', borderRadius: 10, borderWidth: 1 }}
                    style={{ height: 50, width: 130, borderWidth: 1, marginTop: -15, padding: 0, borderColor: '#798187', borderRadius: 10, }}
                    onValueChange={(itemValue, itemIndex) => selectedItem(itemValue)}>
                    {monthList.map((item, key) => {
                        return <Picker.Item value={item.key} label={item.label} key={key} />
                    })}
                </Picker>
            )
        } else {
            return (
                <ModalSelector
                    style={CommonStyles.ModalSelectorStyle}
                    data={monthList}
                    initValue={selectedMonth}
                    onChange={(option) => selectedItem(option.key)}
                />
            )
        }
    }
    const renderDropDownYear = () => {
        if (Platform.OS === 'android') {
            return (
                <Picker
                    selectedValue={year}
                    itemStyle={{ borderWidth: 1, borderColor: 'purple', fontSize: 12, padding: 0, borderColor: 'black', borderRadius: 10, borderWidth: 1 }}
                    style={{ height: 50, width: 100, borderWidth: 1, marginTop: -15, padding: 0, borderColor: 'black', borderRadius: 10, }}
                    onValueChange={(itemValue, itemIndex) => selectedItemYear(itemValue)}>
                    {yearList?.map((item, key) => { return <Picker.Item value={item.key} label={item.label} key={key} /> })}
                </Picker>
            )
        } else {
            return (
                <ModalSelector
                    style={CommonStyles.ModalSelectorStyle}
                    data={yearList}
                    initValue={year}
                    onChange={(option) => selectedItemYear(option.key)}
                />
            )
        }
    }

    return (
        <View style={LeaderBoardStyle.container}>
            <Header
                title={'Leader Board'}
                onPress={() => { navigation.openDrawer() }}
                onGoBack={() => { dispatch(toggleActive(1)); navigation.goBack() }}
            />
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10, marginBottom: 0, padding: 10, paddingBottom: 0, }}>
                <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
                    <Text style={{ color: '#d2d6d9', fontFamily: 'PRODUCT_SANS_BOLD', fontSize: 16 }}>Month:</Text>
                    {renderDropDownMonth()}

                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
                    <Text style={{ color: '#d2d6d9', fontFamily: 'PRODUCT_SANS_BOLD', fontSize: 16 }}>Year:</Text>
                    {renderDropDownYear()}
                </View>
            </View>
            {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={LeaderBoardStyle.loaderIndicator} />) :
                <Leaderboard
                    data={workingReportList}
                    sortBy='TotalScore'
                    icon='imagePath'
                    labelBy='EmployeeName' />
            }
        </View>
    );
}

export default LeaderBoardScreen;
