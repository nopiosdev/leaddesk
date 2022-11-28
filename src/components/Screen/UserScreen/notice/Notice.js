
import React, { useEffect, useState } from 'react';
import {
    RefreshControl, TouchableOpacity,
    View, Text, FlatList, Image, ScrollView, ActivityIndicator,
    BackHandler
} from 'react-native';
import { NoticeStyle } from './NoticeStyle';
import { getNotice } from '../../../../services/UserService/Notice';
import { SearchBar } from 'react-native-elements';
import LocalStorage from '../../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import { urlResource } from '../../../../Utils/config';
import Searchbar from '../../../Searchbar';

const Notice = ({ navigation, route }) => {

    const [noticeList, setnoticeList] = useState([]);
    const [tempList, settempList] = useState([]);
    const [companyId, setcompanyId] = useState(0);
    const [search, setsearch] = useState('');
    const [refreshing, setrefreshing] = useState(false);
    const [progressVisible, setprogressVisible] = useState(false);
    const isFocused = useIsFocused();




    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    const goBack = () => {
        navigation.navigate('DailyAttendance');
    }

    const goToDetail = (item) => {
        navigation.navigate("NoticeDetailUser", { aItem: item });
    };
    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getNoticeList(companyId, false);
    };

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            getNoticeList(cId, true);
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [isFocused])


    const getNoticeList = async (companyId, isProgress) => {
        try {
            setprogressVisible(isProgress);
            await getNotice(companyId)
                .then(res => {
                    setnoticeList(res?.result);
                    settempList(res?.result);
                    setprogressVisible(false);
                    console.log(res.result, '.....noticeresult');
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
    const searchFilterFunction = text => {
        if (text !== '') {
            const newData = tempList?.filter(item => {
                const itemData = `${item.PostingDate.toUpperCase()} ${item.Details.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setnoticeList(newData);
        } else {
            setnoticeList(tempList);
        }
    };
    
    return (
        <View style={NoticeStyle.container}>

            <View
                style={NoticeStyle.HeaderContent}>
                <View
                    style={NoticeStyle.HeaderFirstView}>
                    <TouchableOpacity
                        style={NoticeStyle.HeaderMenuicon}
                        onPress={() => { navigation.openDrawer(); }}>
                        <Image resizeMode="contain" style={NoticeStyle.HeaderMenuiconstyle}
                            source={require('../../../../../assets/images/menu_b.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={NoticeStyle.HeaderTextView}>
                        <Text
                            style={NoticeStyle.HeaderTextstyle}>
                            NOTICE BOARD
                        </Text>
                    </View>
                </View>
            </View>

            {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={NoticeStyle.loaderIndicator} />) :
                // <ScrollView>
                    <View style={{ flex: 1, margin: 10, }}>

                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={_onRefresh}
                                />
                            }
                            data={noticeList}
                            keyExtractor={(x, i) => i.toString()}
                            ListHeaderComponent={<Searchbar searchFilterFunction={searchFilterFunction}/>}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    onPress={() => goToDetail(item)}
                                >
                                    <View
                                        style={NoticeStyle.listContainer}>
                                        {item.ImageFileName === "" ?
                                            <View style={NoticeStyle.listDivider}>
                                                <View style={NoticeStyle.noticepart}>
                                                    <Text style={{ fontFamily: 'OPENSANS_REGULAR' }}>{item.Details}</Text>
                                                </View>

                                            </View> : <View style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                borderBottomColor: '#edeeef', borderBottomWidth: 1, paddingBottom: 10,
                                            }}>
                                                <View style={{
                                                    alignItems: 'flex-start', width: '80%',
                                                    color: '#1a1a1a', fontSize: 10, fontFamily: 'OPENSANS_REGULAR'
                                                }}>
                                                    <Text style={{}}>{item.Details}</Text>
                                                </View>
                                                <View style={{ alignItems: 'flex-end', width: '20%', }}>
                                                    <View style={{
                                                        borderRadius: 5,

                                                    }}>

                                                        {item.ImageFileName !== "" ?
                                                            <Image resizeMode="cover"
                                                                style={NoticeStyle.noticelistImage} source={{ uri: urlResource + item.ImageFileName }} /> : <Text></Text>}
                                                    </View>
                                                </View>
                                            </View>}
                                        <View style={NoticeStyle.dateContainer}>
                                            <View style={{ alignItems: 'flex-start', }}>
                                                <Text
                                                    style={NoticeStyle.postedtextStyle}>
                                                    Posted Date
                                                </Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end', }}>
                                                <Text style={NoticeStyle.createDateStyle}>

                                                    {item.CreateDate.substr(0, 10)}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>

                                </TouchableOpacity>
                            }
                        >
                        </FlatList>
                    </View>
                // </ScrollView>
            }
        </View>
    );
}

export default Notice;