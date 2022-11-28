import React, { Component, useCallback, useState } from 'react';
import {
    ScrollView, Text, View, Image,
    TextInput, ToastAndroid, Alert, Dimensions,
    BackHandler, TouchableOpacity, Platform, ActivityIndicator,
    FlatList,
} from 'react-native';
import { TaskStyle } from './TaskStyle';
import { NoticeStyle } from "../../notice/NoticeStyle"
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Modal as Modal1 } from 'react-native';
import { EmployeeList } from '../../../../services/UserService/EmployeeTrackService';
import { TaskStatus, SaveTask, deleteTask, PriorityList, SaveFile, GetTaskAttachments } from '../../../../services/UserService/TaskService';
// import Menu, { MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";
import { Menu, Divider } from 'react-native-paper';
import { CommonStyles } from '../../../../common/CommonStyles';
import ImageViewer from 'react-native-image-zoom-viewer';
import { urlResource } from '../../../../Utils/config';
import Modal from 'react-native-modalbox';
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from "lodash";
import { useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import LocalStorage from '../../../../common/LocalStorage';


const refreshOnBack = () => {
    navigation.goBack();
}
const { width, height } = Dimensions.get('window');

const options = {
    title: 'Select',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


const numColumns = 2;
const ViewTask = ({ navigation, route }) => {
    const user = useSelector((state) => state.user.currentUser);
    const [taskModel, settaskModel] = useState({});
    const [companyId, setcompanyId] = useState(0);
    const [taskId, setTaskId] = useState('');
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
    const [ImageFileName, setImageFileName] = useState('');
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
    const [showMenu, setShowMenu] = useState(false);


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
            case "To Do":
                setstatuscolor("#C4C4C4");
                break;
            case "In Progress":
                setstatuscolor("#3D8EC5");
                break;
            case "Pause":
                setstatuscolor("#CB9A3A");
                break;
            case "Completed":
                setstatuscolor("#3DC585");
                break;
            case "Done & Bill Collected":
                setstatuscolor("#0A7A46");
                break;
            case "Cancelled":
                setstatuscolor("#A53131");
                break;
        }
    }

    useFocusEffect(
        useCallback(
            () => {
                (async () => {
                    settaskModel(paramsData?.TaskModel);
                    setTitle(paramsData?.TaskModel.Title);
                    setDescription(paramsData?.TaskModel?.Description);
                    setAssignedToId(paramsData?.TaskModel?.AssignedToId);
                    setAssignToName(paramsData?.TaskModel?.AssignToName);
                    setStatusId(paramsData?.TaskModel?.StatusId);
                    setTaskId(paramsData?.TaskModel?.Id);
                    setDueDate(paramsData?.TaskModel?.DueDate);

                    const cId = await LocalStorage.GetData("companyId");
                    getEmployeeList(cId);
                    setcompanyId(cId);
                    getTaskStatuslist();
                    getPriorityList();
                    getTaskAttachments(paramsData?.TaskModel?.Id)
                    setSelectedOption(paramsData?.TaskModel?.StatusName)
                    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
                })();
                return () => {
                    BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
                }
            },
            [isFocused],
        )
    )

    const handleBackButton = () => {
        navigation.goBack();
        return true;
    }


    const gotoBordDetail = (item) => {
        setimages([{ url: urlResource + item.FileName, },]);
        imageViewer();
    }
    const imageViewer = () => {
        setisModelVisible(true);
    }
    const ShowModalFunction = (visible) => {
        setisModelVisible(false);
    }
    const getTaskAttachments = async (TaskId) => {
        try {
            await GetTaskAttachments(TaskId)
                .then(res => {
                    setfileList(res?.result);
                    setprogressVisible(false);
                    console.log("Filelist...", fileList, 'fileList...View');
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
    const callsave = () => {
        if (ImageFileName !== "") {
            saveFile();
        }
        saveTask();
    }
    const saveFile = async () => {
        try {
            let fileModel = {
                TaskId: paramsData?.TaskModel.Id, //TaskId,
                FileName: ImageFileName,
                BlobName: ImageFileName,
                UpdatedById: paramsData?.TaskModel.CreatedById,
            };
            console.log(fileModel, '....fileModel....')
            await SaveFile(fileModel)
                .then(res => {
                    setprogressVisible(false);
                    ToastAndroid.show('Task Updated successfully', ToastAndroid.TOP);
                    setImageFileName('');
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

    const _takePhoto = async () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                handleUploadPhoto(source)
                //   this.setState({
                //     avatarSource: source,
                //   });
            }
        });

    };

    const handleUploadPhoto = async (pickerResult) => {

        const userToken = await LocalStorage.GetData("userToken");
        console.log(pickerResult.uri, '...............send')
        var data = new FormData();
        data.append('my_photo', {
            uri: pickerResult.uri,
            name: 'my_photo.jpg',
            type: 'image/jpg'
        })
        setprogressVisible(true);
        fetch(urlResource + Imageparam, {
            headers: {
                'Authorization': `bearer ${userToken}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(response => {
                console.log("upload succes", response);
                let attachmentModel = {
                    TaskId: taskId,
                    FileName: response.ImagePath,
                    BlobName: response.ImagePath,
                }
                console.log("upload succes", response);
                setfileList(fileList.concat(attachmentModel));
                setImageFileName(response.ImagePath)
                // this.setState({ image: urlResource + response.ReturnCode });
                // this.setState({ ImageFileName: response.ReturnCode });
                setprogressVisible(false);
                ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);
                console.log(response.ReturnCode, 'return..............');
                //this.updateEmployeeRecords();
            })
            .catch(error => {
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
            });
    };


    const openmodalForImage = () => {
        setmodalForImage(true);
    }

    const soonMsg = () => {
        ToastAndroid.show('Attachment Feature Coming Soon', ToastAndroid.TOP);
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

                    {/* <View style={{ justifyContent: 'center', flex: 8, marginTop: 10, }}>
                        <View style={{ alignItems: 'center', }}>
                            <Text style={{ fontSize: 20, color: '#ffffff', textAlign: 'center' }}>{item.Name}</Text>
                        </View>
                    </View> */}

                    <Image style={{ height: 200, width: 200, }} resizeMode='cover'
                        source={{ uri: urlResource + item.FileName }} >
                    </Image>
                    {/* <Image style={{ }} resizeMode='contain' source={require(FilePath)} >
                        </Image> */}

                </View>
            </TouchableOpacity>
        );
    };


    const renderEmpList = () => {
        let content = employeeList?.map((emp, i) => {
            return (
                <TouchableOpacity style={{
                    paddingVertical: 7, borderBottomColor: '#D5D5D5',
                    borderBottomWidth: 2
                }} key={i}
                    onPress={() => { closeModal1(emp.Value, emp.Text) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]}
                        key={emp.Value}>{emp.Text}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }
    const DeleteTask = async () => {
        try {
            await deleteTask(taskId)
                .then(res => {
                    Alert.alert(
                        "",
                        "successfully Deleted",
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false }
                    )
                    console.log("sucessDelete............");
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
        setSelectedOption(value);
        setmodalforstatus(false);
    }

    const setPriority = async (id, name) => {
        setPriority(id);
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

    const getPriorityList = async () => {
        try {
            await PriorityList()
                .then(res => {
                    setpriorityList(res?.result);
                    setprogressVisible(false);
                })
                .catch(() => {
                    setprogressVisible(false);
                });

        } catch (error) {
            setprogressVisible(false);
        }
    }

    const getTaskStatuslist = async () => {

        try {
            //this.setState({ progressVisible: isProgress });
            await TaskStatus()
                .then(res => {
                    setTaskStatusList(res.result);
                    setprogressVisible(false);
                    console.log(TaskStatusList, 'TaskStatusList...View');
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
        if (Title !== "") {
            try {
                console.log("due date" + DueDate)
                let taskModel = {
                    CreatedById: paramsData?.TaskModel.CreatedById,
                    CompanyId: paramsData?.TaskModel.CompanyId,
                    Title: Title,
                    Description: Description,
                    AssignToName: AssignToName,
                    AssignedToId: AssignedToId,
                    Id: paramsData?.TaskModel.Id,
                    StatusId: StatusId,
                    TaskGroupId: paramsData?.TaskModel.TaskGroupId,
                    PriorityId: PriorityId,
                    DueDate: DueDate == null ? null : moment(DueDate).format("YYYYY-MM-DD")
                };
                console.log(taskModel, '....taskmodel....')
                setprogressVisible(true);
                await SaveTask(taskModel)
                    .then(res => {
                        setprogressVisible(false);
                        ToastAndroid.show('Task Updated successfully', ToastAndroid.TOP);

                        refreshOnBack();
                    })
                    .catch(() => {

                        setprogressVisible(false);
                        console.log("error occured");
                    });

            } catch (error) {
                setprogressVisible(false);
                console.log(error);
            }
        } else {
            ToastAndroid.show('Title Can not be Empty ', ToastAndroid.TOP);
        }

    }
    const getEmployeeList = async (companyId) => {

        try {
            //this.setState({ progressVisible: isProgress });
            await EmployeeList(companyId)
                .then(res => {
                    setEmployeeList(res?.result);
                    setprogressVisible(false);
                    console.log(employeeList, 'Employeelist...View');
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

    let textRef = React.createRef();
    let menuRef = null;
    // const setMenuRef = ref => menuRef = ref;
    // const hideMenu = () => menuRef.hide();
    // const showMenu = () => menuRef.show(textRef.current, stickTo = Position.TOP_RIGHT);
    // const onPress = () => showMenu();


    // const DeleteTask = () => {
    //     hideMenu();
    //     alertmethod();
    // }
    return (
        <View
            style={TaskStyle.viewTaskContainer}>
            <View
                style={CommonStyles.HeaderContent}>

                <View
                    style={CommonStyles.HeaderFirstView}>
                    <TouchableOpacity
                        style={CommonStyles.HeaderMenuicon}
                        onPress={() => { handleBackButton() }}>
                        <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                            source={require('../../../../../assets/images/left_arrow.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={CommonStyles.HeaderTextView}>
                        <Text
                            style={CommonStyles.HeaderTextstyle}>
                            VIEW TASK
                        </Text>
                    </View>
                </View>
                <View
                    style={TaskStyle.createTaskButtonContainer}>
                    <TouchableOpacity
                        onPress={() => callsave()}
                        style={TaskStyle.createTaskButtonTouch}>
                        <View style={TaskStyle.plusButton}>
                            <MaterialCommunityIcons name="content-save" size={Platform.OS === 'ios' ? 15.3 : 17.5} color="#ffffff" />

                        </View>
                        <View style={TaskStyle.ApplyTextButton}>
                            <Text style={TaskStyle.ApplyButtonText}>
                                SAVE
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={{ flex: 1, }}>
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                    style={{ flex: 1, }}>
                    <View
                        style={TaskStyle.titleInputRow}>
                        <Text
                            style={TaskStyle.createTaskTitleLabel}>
                            Title:
                        </Text>
                        <TextInput
                            style={TaskStyle.createTaskTitleTextBox}
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
                            style={TaskStyle.createTaskTitleLabel}>
                            Description:
                        </Text>
                        <TextInput
                            style={TaskStyle.createTaskDescriptionTextBox}
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

                                style={[TaskStyle.viewTaskStatusCheckboxContainer, { backgroundColor: statuscolor }, { borderRadius: 5 }]}>

                                {StatusName === "" ?
                                    <Text
                                        style={TaskStyle.viewTaskStatusText}>
                                        {taskModel.StatusName}
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
                            {/* style={TaskStyle.viewTaskDueDateContainer} */}
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
                                        <Text
                                            style={[TaskStyle.assigneePeopleTextBox]}>
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
                            onPress={() => _takePhoto()}
                            style={TaskStyle.viewTaskAttachmentPlusIcon}>
                            <Image
                                style={{ width: 20, height: 20 }} resizeMode='contain'
                                source={require('../../../../../assets/images/leftPlusBig.png')}>
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
                </ScrollView>
            </View >
            <Modal style={[TaskStyle.modalforCreateCompany1]}
                position={"center"}
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
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                source={require('../../../../../assets/images/close.png')}>
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
            <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} isOpen={modalforstatus}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ alignItems: "flex-start" }}>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => setmodalforstatus(false)} style={{
                            marginLeft: 0, marginTop: 0,
                        }}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={TaskStyle.dblModelContent}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                        <View style={{}} >
                            {renderstatusList()}
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
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../../assets/images/close.png')}>
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
                isOpen={modalForImage}
                backdropPressToClose={true}
                swipeToClose={false}
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
                                source={require('../../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View>
                        <Text style={NoticeStyle.addPhotoText}>Add Photos</Text>
                    </View>
                    <View style={NoticeStyle.cemaraImageContainer}>
                        <TouchableOpacity onPress={() => _takePhoto()} style={{ alignItems: "center", paddingLeft: 35 }}>
                            <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../../assets/images/photo_camera_black.png')}></Image>
                            <Text style={NoticeStyle.takePhotoText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => _pickImage()} style={{ alignItems: 'center', paddingRight: 35 }}>
                            <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../../assets/images/Gallary.png')}></Image>
                            <Text style={NoticeStyle.takePhotoText}>From Gallary</Text>
                        </TouchableOpacity>
                    </View>
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
                        <Image resizeMode="contain" style={{ width: 15, height: 15 }}
                            // onPress={() => ShowModalFunction()}
                            source={require('../../../../../assets/images/close.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <ImageViewer imageUrls={images} >
                </ImageViewer>
            </Modal1>

        </View >
    )
}

export default ViewTask;

