import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NoticeStyle } from '../Screen/AdminScreens/notice/NoticeStyle';
import { upLoadImage } from '../services/TaskService';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CustomImagePicker = ({ TaskId, setprogressVisible, single = false, setfileList, fileList, setmodalForImage }) => {

    const [ImageFileName, setImageFileName] = useState('');

    const handleUploadPhoto = async (pickerResult) => {
        let filename = pickerResult?.uri?.split('/')?.pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        var data = new FormData();
        data.append('thumb', {
            uri: pickerResult.uri,
            name: filename,
            type: type
        })
        setprogressVisible(true);
        upLoadImage(data)
            .then(response => {
                if (response?.success) {
                    let attachmentModel = {
                        TaskId: TaskId,
                        FileName: response?.image,
                        BlobName: response?.image,
                    }
                    if (single) {
                        setfileList(response?.image);
                    } else {
                        setfileList(fileList.concat(attachmentModel));
                    }
                    setImageFileName(response?.image)
                    ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);
                } else {
                    ToastAndroid.show('Upload failed!', ToastAndroid.TOP);
                }
                //this.updateEmployeeRecords();
                setprogressVisible(false);
            })
            .catch(error => {
                setmodalForImage(false);
                setprogressVisible(false);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
                // this.errorToast();
            });
    };

    const takePhoto = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            ToastAndroid.show('Permission to access camera roll is required!', ToastAndroid.TOP);
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,

        });

        if (!result.cancelled) {
            setmodalForImage(false);
            handleUploadPhoto(result);
        }
    };
    const choosePhoto = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            ToastAndroid.show('Permission to access media is required!', ToastAndroid.TOP);
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,

        });

        if (!result.cancelled) {
            setmodalForImage(false);
            handleUploadPhoto(result);
        }

    }

    return (
        <>
            <View>
                <Text style={NoticeStyle.addPhotoText}>Add Photos</Text>
            </View>
            <View style={NoticeStyle.cemaraImageContainer}>
                <TouchableOpacity onPress={() => takePhoto()} style={{ alignItems: "center", paddingLeft: 35 }}>
                    <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../assets/images/photo_camera_black.png')} />
                    <Text style={NoticeStyle.takePhotoText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => choosePhoto()} style={{ alignItems: 'center', paddingRight: 35 }}>
                    <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../assets/images/Gallary.png')} />
                    <Text style={NoticeStyle.takePhotoText}>From Gallary</Text>
                </TouchableOpacity>
            </View>
        </>
    );

}
const styles = StyleSheet.create({
    label: {
        textAlign: 'left',
        fontSize: width * 0.04,
        color: '#707375',
        fontWeight: '600',
        marginLeft: 10
    },
    imageStyle: {
        width: (width > 767 ? width * 0.15 : width * 0.19),
        height: (width > 767 ? width * 0.15 : width * 0.19),
        borderRadius: 100

    }
})

export default CustomImagePicker