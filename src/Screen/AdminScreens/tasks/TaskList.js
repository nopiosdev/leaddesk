import React, { Component, useCallback } from 'react';
import {
    Text, View, Image, StatusBar,
    BackHandler, Dimensions,
    TouchableOpacity, Platform, Alert, RefreshControl,
    ActivityIndicator, ScrollView,
} from 'react-native';
import _ from "lodash";
import { TaskStyle } from './TaskStyle';
import { GetRelatedToMeTasks } from '../../../services/TaskService';
import TaskLists from "./TaskListComponent"
import { CommonStyles } from '../../../common/CommonStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyAttendanceDetails from '../attendance/DailyAttendanceDetails';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../../components/Loader';
import Searchbar from '../../../components/Searchbar';
import Header from '../../../components/Header';
import { toggleActive } from '../../../Redux/Slices/UserSlice';

const TaskList = ({ navigation, route }) => {

    const user = useSelector((state) => state.user.currentUser);
    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [taskList, settaskList] = useState([]);
    const [tempList, settempList] = useState([]);
    const dispatch = useDispatch();


    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getTaskList(user?.Id, false);
    };

    useFocusEffect(
        useCallback(
            () => {
                (async () => {
                    getTaskList(user?.Id, true);
                })();
            },
            [],
        )
    )

    const searchFilterFunction = text => {
        if (text !== '') {
            const newData = tempList?.filter(item => {
                const itemData = `${item.Title.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            settaskList(newData);
        } else {
            settaskList(tempList)
        }
    };

    const getTaskList = async (userId, isProgress) => {
        try {
            setprogressVisible(isProgress);
            await GetRelatedToMeTasks(userId)
                .then(res => {
                    console.log(res)
                    if (user?.UserType == 'admin') {
                        settaskList(res?.filter(x => x.StatusId != 4 && x.StatusId != 6 && x.StatusId != 5))
                        settempList(res?.filter(x => x.StatusId != 4 && x.StatusId != 6 && x.StatusId != 5))
                    } else {
                        settaskList(res?.filter(x => x.AssignedToId == user?.Id && x.CreatedById != user?.Id))
                        settempList(res?.filter(x => x.AssignedToId == user?.Id && x.CreatedById != user?.Id))
                    }
                    setprogressVisible(false);
                    console.log(tempList, 'taskresutl...');
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
        navigation.navigate('CreateTask');
    }


    return (
        <>
            <View style={TaskStyle.container}>
                <Header
                    title={'Tasks'}
                    onPress={() => { navigation.openDrawer() }}
                    btnAction={() => goToCreateTask()}
                    btnTitle='TASKS'
                    onGoBack={() => { dispatch(toggleActive(1)); navigation.goBack() }}
                />
                {<Searchbar searchFilterFunction={searchFilterFunction} />}
                {progressVisible == true ?
                    <ActivityIndicator size="large" color="#1B7F67" style={TaskStyle.loaderIndicator} />
                    :
                    <TaskLists itemList={taskList} refreshing={refreshing} onRefresh={_onRefresh} />
                }
            </View >
        </>
    )

}

export default TaskList;
