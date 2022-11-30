import React, { Component, useCallback, useEffect, useState } from 'react';
import {
    ScrollView, Text, View, Image, StatusBar, TextInput, ToastAndroid, Alert, Dimensions, ActivityIndicator,
    BackHandler, TouchableOpacity, Platform, KeyboardAvoidingView, FlatList, RefreshControl
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Modal as Modal1 } from 'react-native'
import { TaskStyle } from './TaskStyle';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { EmployeeList } from '../../../services/EmployeeTrackService';
import { TaskStatus, SaveTask, deleteTask, PriorityList, GetTaskAttachments } from '../../../services/TaskService';
import { NoticeStyle } from '../notice/NoticeStyle'
import Modal from 'react-native-modalbox';
import moment from 'moment';
import { CommonStyles } from '../../../common/CommonStyles';
import { useSelector } from "react-redux";
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import _ from "lodash";
import { urlDev, urlResource } from '../../../Utils/config';
import LocalStorage from '../../../common/LocalStorage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Loader from '../../../components/Loader';
import CustomImagePicker from '../../../components/CustomImagePicker';
import Header from '../../../components/Header';

const { width, height } = Dimensions.get('window');


const ViewTask = ({ navigation, route }) => {
    const user = useSelector((state) => state.user.currentUser);
    const [taskModel, settaskModel] = useState({});
    const [companyId, setcompanyId] = useState(0);
    const [TaskId, setTaskId] = useState('');
    const [TaskNo, setTaskNo] = useState(0);
    const [DueDate, setDueDate] = useState('');
    const [TaskStatusList, setTaskStatusList] = useState([]);
    const [StatusId, setStatusId] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [priorityList, setpriorityList] = useState([]);
    const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false);
    const [PriorityId, setPriorityId] = useState(null);
    const [PriorityName, setPriorityName] = useState(null);
    const [StatusName, setStatusName] = useState('');
    const [Title, setTitle] = useState('');
    const [Description, setDescription] = useState('');
    const [AssignToName, setAssignToName] = useState('');
    const [isModelVisible, setisModelVisible] = useState(false);
    const [fileList, setfileList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(false);
    const [AssignedToId, setAssignedToId] = useState('');
    const [images, setimages] = useState(null);
    const paramsData = route?.params;
    const [statuscolor, setstatuscolor] = useState('');
    const [Imageparam, setImageparam] = useState("resourcetracker");
    const [modalForImage, setmodalForImage] = useState(false);
    const isFocused = useIsFocused();
    const [modal1, setmodal1] = useState(false);
    const [modalforstatus, setmodalforstatus] = useState(false);
    const [photo, setphoto] = useState(null);
    const [touchabledisableForsaveExpense, settouchabledisableForsaveExpense] = useState(false);
    const [modalPriority, setmodalPriority] = useState(false);
    const [isLoaded, setisLoaded] = useState(false);



    const numColumns = 2;

    const _showDateTimePicker = () => setisDateTimePickerVisible(true);
    const _hideDateTimePicker = () => setisDateTimePickerVisible(false);

    const _handleDatePicked = (date) => {
        setDueDate(date);
        //console.log('A date has been picked: ', moment(date).format("HH:mm:ss"));
        _hideDateTimePicker();
        //alert(moment(date).format("YYYY/MM/DD"));
    }
    const setSelectedOption = (id) => {
        switch (id) {
            case 1:
                setstatuscolor("#C4C4C4");
                break;
            case 2:
                setstatuscolor("#3D8EC5");
                break;
            case 3:
                setstatuscolor("#CB9A3A");
                break;
            case 4:
                setstatuscolor("#3DC585");
                break;
            case 5:
                setstatuscolor("#0A7A46");
                break;
            case 6:
                setstatuscolor("#A53131");
                break;
        }
    }
    console.log(paramsData?.TaskModel.Title)
    useFocusEffect(
        useCallback(
            () => {
                (async () => {
                    const cId = await LocalStorage.GetData("companyId");
                    setisLoaded(false);
                    settaskModel(paramsData?.TaskModel);
                    setTitle(paramsData?.TaskModel?.Title);
                    setDescription(paramsData?.TaskModel?.Description);
                    setAssignedToId(paramsData?.TaskModel?.AssignedToId);
                    setAssignToName(paramsData?.TaskModel?.AssignToName);
                    setStatusId(paramsData?.TaskModel?.StatusId);
                    setTaskId(paramsData?.TaskModel?.Id);
                    setDueDate(paramsData?.TaskModel?.DueDate);
                    setTaskNo(paramsData?.TaskModel?.TaskNo);
                    setPriorityName(paramsData?.TaskModel?.PriorityId === 1 ? 'Normal' : paramsData?.TaskModel?.PriorityId === 2 ? 'High' : paramsData?.TaskModel?.PriorityId === 3 ? 'Low' : 'Normal');
                    setStatusName(paramsData?.TaskModel?.StatusId === 1 ? 'Todo' : paramsData?.TaskModel?.StatusId === 2 ? 'In Progress' : paramsData?.TaskModel?.StatusId === 3 ? 'Pause' : paramsData?.TaskModel?.StatusId === 4 ? 'Completed' : paramsData?.TaskModel?.StatusId === 5 ? 'Done' : paramsData?.TaskModel?.StatusId === 6 ? 'Cancelled' : 'Todo')
                    getEmployeeList(cId);
                    setcompanyId(cId);
                    getTaskStatuslist();
                    getPriorityList();
                    getTaskAttachments(paramsData?.TaskModel?.Id)
                    setSelectedOption(paramsData?.TaskModel?.StatusId)
                    setisLoaded(true);
                })();

            },
            [isFocused],
        )
    )

    const gotoBordDetail = (item) => {
        setimages([{ url: urlResource + item.FileName }]);
        imageViewer();
    }
    const openmodalForImage = () => {
        setmodalForImage(true);
    }

    const imageViewer = () => {
        setisModelVisible(true);
    }
    const ShowModalFunction = (visible) => {
        setisModelVisible(false);
    }
    const renderEmpList = () => {
        let content = employeeList?.map((emp, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { closeModal1(emp.Id, emp.EmployeeName) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={emp.Id}>{emp.EmployeeName}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }
    const DeleteTask = async () => {
        try {
            await deleteTask(TaskId)
                .then(res => {
                    console.log('DELEDTED', res)
                    ToastAndroid.show('Task Deleted successfully', ToastAndroid.TOP);
                    navigation.goBack();
                })
                .catch(() => {
                    Alert.alert(
                        "Not Deleted",
                        "Please try again...",
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false }
                    )
                    console.log("error occured");
                });
        } catch (error) {
            console.log(error);
        }
    }
    const getPriorityList = async () => {
        try {
            await PriorityList()
                .then(res => {
                    console.log(res, "PriotyLIst.....")
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
    const alertmethod = () => {
        Alert.alert(
            "",
            'Are You Sure?',
            [
                { text: 'NO', onPress: () => console.log('Cancel Pressed!') },
                { text: 'YES', onPress: () => DeleteTask() },
            ],
            { cancelable: false }
        )
    }
    const renderstatusList = () => {
        let content = TaskStatusList?.map((item, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { closeModalforStatus(item.Id, item.Name) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={item.Id}>{item.Name}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }
    const closeModal1 = async (index, value) => {
        setAssignToName(value);
        setAssignedToId(index);
        setmodal1(false);
    }

    const closeModalforStatus = async (index, value) => {
        setStatusId(index);
        setStatusName(value);
        setSelectedOption(index);
        setmodalforstatus(false);
    }

    const getTaskStatuslist = async () => {
        try {
            await TaskStatus()
                .then(res => {
                    console.log(res, 'TaskStatusList...View');
                    setTaskStatusList(res);
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

    const saveTask = async () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                return ToastAndroid.show('Plese Connect the Internet', ToastAndroid.TOP);
            }
        });
        if (Title === "") return ToastAndroid.show('Please enter title ', ToastAndroid.TOP);
        try {
            console.log("StatusId", fileList)

            setprogressVisible(true);

            var data = new FormData();
            data.append('CreatedById', paramsData?.TaskModel.CreatedById);
            data.append('CompanyId', paramsData?.TaskModel.CompanyId);
            data.append('Title', Title);
            data.append('Description', Description);
            data.append('AssignToName', AssignToName);
            data.append('AssignedToId', AssignedToId);
            data.append('Id', paramsData?.TaskModel.Id);
            data.append('StatusId', StatusId === null ? '' : StatusId);
            data.append('TaskGroupId', paramsData?.TaskModel.TaskGroupId);
            data.append('PriorityId', PriorityId === null ? '' : PriorityId);
            data.append('DueDate', DueDate == null ? null : moment(DueDate).format("YYYYY-MM-DD"));
            data.append('taskAttachmentsModel', JSON.stringify(fileList))

            SaveTask(data).then(response => {
                console.log('SAVE', response)
                if (response?.success) {
                    setprogressVisible(false);
                    ToastAndroid.show('Task Updated successfully', ToastAndroid.TOP);
                    navigation.goBack();
                }
            })
                .catch(error => {
                    setprogressVisible(false);
                    console.log("error occured", error);
                    settouchabledisableForsaveExpense(true);
                });
        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
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
    const getEmployeeList = async (companyId) => {
        try {
            await EmployeeList(companyId)
                .then(res => {
                    console.log(res, 'Employeelist...View');
                    setEmployeeList(res);
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
    const getTaskAttachments = async (TaskId) => {
        try {
            await GetTaskAttachments(TaskId)
                .then(res => {
                    setfileList(res);
                    setprogressVisible(false);
                })
                .catch((error) => {
                    setprogressVisible(false);
                });

        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
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
                    // height: (Dimensions.get('window').width / numColumns) * .45,
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
        <>
            {isLoaded ?
                <View style={TaskStyle.viewTaskContainer}>
                    <KeyboardAvoidingView style={{ flex: 1 }}>
                        <Header
                            title={'View Task'}
                            goBack={true}
                            onPress={() => { navigation.goBack() }}
                            btnAction={() => saveTask()}
                            btnTitle='Save'
                            saveImg={true}
                            deleteAction={() => {
                                alertmethod();
                            }}
                        />
                        <View style={{ flex: 1, }}>
                            <View style={{ flex: 1, }}>
                                <View
                                    style={TaskStyle.titleInputRow}>
                                    <Text
                                        style={TaskStyle.createTaskTitleLabel1}>
                                        Title:
                                    </Text>
                                    <TextInput
                                        style={TaskStyle.createTaskTitleTextBox1}
                                        value={Title}
                                        placeholderTextColor="#dee1e5"
                                        autoCapitalize="none"
                                        onChangeText={text => setTitle(text)}
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
                                        style={TaskStyle.createTaskDescriptionTextBox1}
                                        value={Description}
                                        placeholderTextColor="#dee1e5"
                                        multiline={true}
                                        autoCapitalize="none"
                                        onChangeText={text => setDescription(text)}
                                    >
                                    </TextInput>
                                </View>
                                <View
                                    style={TaskStyle.viewTaskBodyContainer}>
                                    <View
                                        style={TaskStyle.viewTaskStatusContainer}>
                                        <Text
                                            style={TaskStyle.viewTaskStatusLabel}>
                                            Status:
                                        </Text>
                                        <TouchableOpacity onPress={() => setmodalforstatus(true)}
                                            style={[TaskStyle.viewTaskStatusCheckboxContainer, { backgroundColor: statuscolor }, { borderRadius: 5 }]}
                                        >

                                            {StatusName === "" ?
                                                <Text
                                                    style={TaskStyle.viewTaskStatusText}>
                                                    {taskModel?.StatusName}
                                                </Text> :
                                                <Text
                                                    style={TaskStyle.viewTaskStatusText}>
                                                    {StatusName}
                                                </Text>
                                            }

                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={TaskStyle.viewTaskDueDateContainer}>
                                        <Text
                                            style={TaskStyle.viewTaskDueDateLabel}>
                                            Due Date:
                                        </Text>
                                        <TouchableOpacity onPress={_showDateTimePicker}>
                                            <View
                                                style={TaskStyle.viewTaskDueDateValueContainer}>
                                                <MaterialCommunityIcons
                                                    name="clock"
                                                    size={20}
                                                    color="black"
                                                >
                                                </MaterialCommunityIcons>
                                                <Text
                                                    style={TaskStyle.viewTaskDueDateValue}>
                                                    {DueDate === null ? " " : moment(DueDate).format("DD MMMM YYYY")}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            isVisible={isDateTimePickerVisible}
                                            onConfirm={_handleDatePicked}
                                            onCancel={_hideDateTimePicker}
                                            mode={'date'}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={[TaskStyle.viewTaskBodyContainer,
                                    { marginVertical: -4, }
                                    ]}>
                                    <View
                                        style={TaskStyle.viewTaskStatusContainer}>
                                        <TouchableOpacity onPress={() => setmodalPriority(true)}>
                                            <View
                                                style={{
                                                    width: (width * 45) / 100, height: 35,
                                                    borderRadius: 5, flexDirection: 'row',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    padding: 5, backgroundColor: "#f6f7f9",
                                                }}>
                                                <MaterialCommunityIcons name="priority-high" size={18} style={{ marginHorizontal: 5, }} color="#4a535b" />
                                                <TextInput
                                                    style={[TaskStyle.assigneePeopleTextBox]}
                                                    placeholder="Select Priority"
                                                    placeholderTextColor="#4a535b"
                                                    editable={false}
                                                    autoCapitalize="none"
                                                    value={PriorityName}
                                                >
                                                </TextInput>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={TaskStyle.viewTaskDueDateContainer}>
                                        <TouchableOpacity
                                            onPress={() => setmodal1(true)}>
                                            <View
                                                style={{
                                                    width: (width * 45) / 100, height: 35,
                                                    borderRadius: 5, flexDirection: 'row',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    padding: 5, backgroundColor: "#f6f7f9",
                                                }}>
                                                <Ionicons name="md-people" size={20} style={{ marginHorizontal: 5, }} color="#4a535b" />
                                                {AssignToName === "" ?
                                                    <Text
                                                        style={[TaskStyle.assigneePeopleTextBox]}>
                                                        {taskModel.AssignToName}
                                                    </Text> :
                                                    <Text style={[TaskStyle.assigneePeopleTextBox]} numberOfLines={1}>
                                                        {AssignToName}
                                                    </Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View
                                    style={TaskStyle.viewTaskAttachmentContainer}>
                                    <View
                                        style={TaskStyle.viewTaskAttachmentInnerContainer}>
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
                                {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={TaskStyle.loaderIndicator} />) : null}
                                <View style={TaskStyle.scrollContainerView}>
                                    <FlatList
                                        data={fileList}
                                        keyExtractor={(i, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                        style={TaskStyle.taskBoardContainer}
                                        renderItem={renderItem}
                                        numColumns={numColumns}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{
                            justifyContent: 'flex-end',
                        }}>
                        </View>
                    </KeyboardAvoidingView>
                    <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"}
                        isOpen={modal1}
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
                                    {employeeList?.length > 0 ? renderEmpList() : 'sd'}
                                </View>
                            </ScrollView>
                        </View>
                    </Modal>
                    <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"}
                        backdropPressToClose={false}
                        swipeToClose={false}
                        isOpen={modalforstatus}
                    >
                        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                            <View style={{ alignItems: "flex-start" }}>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <TouchableOpacity onPress={() => setmodalforstatus(false)} style={{
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
                                    {TaskStatusList?.length > 0 && renderstatusList()}
                                </View>
                            </ScrollView>
                        </View>
                    </Modal>

                    <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} isOpen={modalPriority}
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
                        style={NoticeStyle.ImagemodalContainer}
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
                                    style={NoticeStyle.modalClose}>
                                    <Image
                                        resizeMode="contain"
                                        style={NoticeStyle.closeImage}
                                        source={require('../../../../assets/images/close.png')}>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <CustomImagePicker
                                TaskId={TaskId}
                                setfileList={setfileList}
                                fileList={fileList}
                                setprogressVisible={setprogressVisible}
                                setmodalForImage={setmodalForImage}
                            />
                        </View>
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
                                    // onPress={() => this.ShowModalFunction()}
                                    source={require('../../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                        <ImageViewer imageUrls={images} >
                        </ImageViewer>
                    </Modal1>
                </View > :
                <Loader />
            }
        </>
    )
}

export default ViewTask;
