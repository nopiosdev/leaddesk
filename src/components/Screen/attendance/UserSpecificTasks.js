import React, { Component, useEffect } from 'react';
import { ScrollView, FlatList, Text, View, Image, StatusBar, RefreshControl, BackHandler, Dimensions, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from "lodash";
import call from 'react-native-phone-call'
import { TaskStyle } from '../tasks/TaskStyle';
import { useSelector } from "react-redux";
import { GetRelatedToMeTasks } from '../../../services/TaskService';

import TaskLists from "../tasks/TaskListComponent"
import { CommonStyles } from '../../../common/CommonStyles';
import { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';


const UserSpecificTasks = ({ navigation }) => {

    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [taskList, settaskList] = useState([]);
    const [tempList, setTempList] = useState([]);
    let arrayholder = [];
    const [search, setSearch] = useState(null);
    const user = useSelector((state) => state.user.currentUser);
    const clientId = useSelector((state) => state.user.clientId);
    const isFocused = useIsFocused();

    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);

        }, 2000);

        getTaskList(clientId, false);
    };
    const Call = () => {
        //handler to make a call
        const args = {
            number: user?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }

    useEffect(() => {
        (async () => {
            getTaskList(clientId, true);
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [isFocused])

    const handleBackButton = () => {
        navigation.navigate('DailyAttendance')
        return true;
    }

    const searchFilterFunction = text => {
        if (text != '') {
            const newData = arrayholder.filter(item => {
                const itemData = `${item.Title.toUpperCase()} ${item.Title.toUpperCase()} ${item.Title.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            settaskList(newData);
        } else {
            settaskList(tempList);
        }
    };

    const renderHeader = () => {
        return (
            <ScrollView scrollEnabled={false}>
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
            </ScrollView>
        );
    };

    const getTaskList = async (userId, isProgress) => {
        try {
            setprogressVisible(isProgress);
            await GetRelatedToMeTasks(clientId)
                .then(res => {
                    console.log('RESPONSE', res)
                    settaskList(res);
                    setTempList(res);
                    setprogressVisible(false);
                    console.log(arrayholder, 'taskresutl...');
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

    const goToCreateTask = () => {
        navigation.navigate('CreateTask')
    }


    const gotoDetails = (task) => {
        navigation.navigate('ViewAssignToMe', { TaskModel: task, arrayholder: arrayholder, })
    }

    return (
        <View
            style={TaskStyle.container}>

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
                            {user.aItemEmployeeName}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={Call}
                        style={{
                            padding: 8, paddingVertical: 2,

                        }}>
                        <Image style={{ width: 20, height: 20, alignItems: 'center', marginTop: 5, }}
                            resizeMode='contain'
                            source={require('../../../../assets/images/call.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>

            {progressVisible == true ?
                <ActivityIndicator size="large" color="#1B7F67"
                    style={TaskStyle.loaderIndicator} />
                :
                <TaskLists
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                        />
                    }
                    itemList={taskList} headerRenderer={renderHeader()} pointerEvents="none" />
            }
        </View >
    )
}

export default UserSpecificTasks;
