import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const EmptyScreen = ({ description, title, bodyStyle, icon }) => {


    return (
        <View style={[styles.cartBody, bodyStyle]}>
            {icon}
            <Text style={styles.cartBodyText}>{title}</Text>
            {description && <Text style={styles.cartBodyPara}>{description}</Text>}
        </View>
    )
}
const styles = StyleSheet.create({
    cartBody: {
        alignItems: 'center',
        // paddingTop: height * 0.06,
        justifyContent:'center',
        height: '100%',
        backgroundColor: 'white',
        marginHorizontal: width * 0.05
    },
    cartBodyText: {
        fontSize: width * 0.035,
        color: '#343434',
        fontWeight: '800',
        paddingTop: height * 0.04,
        textAlign: 'center'
    },
    cartBodyPara: {
        fontSize: width * 0.03,
        color: '#343434',
        fontStyle: 'italic',
    },
});
export default EmptyScreen