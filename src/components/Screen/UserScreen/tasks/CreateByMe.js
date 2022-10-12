import React, { useEffect, useState } from 'react';
import {
    ScrollView, Alert,
    Text, View, Image, StatusBar, RefreshControl,
    BackHandler, Dimensions, TouchableOpacity,
    Platform, ActivityIndicator
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';
import _ from "lodash";
import { TaskStyle } from './TaskStyle';
import { GetCreatedByme } from '../../../../services/UserService/TaskService';
import TaskLists from "./CreatedbymeComponent"
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Searchbar from '../../../Searchbar';

var screen = Dimensions.get('window');

const CreateByMe = ({ navigation, route }) => {

    const [progressVisible, setprogressVisible] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [taskList, settaskList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const user = useSelector((state) => state.user.currentUser);
    const isFocused = useIsFocused();


    const _onRefresh = async () => {
        setrefreshing(true);
        setTimeout(function () {
            setrefreshing(false);
        }, 2000);

        getCreateByme(true);
    };

    useEffect(() => {
        getCreateByme(true);
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);


        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);

        }
    }, [isFocused])

    const handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    const searchFilterFunction = text => {
        if (text != '') {
            const newData = tempList?.filter(item => {
                const itemData = `${item.Title.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            settaskList(newData);
        } else {
            settaskList(tempList);
        }
    };

    const getCreateByme = async (isProgress) => {
        try {
            setprogressVisible(isProgress);
            await GetCreatedByme(user?.Id)
                .then(res => {
                    settaskList(res?.result);
                    setTempList(res?.result);
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
        navigation.navigate("CreateTask");
    }

    const gotoDetails = (task) => {
        navigation.navigate("ViewTask", { TaskModel: task, arrayholder: tempList });
    }
    return (
        <View
            style={TaskStyle.container}>

            <View
                style={TaskStyle.HeaderContent}>
                <View
                    style={TaskStyle.HeaderFirstView}>
                    <TouchableOpacity
                        style={TaskStyle.HeaderMenuicon}
                        onPress={() => { navigation.openDrawer(); }}>
                        <Image resizeMode="contain" style={TaskStyle.HeaderMenuiconstyle}
                            source={require('../../../../../assets/images/menu_b.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={TaskStyle.HeaderTextView}>
                        <Text
                            style={TaskStyle.HeaderTextstyle}>
                            TASK
                        </Text>
                    </View>
                </View>
                <View
                    style={TaskStyle.createTaskButtonContainer}>
                    <TouchableOpacity
                        onPress={() => goToCreateTask()}
                        style={TaskStyle.createTaskButtonTouch}>
                        <View style={TaskStyle.plusButton}>
                            <FontAwesome
                                name="plus" size={Platform.OS === 'ios' ? 16.6 : 18} color="#ffffff">
                            </FontAwesome>
                        </View>
                        <View style={TaskStyle.ApplyTextButton}>
                            <Text style={TaskStyle.ApplyButtonText}>
                                TASK
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {progressVisible == true ?
                (<ActivityIndicator size="large" color="#1B7F67"
                    style={TaskStyle.loaderIndicator} />) :
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                        />
                    }
                >
                    {<Searchbar searchFilterFunction={searchFilterFunction}/>}
                    <TaskLists itemList={taskList} />
                </ScrollView>
            }
        </View >
    )
}
export default CreateByMe;
