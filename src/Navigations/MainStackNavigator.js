import 'react-native-gesture-handler';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navigationRef } from './NavigationRef';
import LoginScreen from '../Screen/AdminScreens/Login';
import Register from '../Screen/AdminScreens/Register';
import DailyAttendance from '../Screen/AdminScreens/attendance/DailyAttendance';
import DailyAttendanceDetails from '../Screen/AdminScreens/attendance/DailyAttendanceDetails';
import DailyAttendanceLocation from '../Screen/AdminScreens/attendance/DailyAttendanceLocation';
import UserSpecificTasks from '../Screen/AdminScreens/attendance/UserSpecificTasks';
import UserSpecificLeave from '../Screen/AdminScreens/attendance/UserSpecificLeave';
import DrawerContent from '../components/MenuDrawer/DrawerContent';
import SettingScreen from '../Screen/AdminScreens/setting/Setting';
import DepartmentSetupScreen from '../Screen/AdminScreens/department/DepartmentSetupScreen';
import EmployeeSetupScreen from '../Screen/AdminScreens/employees/EmployeeSetupScreen';
import CreateEmployeeScreen from '../Screen/AdminScreens/employees/CreateEmployeeScreen';
import CompanysetupScreen from '../Screen/AdminScreens/company/CompanysetupScreen';
import ReportScreen from '../Screen/AdminScreens/reports/ReportScreen';
import TaskListScreen from '../Screen/AdminScreens/tasks/TaskList';
import CompleteTaskFilter from '../Screen/AdminScreens/tasks/CompleteTaskFilter';
import ViewTask from '../Screen/AdminScreens/tasks/ViewTask';
import CreateTask from '../Screen/AdminScreens/tasks/CreateTask';
// import TaskBoardScreen from '../Screen/Board/TaskBoard';
// import CreateTaskForBoard from '../Screen/Board/CreateTaskForBoard';
// import TaskBordDetail from '../Screen/Board/TaskBordDetail';
// import ViewBoardTask from '../Screen/Board/ViewBoardTask';
import LeaveList from '../Screen/AdminScreens/leaves/LeaveList';
import CreateNotice from '../Screen/AdminScreens/notice/CreateNotice'
import NoticeDetail from '../Screen/AdminScreens/notice/NoticeDetail'
import Notice from '../Screen/AdminScreens/notice/Notice';
import DetailScreen from '../Screen/AdminScreens/reports/DetailScreen';
import LeaderBoardScreen from '../Screen/AdminScreens/leaderboard/LeaderBoardScreen';
import LiveTracking from '../Screen/AdminScreens/liveTracking/LiveTracking';
import AdminTodayAttendance from '../Screen/AdminScreens/attendance/AdminTodayAttendance';
import { Image, View } from 'react-native';
import TaskBottomTabs from '../helperComponents/TaskBottomTabs';
import MyPanel from '../Screen/EmployeeScreens/myPanel/MyPanel';
import LeaveApply from '../Screen/EmployeeScreens/leaves/LeaveApply';
import { AntDesign, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';



const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


const TaskListBottomTab = () => {
    const userDetails = useSelector((state) => state.user.currentUser);

    return (
        <Tab.Navigator tabBar={props => <TaskBottomTabs {...props} />} initialRouteName={'TaskListScreen'} screenOptions={({ route }) => ({
            tabBarHideOnKeyboard: true,
        })} >
            <Tab.Screen name="TaskListScreen" component={TaskListScreen} options={{ headerShown: false }} />
            <Tab.Screen name="CompleteTaskFilter" component={CompleteTaskFilter} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

const AdminBottomTab = () => {

    return (
        <Tab.Navigator initialRouteName='DailyAttendanceDetails' screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                if (route.name === 'DailyAttendanceDetails') {
                    return <Image source={require('../../assets/images/goal.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }} />
                }
                if (route.name === 'DailyAttendanceLocation' && focused) {
                    return <Image source={require('../../assets/images/pin_s.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }} />
                } else if (route.name === 'DailyAttendanceLocation' && !focused) {
                    return <Image source={require('../../assets/images/pin.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }}></Image>
                }
                if (route.name === 'UserSpecificTasks' && focused) {
                    return <Image source={require('../../assets/images/list_s.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }} />
                } else if (route.name === 'UserSpecificTasks' && !focused) {
                    return <Image source={require('../../assets/images/list_a.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }}></Image>
                }
                if (route.name === 'UserSpecificLeave' && focused) {
                    return <Image source={require('../../assets/images/briefcase_s.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }} />
                } else if (route.name === 'UserSpecificLeave' && !focused) {
                    return <Image source={require('../../assets/images/briefcase.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }}></Image>
                }
            },
            tabBarActiveTintColor: 'purple',
            tabBarInactiveTintColor: 'gray',
            tabBarHideOnKeyboard: true,
        })} >
            <Tab.Screen name="DailyAttendanceDetails" component={DailyAttendanceDetails} options={{ headerShown: false, title: 'Time Line' }} />
            <Tab.Screen name="DailyAttendanceLocation" component={DailyAttendanceLocation} options={{ headerShown: false, title: "Map View" }} />
            <Tab.Screen name="UserSpecificTasks" component={UserSpecificTasks} options={{ headerShown: false, title: "Tasks" }} />
            <Tab.Screen name="UserSpecificLeave" component={UserSpecificLeave} options={{ headerShown: false, title: "Leave" }} />
        </Tab.Navigator>
    );
}


const DashboardScreen = () => {
    const userDetails = useSelector((state) => state.user.currentUser);
    return (
        <Drawer.Navigator initialRouteName="DailyAttendance" drawerContent={DrawerContent} screenOptions={{ drawerStyle: { width: "65%", } }} >
            <Drawer.Screen name="DailyAttendance" component={DailyAttendance} options={{ headerShown: false }} />
            <Drawer.Screen name="TaskListBottomTab" component={TaskListBottomTab} options={{ headerShown: false }} />
            <Drawer.Screen name="LeaderBoard" component={LeaderBoardScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="LeaveList" component={LeaveList} options={{ headerShown: false }} />
            <Drawer.Screen name="Notice" component={Notice} options={{ headerShown: false }} />
            {userDetails?.UserType == 'admin' ?
                <>
                    {/* <Drawer.Screen name="AdminHomeTab" component={AdminHomeTab} options={{ headerShown: false }} /> */}
                    <Drawer.Screen name="Tab" component={AdminBottomTab} options={{ headerShown: false }} />
                    <Drawer.Screen name="LiveTraking" component={LiveTracking} options={{ headerShown: false }} />
                    <Drawer.Screen name="ReportScreen" component={ReportScreen} options={{ headerShown: false }} />
                    <Drawer.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
                </>
                :
                <>
                    <Drawer.Screen name="MyPanel" component={MyPanel} options={{ headerShown: false }} />
                    {/* <Drawer.Screen name="LeaveListUser" component={LeaveListUser} options={{ headerShown: false }} /> */}
                    {/* <Drawer.Screen name="NoticeUser" component={NoticeUser} options={{ headerShown: false }} /> */}

                </>
            }
        </Drawer.Navigator>
    );
}

const MainStackNavigator = () => {
    const Login = useSelector((state) => state.user.login);
    const userDetails = useSelector((state) => state.user.currentUser);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                {Login === 'Login' ?
                    <>
                        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ViewTask" component={ViewTask} options={{ headerShown: false }} />
                        <Stack.Screen name="CreateTask" component={CreateTask} options={{ headerShown: false }} />
                        <Stack.Screen name="CreateNotice" component={CreateNotice} options={{ headerShown: false }} />
                        <Stack.Screen name="NoticeDetail" component={NoticeDetail} options={{ headerShown: false }} />

                        {userDetails?.UserType == 'admin' ?
                            <>
                                {/* <Drawer.Screen name="DailyAttendance" component={AdminHomeTab} options={{ headerShown: false }} /> */}
                                <Stack.Screen name="AdminTodayAttendance" component={AdminTodayAttendance} options={{ headerShown: false }} />
                                <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="CompanysetupScreen" component={CompanysetupScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="DepartmentSetupScreen" component={DepartmentSetupScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="EmployeeSetupScreen" component={EmployeeSetupScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="EmployeeCreateScreen" component={CreateEmployeeScreen} options={{ headerShown: false }} />
                            </>
                            :
                            <>
                                <Stack.Screen name="LeaveApply" component={LeaveApply} options={{ headerShown: false }} />
                                {/* <Stack.Screen name="NoticeDetailUser" component={NoticeDetailUser} options={{ headerShown: false }} /> */}
                                {/* <Stack.Screen name="CreateTask" component={CreateUserTask} options={{ headerShown: false }} /> */}
                                {/* <Stack.Screen name="ViewAssignToMe" component={ViewAssignToMe} options={{ headerShown: false }} /> */}
                                {/* <Stack.Screen name="ViewTask" component={ViewUserTask} options={{ headerShown: false }} /> */}
                            </>
                        }
                    </>
                    :
                    <>
                        <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="register" component={Register} options={{ headerShown: false }} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer >
    );
}

export default MainStackNavigator;
























