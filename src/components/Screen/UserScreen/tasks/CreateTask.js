import React, { Component, useEffect, useState } from 'react';

import { ScrollView, Text, View, Image, BackHandler, TextInput, TouchableOpacity, ToastAndroid, Platform, FlatList, ActivityIndicator } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { MyTaskCombo } from '../../../MenuDrawer/DrawerContent';
import { EmployeeList } from '../../../../services/EmployeeTrackService';
import Modal from 'react-native-modalbox';
import moment from "moment"
import DateTimePicker from 'react-native-modal-datetime-picker';
import { urlDev, urlResource } from '../../../../services/api/config';
import ImageViewer from 'react-native-image-zoom-viewer';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker'
import _ from "lodash";
import { CommonStyles } from '../../../../common/CommonStyles';
import { TaskStyle } from './TaskStyle';
import { SaveTask, PriorityList } from '../../../../services/TaskService';
import { useSelector } from 'react-redux';
import LocalStorage from '../../../../common/LocalStorage';
import { useIsFocused } from '@react-navigation/native';
import { Modal as Modal1 } from 'react-native';




const numColumns = 2;

const CreateTask = ({ navigation, route }) => {

    const user = useSelector((state) => state.user.currentUser);
    const [modalForImage, setmodalForImage] = useState(false);
    const [companyId, setcompanyId] = useState("");
    const [TaskId, setTaskId] = useState(null);
    const [date, setdate] = useState('');
    const [taskTitle, settaskTitle] = useState("");
    const [taskDescription, settaskDescription] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [priorityList, setpriorityList] = useState([]);
    const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false);
    const [PriorityId, setPriorityId] = useState(null);
    const [PriorityName, setPriorityName] = useState(null);
    const [EmpName, setEmpName] = useState(null);
    const [EmpValue, setEmpValue] = useState(null);
    const [isModelVisible, setisModelVisible] = useState(false);
    const [fileList, setfileList] = useState([]);
    const [progressVisible, setprogressVisible] = useState(false);
    const [ImageFileName, setImageFileName] = useState(null);
    const [images, setimages] = useState([]);
    const paramsData = route?.params;
    const [modal1, setmodal1] = useState(false);
    const [modalPriority, setmodalPriority] = useState(false);
    const isFocused = useIsFocused();
    const [touchabledisableForsaveExpense, settouchabledisableForsaveExpense] = useState(false);


    const refreshOnBack = () => {
        MyTaskCombo();
        navigation.navigate('CreateByMe');

    }

    const goBack = () => {
        navigation.goBack();
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
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [isFocused])

    const handleBackButton = () => {
        goBack();
        return true;
    }

    const openmodalForImage = () => {
        setmodalForImage(true);
    }
    const _takePhoto = async () => {
        setmodalForImage(false)
        await ImagePicker.getCameraPermissionsAsync()
        await ImagePicker.getMediaLibraryPermissionsAsync();
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            // aspect: [4, 4],
            //quality: .2,
            height: 250,
            width: 250,
        });
        console.log(pickerResult, '.......................')
        if (pickerResult.cancelled == false) {
            handleUploadPhoto(pickerResult)
        }
    };
    const _pickImage = async () => {
        setmodalForImage(false)
        await ImagePicker.getCameraPermissionsAsync()
        await ImagePicker.getMediaLibraryPermissionsAsync();
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            //aspect: [4, 4],
            quality: 1,
            height: 250,
            width: 250,
        });
        if (pickerResult.cancelled == false) {
            handleUploadPhoto(pickerResult)
        }
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
        fetch(urlDev + "RtTaskApi/UploadDocuments?containerName=" + '', {
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
                    TaskId: TaskId,
                    FileName: response.ImagePath,
                    BlobName: response.ImagePath,
                }
                console.log("upload succes", response);
                setfileList(fileList.concat(attachmentModel));
                setImageFileName(response.ImagePath);
                setprogressVisible(false);
                ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);
                // Toast.showSuccess( 'Uploaded successfully', { duration: 1000 } );

                console.log(response.ImagePath, 'return..............');
                //updateEmployeeRecords();
            })
            .catch(error => {
                setprogressVisible(false);
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
                // errorToast();
            });
    };
    const saveTask = async () => {

        NetInfo.fetch().then(res => {
            if (!res.isConnected) {
                return ToastAndroid.show('Plese Connect the Internet', ToastAndroid.TOP);
            }
        });
        if (taskTitle === "") return ToastAndroid.show('Title Can not be Empty ', ToastAndroid.TOP);
        try {
            console.log("date" + date);

            let taskModel = {
                CreatedById: user?.Id,
                CompanyId: companyId,
                Title: taskTitle,
                Description: taskDescription,
                AssignToName: EmpName,
                AssignedToId: EmpValue,
                PriorityId: PriorityId,
                DueDate: date == '' ? '' : moment(date).format("YYYYY-MM-DD")
            };
            console.log(taskModel);
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
            })
                .then(response => response.json())
                .then(response => {
                    setprogressVisible(false);
                    ToastAndroid.show('Task saved successfully', ToastAndroid.TOP);
                    navigation.navigate('CreateByMe');
                })
                .catch(error => {
                    setprogressVisible(false);
                    console.log("error occured",error);
                    settouchabledisableForsaveExpense(true);
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
                    setEmployeeList(res?.result);
                    setprogressVisible(false);
                })
                .catch(() => {
                    setprogressVisible(false);
                });

        } catch (error) {
            setprogressVisible(false);
        }
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

    const setAssignTo = async (v, t) => {
        setEmpName(t);
        setEmpValue(v);
        setmodal1(false);
    }

    const renderEmpList = () => {
        let content = employeeList?.map((empName, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { setAssignTo(empName.Value, empName.Text) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={empName.Value}>{empName.Text}</Text>
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


    const imageViewer = () => {
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
        <View
            style={{
                flex: 1, backgroundColor: '#ffffff', flexDirection: 'column',
            }}>


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
                            Create Task
                        </Text>
                    </View>
                </View>
                <View
                    style={TaskStyle.createTaskButtonContainer}>
                    <TouchableOpacity
                        onPress={() => saveTask()}
                        style={TaskStyle.createTaskButtonTouch}>
                        <View style={TaskStyle.plusButton}>
                            <MaterialCommunityIcons name="content-save" size={Platform.OS === 'ios' ? 15.3 : 17.5} color="#ffffff" />
                        </View>
                        <View style={TaskStyle.ApplyTextButton}>
                            <Text style={TaskStyle.ApplyButtonText}>
                                POST
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
                            placeholder="write a task name here"
                            placeholderTextColor="#dee1e5"
                            autoCapitalize="none"
                            onChangeText={text => settaskTitle(text)}
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
                            multiline={true}
                            placeholder="write details here"
                            placeholderTextColor="#dee1e5"
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={text => settaskDescription(text)}
                        >
                        </TextInput>
                    </View>
                    <TouchableOpacity onPress={() => setmodal1(true)}>
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

                    <TouchableOpacity onPress={() => setmodalPriority(true)}>
                        <View style={TaskStyle.assignePeopleContainer}>
                           <MaterialCommunityIcons name="priority-high" size={18} style={{ marginRight: 4 }} color="#4a535b" />
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



                    <View style={TaskStyle.createTaskAttachmentContainer}>
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
                                        {moment(date).format("DD MMMM YYYYY")}
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
                                source={require('../../../../../assets/images/leftPlusBig.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    {progressVisible == true ? (<ActivityIndicator size="large"
                        color="#1B7F67" style={TaskStyle.loaderIndicator} />) :
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
                    }
                    <View
                        style={TaskStyle.Viewforavoid}>
                    </View>
                </ScrollView>
            </View>
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
                                source={require('../../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View>
                        <Text style={{
                            color: '#000000',
                            fontSize: 24,
                            textAlign: 'center',
                            fontWeight: '500'
                        }}>Add Photos</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        padding: 15, justifyContent: 'space-between',
                        paddingTop: 20,
                    }}>
                        <TouchableOpacity onPress={() => _takePhoto()} style={{ alignItems: "center", paddingLeft: 35 }}>
                            <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../../assets/images/photo_camera_black.png')}></Image>
                            <Text style={{ textAlign: 'center', marginTop: 4, color: '#7a7a7a', fontSize: 10 }}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => _pickImage()} style={{ alignItems: 'center', paddingRight: 35 }}>
                            <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../../assets/images/Gallary.png')}></Image>
                            <Text style={{ textAlign: 'center', marginTop: 4, color: '#7a7a7a', fontSize: 10 }}>From Gallary</Text>
                        </TouchableOpacity>
                    </View>
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
                            source={require('../../../../../assets/images/close.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <ImageViewer

                    saveToLocalByLongPress={false}
                    imageUrls={images} >
                </ImageViewer>
            </Modal1>
        </View >
    )
}

export default CreateTask;