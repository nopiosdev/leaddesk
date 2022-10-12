import React from 'react';
import {
    Platform, StatusBar, StyleSheet, TouchableOpacity, Dimensions,
    View, Text, Modal, Image, ScrollView, ActivityIndicator, BackHandler,
} from 'react-native';
import { getNoticedetail } from "../../../services/Notice";
import { NoticeStyle } from "./NoticeStyle"
import { CommonStyles } from '../../../common/CommonStyles';
import ImageViewer from 'react-native-image-zoom-viewer';
import { urlDev, urlResource } from '../../../services/api/config';
import { useState } from 'react';
import { useEffect } from 'react';

const NoticeDetail = ({ navigation, route }) => {

    const [details, setDetails] = useState('');
    const [ImageFileName, setImageFileName] = useState('');
    const [isModelVisible, setisModelVisible] = useState(false);
    const paramsData = route?.params;

    const handleBackButton = () => {
        navigation.navigate('Notice');
        return true;
    }

    useEffect(() => {
        GetNoticeDetatil();
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [])


    const imageViewer = () => {
        setisModelVisible(true);
    }
    const ShowModalFunction = (visible) => {
        setisModelVisible(false);
    }

    const GetNoticeDetatil = async () => {
        let NoticeId = paramsData?.aItem.Id;
        await getNoticedetail(NoticeId)
            .then(res => {
                console.log('Details',res)
                setDetails(res?.Details);
                setImageFileName(res?.ImageFileName);
            })
            .catch(() => {
                console.log("error occured");
            });
    }
console.log(details,'Details')
    const images = [{ url: urlResource + ImageFileName, },];
    return (
        <View style={NoticeStyle.noticeDetailContainer}>
            <View
                style={CommonStyles.HeaderContent}>
                <View
                    style={CommonStyles.HeaderFirstView}>
                    <TouchableOpacity
                        style={CommonStyles.HeaderMenuicon}
                        onPress={() => { navigation.navigate('Notice'); }}>
                        <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                            source={require('../../../../assets/images/left_arrow.png')}>
                        </Image>
                    </TouchableOpacity>
                    <View
                        style={CommonStyles.HeaderTextView}>
                        <Text
                            style={CommonStyles.HeaderTextstyle}>
                            NOTICE DETAIL
                        </Text>
                    </View>
                </View>

            </View>

            <View style={NoticeStyle.detailTextStyle}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>

                        <Text style={NoticeStyle.noticeDetailTextStyle}>
                            {details}
                        </Text>

                    </View>

                    <TouchableOpacity style={{ paddding: 10, alignSelf: 'center', }}
                        onPress={() => imageViewer()}>
                        <Image resizeMode='contain' style={{ height: 150, width: 150, }}
                            source={{ uri: urlResource + ImageFileName }}>
                        </Image>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <Modal
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
                        style={{ alignItems: "flex-end", padding: 10, }}
                        onPress={() => ShowModalFunction()}>
                        <Image resizeMode="contain" style={{ width: 15, height: 15 }}
                            // onPress={() => this.ShowModalFunction()}
                            source={require('../../../../assets/images/close.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <ImageViewer imageUrls={images} >
                </ImageViewer>
            </Modal>
        </View>
    );
}

export default NoticeDetail;
