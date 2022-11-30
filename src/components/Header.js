import { View, Text, BackHandler } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { DrawerContentStyle } from './MenuDrawer/DrawerContentStyle';
import { CommonStyles } from '../common/CommonStyles';
import Iconic from 'react-native-vector-icons/Feather'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const Header = ({ onSelect, selected, onPress, goBack, onGoBack, makeCall = null, title, btnTitle, btnAction, saveImg, deleteAction, btnContainerStyle, btnStyle }) => {

    const [showMenu, setShowMenu] = useState(false);

    const deleteTask = () => {
        setShowMenu(false);
        deleteAction();
    }

    useFocusEffect(() => {
        const onBackPress = () => {
            if (onGoBack) {
                onGoBack();
                return true;
            } else if (onPress) {
                onPress();
                return true;
            } else {
                return false;
            }
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    });

    return (
        <>
            <View style={[CommonStyles.HeaderContent, { marginBottom: 10 }]}>
                <View style={CommonStyles.HeaderFirstView}>
                    <TouchableOpacity
                        style={CommonStyles.HeaderMenuicon}
                        onPress={onPress}>
                        {goBack ?
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../assets/images/left_arrow.png')}>
                            </Image>
                            :
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../assets/images/menu_b.png')}>
                            </Image>
                        }
                    </TouchableOpacity>
                    {!onSelect ?
                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                {title}
                            </Text>
                        </View>
                        : <View style={[DrawerContentStyle.logoImage]}>
                            <TouchableOpacity
                                style={DrawerContentStyle.CompanyModalStyle}
                                onPress={onSelect}
                            >
                                <Text
                                    style={DrawerContentStyle.CompanyModalTextStyle}>
                                    {selected}
                                </Text>
                                <Iconic
                                    name="chevrons-down" size={14} color="#d6d6d6"
                                    style={DrawerContentStyle.CompanyModalIconStyle}>
                                </Iconic>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {makeCall &&
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={makeCall}
                            style={{ padding: 8, paddingVertical: 2 }}>
                            <Image
                                style={{ width: 20, height: 20, alignItems: 'center', marginTop: 5, }}
                                resizeMode='contain'
                                source={require('../../assets/images/call.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>}
                {btnAction &&
                    <View
                        style={CommonStyles.createTaskButtonContainer}>
                        <TouchableOpacity
                            onPress={btnAction}
                            style={CommonStyles.createTaskButtonTouch}>
                            <View style={[CommonStyles.plusButton, btnStyle]}>
                                {saveImg ?
                                    <MaterialCommunityIcons name="content-save" size={Platform.OS === 'ios' ? 15.3 : 17.5} color="#ffffff" /> :
                                    <FontAwesome
                                        name="plus" size={Platform.OS === 'ios' ? 16.6 : 18} color="#ffffff">
                                    </FontAwesome>}
                            </View>
                            <View style={[CommonStyles.ApplyTextButton, btnContainerStyle]}>
                                <Text style={CommonStyles.ApplyButtonText}>
                                    {btnTitle}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {deleteAction && <TouchableOpacity onPress={() => setShowMenu(true)}>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Menu visible={showMenu} onDismiss={() => setShowMenu(false)}
                                    anchor={<MaterialCommunityIcons
                                        name="dots-vertical" size={28}
                                        color="#bec3c8"
                                        style={{ padding: 2, }}
                                        onPress={() => setShowMenu(true)}
                                    />}>
                                    <Divider />
                                    <Menu.Item style={{ borderColor: 'red' }} onPress={() => deleteTask()} title='Delete Task' />
                                    <Divider />
                                </Menu>
                            </View>
                        </TouchableOpacity>}
                    </View>
                }
            </View>
        </>
    )
}

export default Header