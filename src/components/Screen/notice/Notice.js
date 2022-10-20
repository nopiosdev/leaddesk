
import React from 'react';
import {
    Platform, StatusBar, Dimensions, RefreshControl, TouchableOpacity,
    View, Text, FlatList, Image, ScrollView, ActivityIndicator, Alert, BackHandler,
} from 'react-native';
import { NoticeStyle } from './NoticeStyle';
import { getNotice } from '../../../services/Notice';
import { CommonStyles } from '../../../common/CommonStyles';
import { SearchBar } from 'react-native-elements';
import {
    FontAwesome,
} from '@expo/vector-icons';
import { urlDev, urlResource } from '../../../services/api/config';
import LocalStorage from '../../../common/LocalStorage';
import { useState } from 'react';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Searchbar from '../../Searchbar';
import moment from 'moment';
import Header from '../../Header';

const Notice = ({ navigation, route }) => {

    const [noticeList, setnoticeList] = useState([]);
    const [tempList, settempList] = useState([]);

    const [companyId, setcompanyId] = useState(0);
    const [refreshing, setrefreshing] = useState(false);
    const [progressVisible, setprogressVisible] = useState(false);
    const [search, setSearch] = useState('');
    const isFocused = useIsFocused();
    const goBack = () => {
        navigation.goBack();
    }

    const goToDetail = (item) => {
        console.log(item, '.............item');
        navigation.navigate("NoticeDetail", { aItem: item });
    };

    const goToCreateNotice = () => {
        navigation.navigate("CreateNotice");
    }
    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getNoticeList(companyId, false);
    }
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


    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
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
            setnoticeList(tempList)
        }
    };

    const getNoticeList = async (companyId, isProgress) => {
        try {
            setprogressVisible(isProgress);
            await getNotice(companyId)
                .then(res => {
                    console.log('.....noticeresult', res);
                    setprogressVisible(false);
                    setnoticeList(res);
                    settempList(res);
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

    return (
        <View style={NoticeStyle.container}>
            <Header
                title={'Notice Board'}
                onPress={() => { navigation.openDrawer() }}
                btnAction={() => goToCreateNotice()}
                btnTitle='NOTICE'
                btnContainerStyle={NoticeStyle.ApplyTextButton}
                btnStyle={NoticeStyle.plusButton}
            />
            <View style={{ flex: 1, }}>
                {<Searchbar searchFilterFunction={searchFilterFunction} />}
                {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={NoticeStyle.loaderIndicator} />) :
                    <View style={{ flex: 1, padding: 10, }}>
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={_onRefresh}
                                />
                            }
                            keyboardShouldPersistTaps='always'
                            data={noticeList}
                            keyExtractor={(x, i) => i.toString()}
                            renderItem={({ item }) =>

                                <TouchableOpacity onPress={() => goToDetail(item)}>
                                    <View
                                        style={NoticeStyle.listContainer}>
                                        {item.ImageFileName ?
                                            <View style={NoticeStyle.listDivider}>
                                                <View style={NoticeStyle.noticepart}>
                                                    <Text style={{}}>{item.Details}</Text>
                                                </View>
                                            </View>
                                            : <View style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                borderBottomColor: 'white', borderBottomWidth: 2, paddingBottom: 10,
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

                                                        {item.ImageFileName ?
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

                                                    {moment(item.CreatedDate).format('MM/DD/YYYY')}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                }
            </View>

        </View>
    );
}

export default Notice;