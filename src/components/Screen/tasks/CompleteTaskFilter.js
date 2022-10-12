import React, { useEffect, useState } from 'react';
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
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Searchbar from '../../Searchbar';

var screen = Dimensions.get('window');

const CompleteTaskFilter = ({ navigation, route }) => {

    const [progressVisible, setprogressVisible] = useState(false);
    const user = useSelector((state) => state.user.currentUser);
    const [refreshing, setrefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [taskList, settaskList] = useState([]);
    const [tempList, settempList] = useState([]);
    const isFocused = useIsFocused();



    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);
        getTaskList(false);
    };

    useEffect(() => {
        (async () => {
            getTaskList(true);
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })

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
                const itemData = `${item.Title.toUpperCase()} ${item.Title.toUpperCase()} ${item.Title.toUpperCase()}`;
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
            await GetRelatedToMeTasks(user.Id)
                .then(res => {
                    console.log(res)
                    settaskList(res?.filter(x => x.StatusId === 4 || x.StatusId === 5 || x.StatusId === 6));
                    settempList(res?.filter(x => x.StatusId === 4 || x.StatusId === 5 || x.StatusId === 6));
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

    const gotoDetails = (task) => {
        navigation.navigate("ViewTask", { TaskModel: task, arrayholder: tempList });
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
                        onPress={() => { navigation.openDrawer() }}>
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
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={_onRefresh}
                    />
                }
            >
                <TaskLists itemList={taskList} headerRenderer={<Searchbar searchFilterFunction={searchFilterFunction}/>} />
            </ScrollView>
        </View >
    )
}

export default CompleteTaskFilter;


