import React, { Component, useCallback } from 'react';
import {
    Text, View, Image, StatusBar,
    BackHandler, Dimensions,
    TouchableOpacity, Platform, Alert, RefreshControl,
    ActivityIndicator, ScrollView,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from "lodash";
import { TaskStyle } from './TaskStyle';
import { GetRelatedToMeTasks } from '../../../services/TaskService';
import TaskLists from "./TaskListComponent"
import { CommonStyles } from '../../../common/CommonStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyAttendanceDetails from '../attendance/DailyAttendanceDetails';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Loader';
import Searchbar from '../../Searchbar';

const TaskList = ({ navigation, route }) => {

    const user = useSelector((state) => state.user.currentUser);
    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [isLoaded, setisLoaded] = useState(false);
    const [search, setsearch] = useState('');
    const [taskList, settaskList] = useState([]);
    const [tempList, settempList] = useState([]);

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
                    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
                })();

                return () => {
                    BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
                }
            },
            [],
        )
    )

    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
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
        setisLoaded(false);
        try {
            setprogressVisible(isProgress);
            await GetRelatedToMeTasks(userId)
                .then(res => {
                    console.log('TASK', res)
                    if (user?.UserType == 'admin') {
                        settaskList(res?.filter(x => x.StatusId !== 4 && x.StatusId !== 6 && x.StatusId !== 5))
                        settempList(res?.filter(x => x.StatusId !== 4 && x.StatusId !== 6 && x.StatusId !== 5))
                    } else {
                        settaskList(res?.filter(x => x.AssignedToId == user?.Id))
                        settempList(res?.filter(x => x.AssignedToId == user?.Id))
                    }
                    setprogressVisible(false);
                    console.log(tempList, 'taskresutl...');
                    setisLoaded(true);
                })
                .catch(() => {
                    setprogressVisible(false);
                    console.log("error occured");
                    setisLoaded(true);
                });

        } catch (error) {
            setprogressVisible(false);
            console.log(error);
            setisLoaded(true);
        }
    }

    const goToCreateTask = () => {
        navigation.navigate('CreateTask');
    }


    return (
        <>
            {isLoaded ?
                <View
                    style={TaskStyle.container}>

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
                                    TASKS
                                </Text>
                            </View>
                        </View>
                        <View
                            style={CommonStyles.createTaskButtonContainer}>
                            <TouchableOpacity
                                onPress={() => goToCreateTask()}
                                style={CommonStyles.createTaskButtonTouch}>
                                <View style={CommonStyles.plusButton}>
                                    <FontAwesome
                                        name="plus" size={Platform.OS === 'ios' ? 16.6 : 18} color="#ffffff">
                                    </FontAwesome>
                                </View>
                                <View style={CommonStyles.ApplyTextButton}>
                                    <Text style={CommonStyles.ApplyButtonText}>
                                        TASK
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={TaskStyle.loaderIndicator} />) : null}

                    {<Searchbar searchFilterFunction={searchFilterFunction} />}
                    <TaskLists itemList={taskList} refreshing={refreshing} onRefresh={_onRefresh} />
                </View >
                :
                <Loader />
            }
        </>
    )

}

export default TaskList;
