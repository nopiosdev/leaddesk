import React, { Component, useEffect, useState } from 'react';

import {
    ScrollView, Text, View, Image,
    TextInput, ToastAndroid, Alert, FlatList,
    BackHandler, TouchableOpacity, Platform,
     ActivityIndicator,
} from 'react-native';
import { NoticeStyle } from "../../notice/NoticeStyle"
import { Modal as Modal1 } from 'react-native';
import { TaskStyle } from './TaskStyle';
import ImageViewer from 'react-native-image-zoom-viewer';
import { CommonStyles } from '../../../../common/CommonStyles';
import { EmployeeList } from '../../../../services/UserService/EmployeeTrackService';
import { TaskStatus, SaveTask, SaveFile, GetTaskAttachments } from '../../../../services/UserService/TaskService';

// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modalbox';

import moment from 'moment'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import _ from "lodash";
import { urlDev, urlResource } from '../../../../Utils/config';
import { useSelector } from 'react-redux';
import LocalStorage from '../../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';


const options = {
    title: 'Select',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const numColumns = 2;

const ViewAssignToMe = ({ navigation, route }) => {
    let _isMounted = false;
    const user = useSelector((state) => state.user.currentUser);
    const [taskModel, settaskModel] = useState({});
    const [companyId, setcompanyId] = useState(0);
    const [taskId, setTaskId] = useState('');
    const [TaskStatusList, setTaskStatusList] = useState([]);
    const [StatusId, setStatusId] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false);
    const [StatusName, setStatusName] = useState('');
    const [Title, setTitle] = useState('');
    const [Description, setDescription] = useState('');
    const [AssignToName, setAssignToName] = useState('');
    const [isModelVisible, setisModelVisible] = useState(false);
    const [fileList, setfileList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(false);
    const [ImageFileName, setImageFileName] = useState('');
    const [AssignedToId, setAssignedToId] = useState('');
    const paramsData = route?.params;
    const [statuscolor, setstatuscolor] = useState('');
    const [date, setdate] = useState('');
    const [Imageparam, setImageparam] = useState("resourcetracker");
    const [modalForImage, setmodalForImage] = useState(false);
    const isFocused = useIsFocused();
    const [modal1, setmodal1] = useState(false);
    const [modalforstatus, setmodalforstatus] = useState(false);
    const [touchabledisableForsaveExpense, settouchabledisableForsaveExpense] = useState(false);
    const [images, setimages] = useState(null);


    const _showDateTimePicker = () => setisDateTimePickerVisible(true);
    const _hideDateTimePicker = () => setisDateTimePickerVisible(false);

    const _handleDatePicked = (date) => {
        setdate(moment(date).format("DD MMMM YYYYY"))
        _hideDateTimePicker();
    }

    useEffect(() => {
        (async () => {
            _isMounted = true;

            if (_isMounted) {
                settaskModel(paramsData?.TaskModel);
                setTitle(paramsData?.TaskModel.Title);
                setDescription(paramsData?.TaskModel?.Description);
                setAssignedToId(paramsData?.TaskModel?.AssignedToId);
                setAssignToName(paramsData?.TaskModel?.AssignToName);
                setStatusId(paramsData?.TaskModel?.StatusId);
                setTaskId(paramsData?.TaskModel?.Id);
            }

            const cId = await LocalStorage.GetData("companyId");
            getEmployeeList(cId);
            setcompanyId(cId);
            getTaskStatuslist();
            getPriorityList();
            getTaskAttachments(paramsData?.TaskModel?.Id)
            setSelectedOption(paramsData?.TaskModel?.StatusName);

            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();

        return () => {
            _isMounted = false;
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [isFocused])

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

    const gotoBordDetail = (item) => {
        setimages([{ url: urlResource + item.FileName }]);
        ImageViewer();
    }
    const openmodalForImage = () => {
        setmodalForImage(true);
    }

    const handleBackButton = () => {
        navigation.goBack();
        return true;
    }

    const ImageViewer = () => {
        setisModelVisible(true);
    }
    const ShowModalFunction = (visible) => {
        setisModelVisible(false);
    }

    const callsave = () => {
        if (ImageFileName !== "") {
            saveFile();
        }
        saveTask();
    }

    const getTaskAttachments = async (TaskId) => {
        try {
            //setState({ progressVisible: isProgress });
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
    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                style={{
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
                    setState({ ImageFileName: "" });
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

                handleUploadPhoto(source)
            }
        });

    };

    const handleUploadPhoto = async (pickerResult) => {

        const userToken = await LocalStorage.GetData("userToken");
        console.log(pickerResult.uri, '...............send')
        var data = new FormData();
        data.append('BlobName', {
            uri: pickerResult.uri,
            name: 'my_photo.jpg',
            type: 'image/jpg'
        })
        setprogressVisible(true);
        fetch(urlDev + "RtTaskApi/UploadDocuments?containerName=" + Imageparam, {
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
                let attachmentModel = {
                    TaskId: taskId,
                    FileName: response.ImagePath,
                    BlobName: response.ImagePath,
                }
                console.log("upload succes", response);
                setfileList(fileList.concat(attachmentModel));
                setImageFileName(response.ImagePath)
                setprogressVisible(false);
                ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);

                console.log(response.ImagePath, 'return..............');
            })
            .catch(error => {
                setprogressVisible(false);
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
            });
    };


    const goBack = () => {
        navigation.goBack();
    }

    const renderEmpList = () => {
        let content = employeeList?.map((emp, i) => {
            return (
                <TouchableOpacity style={{
                    paddingVertical: 7,
                    borderBottomColor: '#D5D5D5', borderBottomWidth: 2
                }}
                    key={i}
                    onPress={() => { closeModal1(emp.Value, emp.Text) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]}
                        key={emp.Value}>
                        {emp.Text}
                    </Text>
                </TouchableOpacity>
            )
        });
        return content;
    }


    const renderstatusList = () => {
        let content = TaskStatusList?.map((item, i) => {
            return (
                <TouchableOpacity style={{
                    paddingVertical: 7, borderBottomColor: '#D5D5D5',
                    borderBottomWidth: 2
                }} key={i}
                    onPress={() => { closeModalforStatus(item.Id, item.Name) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]}
                        key={item.Id}>
                        {item.Name}
                    </Text>
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

    const getTaskStatuslist = async () => {
        try {
            await TaskStatus()
                .then(res => {
                    setTaskStatusList(res?.result);
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

    const getPriorityList = async () => {
        try {
            await PriorityList()
                .then(res => {
                    setpriorityList(res?.result);
                    setprogressVisible(false);
                    console.log(res.result, "PriotyLIst.....")
                })
                .catch(() => {
                    setprogressVisible(false);
                });

        } catch (error) {
            setprogressVisible(false);
        }
    }
    
    const saveTask = async() => {
        if (Title !== "") {
            try {
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
                    DueDate: paramsData?.TaskModel.DueDate == null ? null : moment(paramsData?.TaskModel.DueDate).format("YYYYY-MM-DD")
                };
                console.log(taskModel, '....taskmodel....')
                setprogressVisible(true);
                const userToken = await LocalStorage.GetData("userToken");
                var data = new FormData();
                data.append('taskmodel', JSON.stringify(taskModel))
                data.append('taskAttachmentsModel', JSON.stringify(fileList))
                fetch(urlDev + "RtTaskApi/SaveTask/", {
                    headers: {
                        'Authorization': `bearer ${userToken}`,
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    },
                    method: "POST",
                    body: data
                }).then(response => {
                    setprogressVisible(false);
                    ToastAndroid.show('Task Updated successfully', ToastAndroid.TOP);
                    navigation.goBack();
                })
                    .catch(error => {
                        setprogressVisible(false);
                        console.log("error occured");
                        settouchabledisableForsaveExpense(true);
                    });

            } catch (error) {
                setprogressVisible(false);
                console.log(error);
            }
        } else {
            ToastAndroid.show('Title Can not be Empty ', ToastAndroid.TOP);
        }

    }

    const soonMsg = () => {
        ToastAndroid.show('Attachment Feature Coming Soon', ToastAndroid.TOP);
    }

    const getEmployeeList = async (companyId) => {
        try {
            //setState({ progressVisible: isProgress });
            await EmployeeList(companyId)
                .then(res => {
                    setState({ EmployeeList: res.result, progressVisible: false });
                    setEmployeeList(res?.result);
                    setprogressVisible(false);
                    console.log(EmployeeList, 'Employeelist...View');
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
            style={TaskStyle.viewTaskContainer}>

            <View
                style={CommonStyles.HeaderContent}>
                <View
                    style={CommonStyles.HeaderFirstView}>
                    <TouchableOpacity
                        style={CommonStyles.HeaderMenuicon}
                        onPress={() => { goBack() }}>
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
            <View behavior="padding" enabled style={{ flex: 1, }}>
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                    style={{ flex: 1, }}>

                    <View
                        style={TaskStyle.titleInputRow}>
                        <Text
                            style={TaskStyle.createTaskTitleLabel1}>
                            Title:
                        </Text>
                        <TextInput
                            style={TaskStyle.createTaskTitleTextBox}
                            value={Title}
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                            editable={false}
                            onChangeText={text => setTitle(text)}
                        >
                        </TextInput>
                    </View>
                    <View
                        style={TaskStyle.descriptionInputRow}>
                        <Text
                            style={TaskStyle.createTaskTitleLabel1}>
                            Description:
                        </Text>

                        <TextInput
                            style={TaskStyle.createTaskDescriptionTextBox}
                            value={Description}
                            placeholderTextColor="#dee1e5"
                            multiline={true}
                            autoCapitalize="none"
                            editable={false}
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
                            style={TaskStyle.viewTaskAttachmentPlusIcon}
                            onPress={() => _takePhoto()}
                        >
                            <Image
                                style={{ width: 20, height: 20 }} resizeMode='contain'
                                source={require('../../../../../assets/images/leftPlusBig.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={TaskStyle.loaderIndicator} />) :
                        <View style={TaskStyle.scrollContainerView}>
                            <FlatList
                                data={fileList}
                                keyExtractor={(i, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                style={TaskStyle.taskBoardContainer}
                                renderItem={renderItem}
                                numColumns={numColumns}
                            />
                        </View>}

                </ScrollView>
            </View>

            <Modal style={[TaskStyle.modalforCreateCompany1]} isOpen={modal1} position={"center"}
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
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../../assets/images/close.png')}>
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
                            <Text style={NoticeStyle.takePhotoText}>From Gallery</Text>
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

export default ViewAssignToMe;
