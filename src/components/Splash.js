import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
const Splash = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Hello this is splash</Text>
        </View>
    )
}
export default Splash;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4f5f7',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black'
    }
})