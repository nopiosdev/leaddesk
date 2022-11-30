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
import { urlDev, urlResource } from '../../../Utils/config';
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
import CustomImagePicker from '../../../components/CustomImagePicker';
import Header from '../../../components/Header';

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
            // getDepartment("1")
        })();
    }, [])

    const saveNotice = async () => {
        if (!details) return ToastAndroid.show('Please fill all the field', ToastAndroid.TOP);
        if (!ImageFileName) return ToastAndroid.show('Please select image', ToastAndroid.TOP);
        try {
            var data = new FormData();
            data.append('CreatedById', user?.Id);
            data.append('CompanyId', companyId);
            data.append('Details', details);
            // data.append('DepartmentIdList', test.CheckBoxList);
            data.append('ImageFileName', ImageFileName);

            setprogressVisible(true);
            await SaveNotice(data)
                .then(res => {
                    console.log('SaveNotice', res)
                    setprogressVisible(false);
                    ToastAndroid.show('Notice saved successfully', ToastAndroid.TOP);
                    setdetails('');
                    setImageFileName('');
                    navigation.goBack();
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
    // const checkBoxChanged = (Value, value, isChecked) => {
    //     setcheckBoxChecked(tempCheckValues);
    //     var tempCheckBoxChecked = checkBoxChecked;
    //     tempCheckBoxChecked[Value] = !value;
    //     setcheckBoxChecked(tempCheckBoxChecked);

    //     if (isChecked) {
    //         cListforcheckbox.push(Value);
    //     } else {

    //         for (let index = 0; index < cListforcheckbox.length; index++) {
    //             const element = cListforcheckbox[index];

    //             if (element == Value) {
    //                 cListforcheckbox.splice(index, 1);
    //             }

    //         }
    //     }
    //     // { this.setState(Object.assign(test, { CheckBoxList: cListforcheckbox })) }
    //     settest({ CheckBoxList: cListforcheckbox })
    //     // this.setState({ CheckBoxList: cList })
    //     console.log(tempCheckValues, '......test1')
    //     console.log(test.CheckBoxList, '......test')
    // }


    // const openModaldept = () => {
    //     setmodalfordept(true);
    // }
    // const closeModaldept = () => {
    //     setmodalfordept(false);
    // }
    // const closeModaledpt = () => {
    //     setmodalfordept(false);
    // }
    const openmodalForImage = () => {
        setmodalForImage(true);
    }


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
    // const getDepartment = async (cid) => {
    //     try {

    //         await GetDepartmentByCompanyId(cid)
    //             .then(res => {
    //                 console.log('comlen', res);
    //                 if (res !== null) {
    //                     console.log('comlen2', res);
    //                     if (res?.length > 0) {
    //                         const depList = [];
    //                         res?.forEach(function (item) {
    //                             const ob = {
    //                                 'Text': item.DepartmentName,
    //                                 'Value': item.Id
    //                             }
    //                             depList.push(ob);
    //                         });
    //                         setdepartmentList(depList);
    //                         console.log(departmentList, 'testcall')
    //                     }
    //                 } else {
    //                     setdepartmentList([]);
    //                 }
    //             })
    //             .catch(() => {
    //                 console.log("error occured");
    //             });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // const rendercheckbox = () => {

    //     return (
    //         departmentList?.map((val) => {
    //             { tempCheckValues[val.Value] = false }

    //             return (
    //                 <View
    //                     key={val.Value}
    //                     style={{
    //                         // flex: 1,
    //                         flexDirection: 'row',
    //                         padding: 5,
    //                         alignSelf: 'center',
    //                     }}>
    //                     <Checkbox
    //                         // value={checkBoxChecked[val.Value]}
    //                         status={'checked'}
    //                         onPress={(value) =>
    //                             checkBoxChanged(val.Value,
    //                                 checkBoxChecked[val.Value], value)}
    //                     />
    //                     <Text style={{ marginTop: 6, color: '#636363', }}>{val.Text}</Text>
    //                 </View >
    //             )
    //         }
    //         )
    //     );
    // }

    return (
        <View
            style={{
                flex: 1, backgroundColor: '#ffffff', flexDirection: 'column',
            }}>

            <Header
                title={'Create Notice'}
                goBack={true}
                onPress={() => { navigation.goBack() }}
                btnAction={() => saveNotice()}
                btnTitle='PUBLISH'
                saveImg={true}
                btnContainerStyle={NoticeStyle.ApplyTextButton}
                btnStyle={NoticeStyle.plusButton}
            />


            {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={NoticeStyle.loaderIndicator} />) :

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
                            </TouchableOpacity>

                            {/* </View> */}
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
            }
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
                <CustomImagePicker
                    setfileList={setImageFileName}
                    fileList={images}
                    setprogressVisible={setprogressVisible}
                    setmodalForImage={setmodalForImage}
                    single={true}
                />
            </Modal>

            {/* <Modal
                style={[NoticeStyle.modalfordept]}
                position={"center"}
                isOpen={modalfordept}
                backdropPressToClose={false}
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
            </Modal> */}
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
                    imageUrls={urlResource + images} >
                </ImageViewer>
            </Modal1>

        </View >
    );
}

export default CreateNotice;
