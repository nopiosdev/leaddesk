import React from 'react';
import {
    Platform, StatusBar, StyleSheet, TouchableOpacity, Dimensions,
    View, Text, Modal, Image, ScrollView, ActivityIndicator, BackHandler,
} from 'react-native';
import { getNoticedetail } from "../../../services/Notice";
import { NoticeStyle } from "./NoticeStyle"
import { CommonStyles } from '../../../common/CommonStyles';
import ImageViewer from 'react-native-image-zoom-viewer';
import { urlDev, urlResource } from '../../../Utils/config';
import { useState } from 'react';
import { useEffect } from 'react';
import Header from '../../../components/Header';

const NoticeDetail = ({ navigation, route }) => {

    const [details, setDetails] = useState('');
    const [ImageFileName, setImageFileName] = useState('');
    const [isModelVisible, setisModelVisible] = useState(false);
    const paramsData = route?.params;

    useEffect(() => {
        GetNoticeDetatil();
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
                console.log('Details', res)
                setDetails(res?.Details);
                setImageFileName(res?.ImageFileName);
            })
            .catch(() => {
                console.log("error occured");
            });
    }

    const images = [{ url: urlResource + ImageFileName, },];
    return (
        <View style={NoticeStyle.noticeDetailContainer}>
            <Header
                title={'Notice Detail'}
                onPress={() => { navigation.goBack() }}
                goBack={true}
            />

            <View style={NoticeStyle.detailTextStyle}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={NoticeStyle.noticeDetailTextStyle}>
                            {details}
                        </Text>
                    </View>
                    <TouchableOpacity style={{
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
                        marginTop: 20
                    }} onPress={() => imageViewer()}>
                        <Image resizeMode='contain' style={{ height: '100%', width: 150, }}
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
