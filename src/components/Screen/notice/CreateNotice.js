import React, { Component } from 'react';
import { ScrollView, Text, View, Image, StatusBar, ActivityIndicator, ToastAndroid, BackHandler, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
import { GetDepartmentByCompanyId } from "../../../services/DepartmentService";
import {
    MaterialCommunityIcons
} from '@expo/vector-icons'
import _ from "lodash";
import ImageViewer from 'react-native-image-zoom-viewer';
import { urlDev, urlResource } from '../../../services/api/config';
import Entypo from 'react-native-vector-icons/Entypo'
import { CommonStyles } from '../../../common/CommonStyles';
import { NoticeStyle } from './NoticeStyle';
import { SaveNotice } from '../../../services/Notice';
import { Modal as Modal1 } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { useSelector } from "react-redux";
import LocalStorage from '../../../common/LocalStorage';
import { useState } from 'react';
import { useEffect } from 'react';
import { Checkbox } from 'react-native-paper';

var tempCheckValues = [];
var cListforcheckbox = [];
const numColumns = 2;
const CreateNotice = ({ navigation, route }) => {

    const user = useSelector((state) => state.user.currentUser);
    const [companyId, setcompanyId] = useState('');
    const [details, setdetails] = useState('');
    const [ImageFileName, setImageFileName] = useState('');
    const [progressVisible, setprogressVisible] = useState(false);
    const [departmentList, setdepartmentList] = useState([]);
    const [checkBoxChecked, setcheckBoxChecked] = useState([]);
    const [test, settest] = useState({ CheckBoxList: [] });
    const [images, setimage] = useState(null);
    const [Imageparam, setImageparam] = useState('resourcetracker');
    const [NoticeId, setNoticeId] = useState(null);
    const [isModelVisible, setisModelVisible] = useState(false);
    const [modalfordept, setmodalfordept] = useState(false);
    const [modalForImage, setmodalForImage] = useState(false);


    const goBack = () => {
        navigation.navigate('Notice');
    }

    useEffect(() => {
        (async () => {
            const cId = await LocalStorage.GetData("companyId");
            setcompanyId(cId);
            getDepartment("1")
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        })();

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [])

    const saveNotice = async () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                return ToastAndroid.show('Plese Connect the Internet', ToastAndroid.TOP);
            }
        });
        if (details === "" || ImageFileName === "") return ToastAndroid.show('Please fill all the field', ToastAndroid.TOP);
        try {
            let noticeModel = {
                CreatedBy: user?.Id,
                CompanyId: companyId,
                Details: details,
                DepartmentIdList: test.CheckBoxList,
                ImageFileName: ImageFileName,
            };
            setprogressVisible(true);
            await SaveNotice(noticeModel)
                .then(res => {
                    setprogressVisible(false);
                    ToastAndroid.show('Notice saved successfully', ToastAndroid.TOP);
                    setdetails('');
                    setImageFileName('');
                    navigation.navigate('Notice');
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
    const checkBoxChanged = (Value, value, isChecked) => {
        setcheckBoxChecked(tempCheckValues);
        var tempCheckBoxChecked = checkBoxChecked;
        tempCheckBoxChecked[Value] = !value;
        setcheckBoxChecked(tempCheckBoxChecked);

        if (isChecked) {
            cListforcheckbox.push(Value);
        } else {

            for (let index = 0; index < cListforcheckbox.length; index++) {
                const element = cListforcheckbox[index];

                if (element == Value) {
                    cListforcheckbox.splice(index, 1);
                }

            }
        }
        // { this.setState(Object.assign(test, { CheckBoxList: cListforcheckbox })) }
        settest({ CheckBoxList: cListforcheckbox })
        // this.setState({ CheckBoxList: cList })
        console.log(tempCheckValues, '......test1')
        console.log(test.CheckBoxList, '......test')
    }
    const handleBackButton = () => {
        navigation.navigate('Notice');
        return true;
    }

    const openModaldept = () => {
        setmodalfordept(true);
    }
    const closeModaldept = () => {
        setmodalfordept(false);
    }
    const closeModaledpt = () => {
        setmodalfordept(false);
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
                setimage(urlResource + response.ImagePath);
                setImageFileName(response?.ImagePath);
                setprogressVisible(false);
                ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);
            })
            .catch(error => {
                setprogressVisible(false);
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
                // this.errorToast();
            });
    };
    const imageViewer = () => {
        setisModelVisible(true);
    }
    const gotoBordDetail = (item) => {
        setimage([{ url: item }]);
        imageViewer();
    }
    const ShowModalFunction = (visible) => {
        setisModelVisible(false);
    }

    const getDepartment = async (cid) => {
        try {

            await GetDepartmentByCompanyId(cid)
                .then(res => {
                    console.log('comlen', res.result);
                    if (res.result !== null) {
                        console.log('comlen2', res.result);
                        if (res.result.length > 0) {
                            const depList = [];
                            res.result.forEach(function (item) {
                                const ob = {
                                    'Text': item.DepartmentName,
                                    'Value': item.Id
                                }
                                depList.push(ob);
                            });
                            setdepartmentList(depList);
                            console.log(departmentList, 'testcall')
                        }
                    } else {
                        setdepartmentList([]);
                    }
                })
                .catch(() => {
                    console.log("error occured");
                });
        } catch (error) {
            console.log(error);
        }
    }

    const rendercheckbox = () => {

        return (
            departmentList?.map((val) => {
                { tempCheckValues[val.Value] = false }

                return (
                    <View
                        key={val.Value}
                        style={{
                            // flex: 1,
                            flexDirection: 'row',
                            padding: 5,
                            alignSelf: 'center',
                        }}>
                        <Checkbox
                            // value={checkBoxChecked[val.Value]}
                            status={ 'checked' }
                            onPress={(value) =>
                                checkBoxChanged(val.Value,
                                    checkBoxChecked[val.Value], value)}
                        />
                        <Text style={{ marginTop: 6, color: '#636363', }}>{val.Text}</Text>
                    </View >
                )
            }
            )
        );
    }

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
                            source={require('../../../../assets/images/left_arrow.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={CommonStyles.HeaderTextView}>
                        <Text
                            style={CommonStyles.HeaderTextstyle}>
                            CREATE NOTICE
                        </Text>
                    </View>
                </View>

                <View
                    style={NoticeStyle.createNoticeButtonContainer}>
                    <View
                        style={NoticeStyle.ApplyButtonContainer}>
                        <TouchableOpacity
                            onPress={() => saveNotice()}
                            style={NoticeStyle.ApplyButtonTouch}>
                            <View style={NoticeStyle.plusButton}>
                                <MaterialCommunityIcons name="content-save" size={Platform.OS === 'ios' ? 15.3 : 17.5} color="#ffffff" />
                            </View>
                            <View style={NoticeStyle.ApplyTextButton}>
                                <Text style={NoticeStyle.ApplyButtonText}>
                                    PUBLISH
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>


            {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={NoticeStyle.loaderIndicator} />) : null}

            <KeyboardAvoidingView enabled style={NoticeStyle.createnoticecontainer}>
                {/* <View style={NoticeStyle.createnoticecontainer}> */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={NoticeStyle.selectContainer}>
                        <TouchableOpacity onPress={() => openmodalForImage()}
                            style={NoticeStyle.opencemarTouchableopacity}>
                            <View>
                                <Image resizeMode='contain'
                                    style={NoticeStyle.opencemarastle}
                                    source={require('../../../../assets/images/camera_white.png')}>
                                </Image>

                            </View>
                            <View style={NoticeStyle.selectContainerview}>
                                <Text style={NoticeStyle.selectText}>
                                    SELECT TO
                                </Text>
                                <Text style={NoticeStyle.addPhotoText1}>
                                    ADD PHOTO
                                </Text>
                            </View>
                            {/* </View> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={NoticeStyle.openDeptTouhableOpacity}>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={NoticeStyle.inputTextContainer}>


                        <TextInput
                            style={NoticeStyle.inputText}
                            multiline={true}
                            placeholderTextColor="#cbcbcb"
                            placeholder="Write your notice here..."
                            returnKeyType="next"
                            autoCorrect={false}
                            onChangeText={text => setdetails(text)}
                        />
                        <TouchableOpacity
                            style={NoticeStyle.ImageTouchableOpacity} onPress={() => { gotoBordDetail(urlResource + ImageFileName) }}>
                            <Image resizeMode='contain'
                                style={NoticeStyle.uploadImageStyle}
                                source={{ uri: urlResource + ImageFileName }}></Image>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* </View> */}
            </KeyboardAvoidingView>
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
                    <View>
                        <Text style={NoticeStyle.addPhotoText}>Add Photos</Text>
                    </View>
                    <View style={NoticeStyle.cemaraImageContainer}>
                        <TouchableOpacity onPress={() => _takePhoto()} style={{ alignItems: "center", paddingLeft: 35 }}>
                            <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../assets/images/photo_camera_black.png')}></Image>
                            <Text style={NoticeStyle.takePhotoText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => _pickImage()} style={{ alignItems: 'center', paddingRight: 35 }}>
                            <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../assets/images/Gallary.png')}></Image>
                            <Text style={NoticeStyle.takePhotoText}>From Gallary</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                style={[NoticeStyle.modalfordept]}
                position={"center"}
                isOpen={modalfordept}
                backdropPressToClose={false}
                swipeToClose={false}
            // onOpened={() => setState({ floatButtonHide: true })}
            // onClosed={() => this.setState({ floatButtonHide: false })}
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
                            onPress={() => setmodalfordept(false)}
                            style={NoticeStyle.modalClose}>
                            <Image
                                resizeMode="contain"
                                style={{
                                    width: 15, height: 15, marginRight: 17, marginTop: 15
                                }}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{}}>
                    <View style={{}}>
                        <Text style={NoticeStyle.departListText}>
                            Department List
                        </Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ height: 150 }}>
                        <View style={{}} >
                            {rendercheckbox()}

                        </View>
                    </ScrollView>
                    <TouchableOpacity style={NoticeStyle.DoneTouchableopacity} onPress={() => closeModaledpt()} >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Done</Text>
                    </TouchableOpacity>
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
                            source={require('../../../../assets/images/close.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <ImageViewer
                    saveToLocalByLongPress={true}
                    // onSave={this.saveImageToFolder( images )}
                    imageUrls={images} >
                </ImageViewer>
            </Modal1>

        </View >
    );
}

export default CreateNotice;
