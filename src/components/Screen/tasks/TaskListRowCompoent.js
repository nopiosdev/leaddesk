import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TaskStyle } from './TaskStyle'
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        elevation: 2,
        borderLeftWidth: 4,
    },
    title: {
        fontSize: 16,
        color: '#505050',
        marginBottom: 5,
        fontWeight: '500',
        flexWrap: 'wrap',
        fontFamily: 'PRODUCT_SANS_BOLD',

    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 5,
        justifyContent: 'center',
    },
    submittedDate: {
        fontSize: 13,
        //  marginBottom: 10,
        color: "#878787",
        fontFamily: "PRODUCT_SANS_BOLD",
        marginTop: 3,
        marginLeft: 5,

    },
    description: {
        fontSize: 12,
        fontFamily: 'OPENSANS_REGULAR',
        color: '#878787'
    },
    statusContainer: {
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopWidth: 1,
        borderTopColor: "#edeeef",
        paddingTop: 5,
        marginTop: 10,
    },
    statusText: {
        // padding: 5,
        alignItems: 'flex-start',
        width: '40%',
        fontWeight: "bold",
        fontSize: 16
    },
    status: {
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: 'Montserrat_Bold'
    },

    totalAmount: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        fontWeight: "bold",
        fontSize: 16,
        alignSelf: 'center',
        marginRight: 5,
    },
    dateTimeText: {
        color: '#878787',
        fontFamily: 'Montserrat_Bold',
        marginRight: 5,
    },
    contentContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        //marginTop: 10,
    },
    TitleContainer: {
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        width: '90%'
    },
    descriptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    deescriptionView: {
        alignItems: 'flex-start',
        width: '90%',
        flexWrap: 'wrap'
    },
    fileIconContainer: {
        alignItems: 'flex-end',
        alignSelf: 'flex-start'
    },

});



let stylecolor = ""
const setSelectedOptionCircle = (id) => {
    switch (id) {
        case 1:
            stylecolor = "white"
            break;
        case 2:
            stylecolor = "#cc5c5c"
            break;
        case 3:
            stylecolor = "white"
            break;
    }
};

let leftSideColor = ""
let sytlecolor = ""

const leftSideColorfunction = (id) => {
    switch (id) {
        case 1:
            leftSideColor = "#C4C4C4"
            break;
        case 2:
            leftSideColor = "#3D8EC5"
            break;
        case 3:
            leftSideColor = "#CB9A3A"
            break;
        case 4:
            leftSideColor = "#3DC585"
            break;
        case 5:
            leftSideColor = "#0A7A46"
            break;
        case 6:
            leftSideColor = "#A53131"
            break;
        default:
            leftSideColor = "#C4C4C4"
    }
};


const TaskListRowCompoent = (props) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("ViewTask", { TaskModel: props.itemData })}>
            {leftSideColorfunction(props.itemData.StatusId)}
            <View style={[styles.container, { borderLeftColor: leftSideColor }]}>
                <View style={styles.container_text}>
                    <View style={styles.contentContainer}>
                        <View style={styles.TitleContainer}>
                            <Text style={styles.title}>
                                {props.itemData.Title}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', marginRight: 8, }}>
                            {setSelectedOptionCircle(props.itemData.PriorityId)}
                            {< MaterialIcons name="priority-high" size={18}color={stylecolor}>
                        </MaterialIcons>}
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name="md-people" size={20} style={{ marginHorizontal: 0, }} color="#4a535b" />
                    <Text style={styles.submittedDate}>
                        {props.itemData.AssignToName}
                    </Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <View style={styles.deescriptionView}>
                        <Text style={styles.description}>
                            {props.itemData.Description}
                        </Text>
                    </View>
                    <View style={styles.fileIconContainer}>
                        {(props.itemData.HasAttachments) ?
                            <View
                                style={TaskStyle.taskBodyRight}>
                                <MaterialCommunityIcons name="file-document-outline" size={20} color="#BEC3C8" />
                            </View>
                            : null}
                    </View>
                </View>
                <View style={styles.statusContainer}>
                    <View style={styles.statusText}>
                        {leftSideColorfunction(props.itemData.StatusId)}
                        <Text style={[styles.status, { color: leftSideColor }]}>{props.itemData.StatusId === 1 ? 'Todo' : props.itemData.StatusId === 2 ? 'In Progress' : props.itemData.StatusId === 3 ? 'Pause' : props.itemData.StatusId === 4 ? 'Completed' : props.itemData.StatusId === 5 ? 'Done' : props.itemData.StatusId === 6 ? 'Cancelled' : 'Todo'}</Text>
                    </View>
                    <View style={styles.totalAmount}>
                        {props.itemData.DueDate !== "" ?
                            <FontAwesome
                                name="calendar"
                                size={15} color="#878787"
                                style={{ marginRight: 2 }} />
                            : <Text></Text>}
                        <Text style={styles.dateTimeText}> {moment(props.itemData.DueDate).format('DD/MM/YY')}</Text>
                    </View>
                </View>

            </View>
        </View>
        </TouchableOpacity >
    );
}
export default TaskListRowCompoent;
