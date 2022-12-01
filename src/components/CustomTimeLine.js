import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Timeline from 'react-native-timeline-flatlist'

const CustomTimeLine = ({ data }) => {
    return (
        <View style={styles.container}>
            <Timeline
                style={styles.list}
                data={data}
                circleSize={20}
                circleColor={"circleColor"}
                lineColor='rgb(45,156,219)'
                timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5,  borderRadius: 13, marginTop: 5, }}
                descriptionStyle={{ color: 'gray' }}
                options={{
                    style: { paddingTop: 5 }
                }}
                innerCircle={'dot'}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
});
export default CustomTimeLine;