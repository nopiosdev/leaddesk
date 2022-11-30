import React, { useEffect, useState } from 'react';
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
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Searchbar from '../../../components/Searchbar';
import Header from '../../../components/Header';
import { toggleActive } from '../../../Redux/Slices/UserSlice';

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
        getTaskList(true);
    }, [isFocused])


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
                    if (user?.UserType == 'admin') {
                        settaskList(res?.filter(x => x.StatusId === 4 || x.StatusId === 5 || x.StatusId === 6));
                        settempList(res?.filter(x => x.StatusId === 4 || x.StatusId === 5 || x.StatusId === 6));
                    } else {
                        settaskList(res?.filter(x => x.CreatedById == user?.Id))
                        settempList(res?.filter(x => x.CreatedById == user?.Id))
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
        <View
            style={TaskStyle.container}>
            <Header
                title={'Tasks'}
                navigation={navigation}
                onPress={() => { navigation.openDrawer() }}
                onGoBack={() => { navigation.goBack() }}
                btnAction={() => goToCreateTask()}
                btnTitle='TASK'
            />
            <Searchbar searchFilterFunction={searchFilterFunction} />
            {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={TaskStyle.loaderIndicator} />) : null}
            <TaskLists itemList={taskList} refreshing={refreshing} onRefresh={_onRefresh} />
        </View >
    )
}

export default CompleteTaskFilter;


