
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

const Notice = ({ navigation, route }) => {

    const [noticeList, setnoticeList] = useState([]);
    const [tempList, settempList] = useState([]);

    const [companyId, setcompanyId] = useState(0);
    const [refreshing, setrefreshing] = useState(false);
    const [progressVisible, setprogressVisible] = useState(false);
    const [search, setSearch] = useState('');
    let arrayholder = [];
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

    const renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                lightTheme
                containerStyle={{ backgroundColor: '#f6f7f9', }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                round
                onChangeText={text => { setSearch(text); searchFilterFunction(text) }}
                autoCorrect={false}
                value={search}
            />

        );
    };
    const getNoticeList = async (companyId, isProgress) => {
        try {
            setprogressVisible(isProgress);
            await getNotice(companyId)
                .then(res => {
                    setprogressVisible(false);
                    setnoticeList(res?.result);
                    settempList(res?.result);
                    arrayholder = res.result;
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

    return (
        <View style={NoticeStyle.container}>
            <View
                style={CommonStyles.HeaderContent}>
                <View
                    style={CommonStyles.HeaderFirstView}>
                    <TouchableOpacity
                        style={CommonStyles.HeaderMenuicon}
                        onPress={() => { navigation.openDrawer(); }}>
                        <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                            source={require('../../../../assets/images/menu_b.png')}>
                        </Image>
                    </TouchableOpacity>

                    <View
                        style={CommonStyles.HeaderTextView}>
                        <Text
                            style={CommonStyles.HeaderTextstyle}>
                            Notice Board
                        </Text>
                    </View>
                </View>
                <View
                    style={NoticeStyle.createNoticeButtonContainer}>
                    <View
                        style={NoticeStyle.ApplyButtonContainer}>
                        <TouchableOpacity
                            onPress={() => goToCreateNotice()}
                            style={NoticeStyle.ApplyButtonTouch}>
                            <View style={NoticeStyle.plusButton}>
                                <FontAwesome
                                    name="plus" size={Platform.OS === 'ios' ? 16.6 : 18} color="#ffffff">
                                </FontAwesome>
                            </View>
                            <View style={NoticeStyle.ApplyTextButton}>
                                <Text style={NoticeStyle.ApplyButtonText}>
                                    NOTICE
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            <View style={{ flex: 1, }}>
                {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={NoticeStyle.loaderIndicator} />) : null}
                <ScrollView
                    keyboardShouldPersistTaps='always'
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                        />
                    }>
                    <View style={{ flex: 1, padding: 10, }}>
                        {renderHeader()}
                        <FlatList
                            data={noticeList}
                            keyExtractor={(x, i) => i.toString()}
                            renderItem={({ item }) =>

                                <TouchableOpacity onPress={() => goToDetail(item)}>
                                    <View
                                        style={NoticeStyle.listContainer}>
                                        {item.ImageFileName === "" ?
                                            <View style={NoticeStyle.listDivider}>
                                                <View style={NoticeStyle.noticepart}>
                                                    <Text style={{}}>{item.Details}</Text>
                                                </View>

                                            </View> : <View style={{
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

                                                    {item.CreateDate}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </ScrollView>
            </View>

        </View>
    );
}

export default Notice;