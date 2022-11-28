import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import * as Update from 'expo-updates';


const Popup = ({ show, onPress, description, connectBtn, title }) => {


    return (
        <>
            <View style={styles.mainContainer}>
                <Portal>
                    <Dialog visible={show} onDismiss={onPress} style={{ marginTop: height * 0.80, width: '100%', alignItems: 'center', marginHorizontal: 0, marginBottom: 0, }}>
                        <>
                            <View style={[styles.child1, { backgroundColor: colors.primary }]}>
                                <Dialog.Title style={[styles.child1Text, { color: colors.secondary }]}>{title}</Dialog.Title>
                            </View>
                            <Dialog.Content style={[styles.child2, { backgroundColor: colors.secondary }]}>
                                <Paragraph style={[styles.child2Text, { color: colors.tertiary }]}>{description}</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions style={{ alignItems: 'center', width: '100%', justifyContent: 'space-evenly', flexDirection: 'row' }}>
                                <View style={{ width: '50%' }}>
                                    {connectBtn ? <Button title='Try Again' btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: colors.primary }} onPress={onPress} />
                                        :
                                        <Button title='Update' btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: colors.primary }} onPress={() => Update.reloadAsync()} />}
                                </View>
                            </Dialog.Actions>
                        </>
                    </Dialog>
                </Portal>
            </View>
        </>
    )
}

const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation,
    };
};


const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: "center",
    },
    child1: {
        width: '100%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    child1Text: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 23,
        textAlign: 'center'
    },
    child2: {
        padding: 20,
        justifyContent: 'space-around',
    },
    child2Text: {
        textAlign: 'center',
        lineHeight: 18,
        fontSize: 16,
        fontWeight: '400',
    },
    button: {
        height: 41,
        width: '50%',
        alignSelf: 'center'
    }
})
export default Popup