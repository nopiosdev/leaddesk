
import React, { Component, useEffect, useState } from 'react';

import {
    ScrollView, Text, View, StatusBar, ActivityIndicator, Image,
    BackHandler, TextInput, TouchableOpacity,
    ToastAndroid, Platform, KeyboardAvoidingView, FlatList
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { EmployeeList } from '../../../services/EmployeeTrackService';
import { NoticeStyle } from '../notice/NoticeStyle'
import Modal from 'react-native-modalbox';
import { Modal as Modal1 } from 'react-native';
import moment from "moment";
import { CommonStyles } from '../../../common/CommonStyles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { urlDev, urlResource } from '../../../Utils/config';
import ImageViewer from 'react-native-image-zoom-viewer';
import Entypo from 'react-native-vector-icons/Entypo'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import _ from "lodash";

import * as ImagePicker from 'expo-image-picker'
import { useIsFocused } from '@react-navigation/native';
import { TaskStyle } from './TaskStyle';
import { SaveTask, PriorityList } from '../../../services/TaskService';
import { useSelector } from "react-redux";
import LocalStorage from '../../../common/LocalStorage';
import CustomImagePicker from '../../../components/CustomImagePicker';
import Header from '../../../components/Header';






const numColumns = 2;
const CreateTask = ({ navigation, route }) => {
    const user = useSelector((state) => state.user.currentUser);
    const [modalForImage, setmodalForImage] = useState(false);
    const [companyId, setcompanyId] = useState("");
    const [TaskId, setTaskId] = useState(null);
    const [date, setdate] = useState(Date.now());
    const [taskTitle, settaskTitle] = useState("");
    const [taskDescription, settaskDescription] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [priorityList, setpriorityList] = useState([]);
    const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false);
    const [PriorityId, setPriorityId] = useState(null);
    const [PriorityName, setPriorityName] = useState(null);
    const [touchabledisableForsaveTask, settouchabledisableForsaveTask] = useState(false);
    const [EmpName, setEmpName] = useState(null);
    const [EmpValue, setEmpValue] = useState(null);
    const [TaskGroupId, setTaskGroupId] = useState(0);
    const [isModelVisible, setisModelVisible] = useState(false);
    const [fileList, setfileList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(false);
    const [ImageFileName, setImageFileName] = useState(null);
    const [photo, setphoto] = useState(null);
    const [images, setimages] = useState([]);
    const [modal1, setmodal1] = useState(false);
    const [modalPriority, setmodalPriority] = useState(false);
    const isFocused = useIsFocused();


    const refreshOnBack = () => {
        // if (user?.UserType == "admin") {
        //     navigation.navigate('TaskListBottomTab', { screen: 'TaskListScreen' });
        // } else {
        //     navigation.navigate('TaskListBottomTab', { screen: 'CreateByMe' });
        // }
    }

    const goBack = () => {
        navigation.pop();
    }


    const openmodalForImage = () => {
        setmodalForImage(true);
    }

    const gotoBordDetail = (item) => {
        setimages([{ url: urlResource + item.FileName }]);
        ImageViewer();
    }

    const _showDateTimePicker = () => setisDateTimePickerVisible(true);
    const _hideDateTimePicker = () => setisDateTimePickerVisible(false);

    const _handleDatePicked = (date) => {
        setdate(date);
        _hideDateTimePicker();
    }

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            getEmployeeList(cId);
            getPriorityList();
            if (user?.UserType !== 'admin') {
                setEmpName(user?.UserFullName);
                setEmpValue(user?.Id);
            }
            // setTaskGroupId(paramsData?.BoardId);
        })();

    }, [isFocused])

    const saveTask = async () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                return ToastAndroid.show('Plese Connect the Internet', ToastAndroid.TOP);
            }
        });
        if (taskTitle === "") return ToastAndroid.show('Title Can not be Empty ', ToastAndroid.TOP);
        settouchabledisableForsaveTask(true);
        try {
            var data = new FormData();
            data.append('CreatedById', user?.Id);
            data.append('CompanyId', companyId);
            data.append('Title', taskTitle);
            data.append('Description', taskDescription);
            data.append('AssignToName', EmpName);
            data.append('AssignedToId', EmpValue);
            data.append('TaskGroupId', TaskGroupId);
            data.append('PriorityId', PriorityId === null ? '' : PriorityId);
            data.append('DueDate', !date ? null : moment(date).format("YYYYY-MM-DD"));
            data.append('taskAttachmentsModel', JSON.stringify(fileList))

            setprogressVisible(true);
            SaveTask(data)
                .then(response => {
                    console.log("TASK response", response)
                    if (response?.success) {
                        setprogressVisible(false);
                        ToastAndroid.show('Task saved successfully', ToastAndroid.TOP);
                        setcompanyId('');
                        settaskTitle('');
                        settaskDescription('');
                        setEmpName('');
                        setEmpValue('');
                        setTaskGroupId('');
                        setPriorityId('');
                        setdate('');
                        navigation.goBack();
                    }
                })
                .catch(error => {
                    setprogressVisible(false);
                    console.log("error occured");
                    settouchabledisableForsaveTask(true);
                });

        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
    }

    const getEmployeeList = async (companyId) => {
        try {
            await EmployeeList(companyId)
                .then(res => {
                    console.log('getEmployeeList',res)
                    setEmployeeList(res);
                    setprogressVisible(false);
                })
                .catch(() => {
                    setprogressVisible(false);
                });

        } catch (error) {
            console.log(error)
            setprogressVisible(false);
        }
    }

    const getPriorityList = async () => {
        try {
            await PriorityList()
                .then(res => {
                    setpriorityList(res);
                    setprogressVisible(false);

                })
                .catch(() => {
                    setprogressVisible(false);
                });

        } catch (error) {
            setprogressVisible(false);
        }
    }

    const setAssignTo = async (v, t) => {
        setEmpName(t);
        setEmpValue(v);
        setmodal1(false);
    }

    const renderEmpList = () => {
        let content = employeeList?.map((empName, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { setAssignTo(empName.Id, empName.EmployeeName) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={empName.Id}>{empName.EmployeeName}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }

    const setPriority = async (id, name) => {
        setPriorityId(id);
        setPriorityName(name);
        setmodalPriority(false);
    }

    const renderPriorityList = () => {
        let content = priorityList?.map((x, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { setPriority(x.Id, x.Name) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={x.Id}>{x.Name}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }

    const ImageViewer = () => {
        setisModelVisible(true);
    }

    const ShowModalFunction = (visible) => {
        setisModelVisible(false);
    }
    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                style={{
                    //  backgroundColor: 'gray',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "45%",
                    margin: 5,
                    alignItems: 'center',
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: 'gray',
                    marginLeft: 10,
                    height: 200,
                }}
                onPress={() => { gotoBordDetail(item) }}
            >
                <View>

                    <Image style={{ height: 150, width: 150, }} resizeMode='cover'
                        source={{ uri: urlResource + item.FileName }} >
                    </Image>

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', flexDirection: 'column' }}>

            <Header
                title={'Create Task'}
                navigation={navigation}
                goBack={true}
                onPress={() => { navigation.goBack() }}
                btnAction={() => saveTask()}
                btnTitle='POST'
                saveImg={true}                
            />

            <View style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                    style={{ flex: 1, }}>
                    <View
                        style={TaskStyle.titleInputRow}>
                        <Text
                            style={TaskStyle.createTaskTitleLabel1}>
                            Title:
                        </Text>
                        <TextInput
                            style={TaskStyle.createTaskTitleTextBox1}
                            placeholder="Name"
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                            onChangeText={text => settaskTitle(text)}
                            value={taskTitle}
                        >
                        </TextInput>
                    </View>
                    <View
                        style={TaskStyle.descriptionInputRow}>
                        <Text
                            style={TaskStyle.createTaskTitleLabel11}>
                            Description:
                        </Text>
                        <TextInput
                            style={TaskStyle.createTaskDescriptionTextBox}
                            multiline={true}
                            placeholder="Descripttion..."
                            placeholderTextColor="#dee1e5"
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={text => settaskDescription(text)}
                            value={taskDescription}
                        >
                        </TextInput>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{ flex: 1, flexDirection: 'column', }}>
                            <TouchableOpacity onPress={() => { user?.UserType === 'admin' && setmodal1(true) }}>
                                <View style={TaskStyle.assignePeopleContainer}>
                                    <Ionicons name="md-people" size={20} style={{ marginRight: 4, }} color="#4a535b" />
                                    <TextInput
                                        style={TaskStyle.assigneePeopleTextBox}
                                        placeholder="Assign People"
                                        placeholderTextColor="#dee1e5"
                                        editable={false}
                                        autoCapitalize="none"
                                        value={EmpName}
                                    >
                                    </TextInput>
                                </View>
                            </TouchableOpacity>
                            <View style={TaskStyle.assigneePeopleTextBoxDivider}>
                                {/* horizontal line dummy view */}
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', }}>
                            <TouchableOpacity onPress={() => setmodalPriority(true)}>
                                <View
                                    style={TaskStyle.assignePeopleContainer}>
                                    <MaterialCommunityIcons name="priority-high" size={18} style={{ marginHorizontal: 5, }} color="#4a535b" />
                                    <TextInput
                                        style={TaskStyle.assigneePeopleTextBox}
                                        placeholder="Priority"
                                        placeholderTextColor="#dee1e5"
                                        editable={false}
                                        autoCapitalize="none"
                                        value={PriorityName}
                                    >
                                    </TextInput>
                                </View>
                            </TouchableOpacity>
                            <View style={TaskStyle.assigneePeopleTextBoxDivider}>
                                {/* horizontal line dummy view */}
                            </View>
                        </View>

                    </View>
                    <View
                        style={TaskStyle.createTaskAttachmentContainer}>

                        <View style={TaskStyle.createTaskDueDateContainer}>
                            <TouchableOpacity onPress={_showDateTimePicker}
                                style={TaskStyle.createTaskDueDateIcon}>
                                <MaterialCommunityIcons name="clock-outline" size={18} color="#4a535b"
                                    style={{ marginHorizontal: 5, }} />
                                {date === "" ?
                                    <Text
                                        style={TaskStyle.createTaskDueDateText}>
                                        Due Date:
                                    </Text> :
                                    <Text
                                        style={TaskStyle.createTaskDueDateText}>
                                        {moment(date).format("DD MMMM YYYY")}
                                    </Text>
                                }

                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={isDateTimePickerVisible}
                                onConfirm={_handleDatePicked}
                                onCancel={_hideDateTimePicker}
                                mode={'date'}
                            />
                            <View
                                style={TaskStyle.Viewforavoid}>
                            </View>
                        </View>

                    </View>
                    <View
                        style={{
                            width: "95%",
                            borderRadius: 4, backgroundColor: "#ffffff",
                            alignItems: 'center', justifyContent: 'space-between',
                            // padding: 8,
                            paddingVertical: 7,
                            marginTop: 4, marginBottom: 4,
                            marginHorizontal: 10, flexDirection: 'row',
                            borderBottomColor: '#f6f7f9', borderBottomWidth: 1,
                            //  height: 30,
                        }}>
                        <View
                            style={{
                                justifyContent: 'flex-start', flexDirection: 'row',
                                marginLeft: 18, alignItems: 'center',
                            }}>
                            <Entypo name="attachment" size={14} color="black"
                                style={{ marginRight: 10, }} />
                            <Text
                                style={TaskStyle.viewTaskAttachmentLeftIcon}>
                                Attachments
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => openmodalForImage()}
                            style={TaskStyle.viewTaskAttachmentPlusIcon}>
                            <Image
                                style={{ width: 20, height: 20 }} resizeMode='contain'
                                source={require('../../../../assets/images/leftPlusBig.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    {progressVisible == true ? (<ActivityIndicator size="large"
                        color="#1B7F67" style={TaskStyle.loaderIndicator} />) : null}
                    <View style={TaskStyle.scrollContainerView}>
                        <FlatList
                            data={fileList}
                            keyExtractor={(i, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            style={TaskStyle.taskBoardContainer}
                            numColumns={numColumns}
                            renderItem={renderItem}

                        />
                    </View>
                    <View
                        style={TaskStyle.Viewforavoid}>
                    </View>

                </ScrollView>
            </View>

            {/* <View style={{ justifyContent: 'flex-end', }}>
                <View
                    style={{ height: 50, }}>
                </View>
                <TouchableOpacity onPress={() => saveTask()}
                    style={TaskStyle.createTaskSaveButtonContainer}>
                    <Feather name="edit" size={14}
                        style={{ marginHorizontal: 3, }}
                        color="#ffffff">
                    </Feather>
                    <Text style={TaskStyle.createTaskSaveButtonText}>
                        POST
                    </Text>
                </TouchableOpacity>
            </View> */}
            {/* </View> */}
            <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} isOpen={modal1}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodal1(false)} style={{
                            marginLeft: 0, marginTop: 0,
                        }}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={TaskStyle.dblModelContent}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                        <View style={{}} >
                            {renderEmpList()}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
            <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"}
                isOpen={modalPriority}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalPriority(false)} style={{
                            marginLeft: 0, marginTop: 0,
                        }}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={TaskStyle.dblModelContent}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                        <View style={{}} >
                            {renderPriorityList()}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
            <Modal
                style={{
                    height: 180,
                    width: 250,
                    borderRadius: 20,
                }}
                position={"center"}
                backdropPressToClose={true}
                swipeToClose={false}
                isOpen={modalForImage}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>
                    <View
                        style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => setmodalForImage(false)}
                            style={{
                                marginLeft: 0,
                                marginTop: 0,
                            }}>
                            <Image
                                resizeMode="contain"
                                style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <CustomImagePicker
                    TaskId={TaskId}
                    setfileList={setfileList}
                    fileList={fileList}
                    setprogressVisible={setprogressVisible}
                    setmodalForImage={setmodalForImage}
                />
            </Modal>
            <Modal1
                visible={isModelVisible}
                transparent={false}
                onRequestClose={() => ShowModalFunction()}>
                <View
                    style={{
                        width: "100%",
                        padding: 5,
                        backgroundColor: 'black',
                        justifyContent: 'space-between',

                    }}>
                    <View style={{ alignItems: "flex-start", }}>

                    </View>
                    <TouchableOpacity
                        style={{ alignItems: "flex-end", padding: 10 }}
                        onPress={() => ShowModalFunction()}>
                        <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                            source={require('../../../../assets/images/close.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <ImageViewer

                    saveToLocalByLongPress={false}
                    // onSave={this.saveImageToFolder( this.state.images )}
                    imageUrls={images} >
                </ImageViewer>
            </Modal1>

        </View >
    );
}

export default CreateTask;