import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    View, Text, Modal, Image,
    ScrollView, BackHandler
} from 'react-native';
import { getNoticedetail } from "../../../../services/UserService/Notice";
import { NoticeStyle } from "./NoticeStyle"
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { urlResource } from '../../../../services/api/config';

const NoticeDetail = ({ navigation, route }) => {

    const [Details, setDetails] = useState('');
    const [ImageFileName, setImageFileName] = useState('');
    const [isModelVisible, setisModelVisible] = useState(false);
    const params = route?.params;

    const handleBackButton = () => {
        goBack();
        return true;
    }
    const goBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        getNoticeDetatil(params?.aItem?.Id);
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
    const getNoticeDetatil = async (NoticeId) => {

        await getNoticedetail(NoticeId)
            .then(res => {
                setDetails(res?.result?.Details);
                setImageFileName(res?.result?.ImageFileName);

                console.log(Details, 'detail....')

            })
            .catch(() => {
                console.log("error occured");
            });
    }

    const images = [{ url: urlResource + ImageFileName, },];

    return (
        <View style={NoticeStyle.noticeDetailContainer}>

            <View style={NoticeStyle.headerContainer}>
                <View style={NoticeStyle.headerTitle}>
                    <TouchableOpacity
                        onPress={() => goBack()}
                    >
                        <MaterialIcons name="chevron-left" size={35} color="#BEC3C8" />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        style={NoticeStyle.headerText}>
                        VIEW NOTICE
                    </Text>
                </View>
                <View style={NoticeStyle.headerTextRight}>
                </View>
            </View>



            <ScrollView>

                <Text style={NoticeStyle.noticeDetailTextStyle}>
                    {Details}
                </Text>



                <TouchableOpacity style={{ paddding: 10, alignSelf: 'center', }}
                    onPress={() => imageViewer()}>
                    <Image resizeMode='contain' style={{ height: 150, width: 150, }}
                        source={{ uri: urlResource + ImageFileName }}>
                    </Image>
                </TouchableOpacity>
            </ScrollView>

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
                        style={{ alignItems: "flex-end", padding: 5, }}
                        onPress={() => ShowModalFunction()}>
                        <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 12, marginTop: 10 }}
                            source={require('../../../../../assets/images/close.png')}>
                        </Image>
                    </TouchableOpacity>

                </View>

                <ImageViewer imageUrls={images} />
            </Modal>
        </View>
    );
}

export default NoticeDetail;

