import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'

const CustomButton = ({ title, onPress, btnStyle }) => {
    return (
        <>
            <TouchableOpacity style={[styles.container, btnStyle]} onPress={onPress}>
                <Text style={styles.btnText}>{title}</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        backgroundColor: 'purple',
        width: '100%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: Dimensions.get('window').width * 0.04,
        fontWeight: '500'
    }
})

export default CustomButton