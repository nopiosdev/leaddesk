import { StyleSheet, Platform, Dimensions, } from 'react-native';
const { width } = Dimensions.get('window');
export const DailyAttendanceStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
        flexDirection: 'column',
    },
    HeaderContent: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#fff',
        shadowColor: "#fff",
        shadowRadius: 3,
        shadowColor: "black",
        shadowOpacity: 0.7,
        shadowOffset: { width: 10, height: -5 },
        elevation: 10,
        height: 60,
    },
    HeaderFirstView: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginLeft: 5, alignItems: 'center',
    },
    HeaderMenuicon: {
        alignItems: 'center'
    },
    HeaderMenuiconstyle: {
        width: 20, height: 20,
    },
    HeaderTextView:
    {
        backgroundColor: 'white', padding: 0,
        marginLeft: 17, margin: 0,
        flexDirection: 'row', alignItems: 'center',
    },
    HeaderTextstyel: {
        fontFamily: "PRODUCT_SANS_BOLD", fontSize: 16,
        textAlign: "left", color: "#2a2a2a",

    },
    headerBar: {
        justifyContent: 'space-between',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#fff',
        shadowColor: "#fff",
        shadowRadius: 3,
        shadowColor: "black",
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: -5 },
        elevation: 10,
        height: 60,
    },
    backIcon: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIconTouch: {
        padding: 10,
        flexDirection: 'row', alignItems: 'center'
    },
    headerTitle: {
        padding: 0, paddingLeft: 10,
        margin: 0, flexDirection: 'row',
    },
    headerTitleText: {
        color: '#4E4E4E', marginTop: 1,
        fontFamily: "PRODUCT_SANS_BOLD",
        fontSize: 16, textAlign: 'center',
    },
    ListContainer: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 5,
        marginLeft: -2,
        backgroundColor: "#f5f7fb",
    },
    FlatListContainer: {
        backgroundColor: '#f5f6f8',
        flex: 4,
        paddingHorizontal: 5,
    },
    FlatListTouchableOpacity: {
        padding: 8,
        paddingBottom: 13,
        borderWidth: 0,
        backgroundColor: '#fff',
        margin: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        borderBottomColor: '#f3f3f3',
        borderBottomWidth: 2,
    },
    FlatListTouchableOpacitywork: {
        padding: 15,
        paddingBottom: 13,
        borderWidth: 0,
        flex: 1,
        margin: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingRight: 0,
    },
    FlatListLeft: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: "55%"

    },

    FlatListAttendanceLeft: {
        flexDirection: 'row',
    },
    FlatListLeftLeave: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: "40%"

    },
    FlatListLeftwork: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: "40%",
        flexWrap: 'wrap'
    },
    ImageLocal: {
        ...Platform.select({
            ios: {
                width: 60, height: 60, borderRadius: 30
            },
            android: {
                width: 60, height: 60, borderRadius: 800
            },
        }),
    },
    AttendanceImage: {
        ...Platform.select({
            ios: {
                width: 40, height: 40, borderRadius: 30
            },
            android: {
                width: 40, height: 40, borderRadius: 800
            },
        }),
    },
    ImagestyleFromServer: {
        ...Platform.select({
            ios: {
                width: 60, height: 60, borderRadius: 30
            },
            android: {
                width: 60, height: 60, borderRadius: 30
            },
        }),
    },
    styleForonlineOfflineIcon: {
        ...Platform.select({
            ios: {
                width: 20,
                height: 20,
                marginLeft: -5,
                marginTop: -30,
            },
            android: {
                width: 20,
                height: 20,
                marginLeft: -5,
                marginTop: -30,
            },
        }),
    },
    RightTextView: {
        flexDirection: 'column', marginTop: 3, flexWrap: 'wrap'
    },
    AttendanceImageView2: {
        flexDirection: 'column', marginTop: 3, flexWrap: 'wrap'
    },
    AttendanceImageView1: {
        flexDirection: 'column', marginTop: 3, flexWrap: 'wrap', marginRight: 10
    },
    NameText: {
        fontFamily: "OPENSANS_BOLD",
        fontSize: width * 0.034,
        textAlign: "left",
        color: "#19260c",
    },
    DesignationText: {
        fontSize: width * 0.03,
        fontFamily: "OPENSANS_REGULAR",
        textAlign: "left",
        color: "#8f8f8f"
    },
    DepartmentText: {
        fontSize: width * 0.03,
        fontFamily: "OPENSANS_REGULAR",
        textAlign: "left",
        color: "#b5b5b5"
    },
    TimeContainer: {
        flexDirection: "row", alignItems: 'flex-end', marginRight: 10, marginTop: 4
    },
    TimeContainerwork: {
        alignItems: 'flex-start', alignSelf: 'flex-start'
    },
    TimeContent: {
        flexDirection: 'row',
        borderBottomColor: '#437098',
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 3,
    },
    TimeContentwork: {
        flexDirection: 'row',
        padding: 3,
        marginRight: 10
    },
    CheckintimeStyle: {
        paddingRight: 8,
        fontSize: 11
    },
    AntDesignstyle: {
        paddingRight: 2,
    },
    CheckinTimeText: {
        fontFamily: "PRODUCT_SANS_BOLD",
        fontSize: 11,
        textAlign: "left",
        color: "#076332"
    },
    CheckOutTimeView: {
        flexDirection: 'row',
        padding: 3,
    },
    CheckOutTimeViewword: {
        flexDirection: 'row',
        padding: 3,
    },
    CheckOutTimetext: {
        paddingRight: 8,
        marginTop: 2,
        fontSize: 11
    },
    CheckOutTimeIconstyle: {
        paddingRight: 2,
    },
    CheckOutTimeText: {
        fontFamily: "PRODUCT_SANS_BOLD",
        fontSize: 11, textAlign: "left", color: "#717171"
    },
    CheckOutMissingTimeText: {
        fontFamily: "PRODUCT_SANS_BOLD",
        fontSize: 11, textAlign: "left", color: "#FF0000"
    },
    countBoxContainer: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 5,
        marginLeft: -2,
        backgroundColor: "#f5f7fb",
    },
    countBoxColumn1: {
        padding: 5,
        width: (width * 33) / 100,
        height: 41.1,
        backgroundColor: "#f5f7fb",
        justifyContent: 'center',
        borderRightColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        marginBottom: 3,
        borderRightWidth: 2,
    },
    countBoxDetailColumn1: {
        padding: 5,
        width: (width * 50) / 100,
        height: 41.1,
        backgroundColor: "#f5f7fb",
        justifyContent: 'center',
        borderRightColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        marginBottom: 3,
        borderRightWidth: 2,
    },
    countBoxColumn1NumberActive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        textAlign: "center",
        color: "#3ab875",
        justifyContent: 'center'
    },
    countBoxColumn1NumberInactive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        fontStyle: "normal",
        textAlign: "left",
        color: "#bbc3c7",
    },
    countBoxColumn1LabelActive: {
        color: "#3ab875",
        fontFamily: "Montserrat_Bold",
        fontSize: 10,
        fontStyle: "normal",
        textAlign: "left",
        paddingTop: 8,
        paddingLeft: 2,
        justifyContent: 'flex-start',
    },
    countBoxColumn1LabelInactive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 10,
        fontStyle: "normal",
        textAlign: "left",
        color: "#bbc3c7",
        paddingTop: 8,
        paddingLeft: 2,
        justifyContent: 'flex-start',
    },


    countBoxColumn2: {
        width: (width * 33) / 100,
        height: 41.1,
        padding: 5,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#f5f7fb",
        marginTop: 3,
        marginBottom: 3,
        borderRightWidth: 2,
        borderRightColor: '#ffffff',
    },
    countBoxColumn2NumberActive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        color: '#6f9fc9',
        textAlign: 'center',
        justifyContent: 'center',
        paddingLeft: 2,
        fontStyle: "normal",
        textAlign: "center",
        marginTop: 1
    },
    countBoxColumn3NumberActive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        // fontWeight: "bold",
        fontStyle: "normal",
        // lineHeight: 37,
        // letterSpacing: 0,
        textAlign: "center",
        justifyContent: 'center',
        color: "#e2b24e",
    },
    countBoxColumn3NumberInactive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        // fontWeight: "bold",
        fontStyle: "normal",
        // lineHeight: 37,
        // letterSpacing: 0,
        textAlign: "center",
        justifyContent: 'center',
        color: "#bbc3c7",
    },
    countBoxColumn2NumberInactive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        color: '#bbc3c7',
        textAlign: 'center',
        justifyContent: 'center',
        paddingLeft: 2,
        fontStyle: "normal",
        textAlign: "center",
        marginTop: 1
    },
    countBoxColumn2LabelActive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 10,
        fontStyle: "normal",
        textAlign: "left",
        paddingTop: 8,
        paddingLeft: 2,
        justifyContent: 'center',
        color: "#6f9fc9",
    },
    countBoxColumn2LabelInactive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 10,
        fontStyle: "normal",
        textAlign: "left",
        paddingTop: 8,
        paddingLeft: 2,
        justifyContent: 'center',
        color: "#bbc3c7",
    },

    countBoxColumn3: {
        padding: 5,
        width: (width * 33) / 100,
        height: 41.1,

        // backgroundColor: "#cddeee",
        backgroundColor: "#f5f7fb",
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        marginBottom: 3
    },
    countBoxDetailColumn3: {
        padding: 5,
        width: (width * 50) / 100,
        height: 41.1,

        // backgroundColor: "#cddeee",
        backgroundColor: "#f5f7fb",
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        marginBottom: 3
    },
    countBoxColumn3NumberActive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        // fontWeight: "bold",
        fontStyle: "normal",
        // lineHeight: 37,
        // letterSpacing: 0,
        textAlign: "center",
        justifyContent: 'center',
        color: "#e2b24e",
    },
    countBoxColumn3NumberInactive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        // fontWeight: "bold",
        fontStyle: "normal",
        // lineHeight: 37,
        // letterSpacing: 0,
        textAlign: "center",
        justifyContent: 'center',
        color: "#bbc3c7",
    },
    countBoxColumn3LabelActive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 10,
        // fontWeight: "bold",
        fontStyle: "normal",
        // lineHeight: 7,
        // letterSpacing: 0.5,
        textAlign: "left",
        color: "#e2b24e",
        paddingTop: 8,
        paddingLeft: 1,
        justifyContent: 'center',
        paddingLeft: 2,
    },
    countBoxColumn3LabelInactive: {
        fontFamily: "Montserrat_Bold",
        fontSize: 10,
        // fontWeight: "bold",
        fontStyle: "normal",
        // lineHeight: 7,
        // letterSpacing: 0.5,
        textAlign: "left",
        color: "#bbc3c7",
        paddingTop: 8,
        paddingLeft: 1,
        justifyContent: 'center',
        paddingLeft: 2,
    }

})



