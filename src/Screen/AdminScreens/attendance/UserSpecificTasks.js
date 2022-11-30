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
import Searchbar from '../../../components/Searchbar';
import Header from '../../../components/Header';


const UserSpecificTasks = ({ navigation }) => {

    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [taskList, settaskList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const selectedEmp = useSelector((state) => state.user.selectedEmp);
    const isFocused = useIsFocused();

    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);

        }, 2000);

        getTaskList(false);
    };
    const Call = () => {
        //handler to make a call
        const args = {
            number: selectedEmp?.PhoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }

    useEffect(() => {
        (async () => {
            getTaskList(true);
        })();
    }, [isFocused])


    const searchFilterFunction = text => {
        if (text != '') {
            const newData = tempList.filter(item => {
                const itemData = `${item.Title.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            settaskList(newData);
        } else {
            settaskList(tempList);
        }
    };

    const getTaskList = async (isProgress) => {
        try {
            setprogressVisible(isProgress);
            await GetRelatedToMeTasks(selectedEmp?.UserId)
                .then(res => {
                    console.log('RESPONSE', res)
                    settaskList(res);
                    setTempList(res);
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

    return (
        <View
            style={TaskStyle.container}>
            <Header
                title={selectedEmp?.EmployeeName}
                navigation={navigation}
                goBack={true}
                onPress={() => { navigation.goBack() }}
                makeCall={Call}
            />
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
                    itemList={taskList} headerRenderer={<Searchbar searchFilterFunction={searchFilterFunction} />} pointerEvents="none" />
            }
        </View >
    )
}

export default UserSpecificTasks;
