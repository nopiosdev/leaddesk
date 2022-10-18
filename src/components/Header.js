import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { DrawerContentStyle } from './MenuDrawer/DrawerContentStyle';
import { CommonStyles } from '../common/CommonStyles';
import Iconic from 'react-native-vector-icons/Feather'

const Header = ({ onSelect, selected, onPress, goBack, makeCall = null, title }) => {
    return (
        <>
            <View style={CommonStyles.HeaderContent}>
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
            </View>
        </>
    )
}

export default Header