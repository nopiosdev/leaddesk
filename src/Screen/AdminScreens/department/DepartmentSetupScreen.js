import React, { useEffect, useState } from 'react';
import { Platform, ToastAndroid, StatusBar, Alert, View, BackHandler, Text, FlatList, Image, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modalbox';
import { FontAwesome } from '@expo/vector-icons';
import { NoticeStyle } from "../notice/NoticeStyle"
import { DepartmentSetupStyle } from './DepartmentSetupStyle'
import { GetDepartmentByCompanyId, CreateDepartment, updatedepartment } from "../../../services/DepartmentService";
import { useIsFocused } from '@react-navigation/native';
import LocalStorage from '../../../common/LocalStorage';
import Header from '../../../components/Header';
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
const StatusBarPlaceHolder = () => {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#F3F3F3',
        }}>
            <StatusBar
            // barStyle="light-content"
            />
        </View>
    );
}
const DepartmentSetupScreen = ({ navigation, route }) => {
    const [CompanyId, setCompanyId] = useState(0);
    const [departmentList, setdepartmentList] = useState([]);
    const [DeptName, setDeptName] = useState('');
    const [DeptId, setDeptId] = useState('');
    const [companyList, setcompanyList] = useState([]);
    const [numberofrefrash, setnumberofrefrash] = useState(0);
    const [Dept, setDept] = useState({ DepartmentName: '' });
    const [Employee, setEmployee] = useState({ DepartmentId: null });
    const [refreshing, setrefreshing] = useState(false);
    const [openModal6, setopenModal6] = useState(false);
    const [modal3, setmodal3] = useState(false);
    const [modalupdate, setmodalupdate] = useState(false);
    const [progressVisible, setprogressVisible] = useState(false);
    const IsFocused = useIsFocused();


    const closeModal6 = () => {
        if (Dept.DepartmentName == "") {
            ToastAndroid.show('Department name can not be empty', ToastAndroid.TOP);
        } else {
            onFetchDepartmentRecords();
            setopenModal6(false);
        }


    }
    const onFetchDepartmentRecords = async () => {
        console.log("trying Department create..");
        // getCompany();

        try {
            if (CompanyId == "") {
                ToastAndroid.show("At first create a company.", ToastAndroid.SHORT);
                return;
            }        
            var data = new FormData();
            data.append('CompanyId', CompanyId);
            data.append('DepartmentName', Dept.DepartmentName);
            let response = await CreateDepartment(data);
            console.log('com', response);
            if (response?.success) {
                getDepartment();
                ToastAndroid.show('Department created successully', ToastAndroid.TOP);
                setEmployee({ DepartmentId: departmentList[0]?.Value })
                setDeptId(departmentList[0]?.Value);
                setDeptName('');
                console.log('deptlist', departmentList);
            } else {
                ToastAndroid.show('error', ToastAndroid.TOP);
            }
        } catch (errors) {
            console.log(errors);
        }

    }

    useEffect(() => {
        getDepartment()       
    }, [IsFocused])

    // const openModal3 = () => {
    //     // getCompany();
    //     setmodal3(true);
    // }

    const _EditDept = async (item) => {
        testmethos(item);
        setmodalupdate(true);
    }

    const testmethos = async (item) => {
        setDeptName(item?.Text);
        setDeptId(item?.Value);
    }

    const closemodalForupdate = () => {
        if (DeptName == "") {
            ToastAndroid.show('Field can not be empty', ToastAndroid.TOP);

        }
        else {
            setmodalupdate(false);
            updateDept();
        }
    }
    const updateDept = async () => {
        if (DeptName !== "") {
            try {
                var data = new FormData();
                data.append('Id', DeptId);
                data.append('CompanyId', CompanyId);
                data.append('DepartmentName', DeptName);

                let response = await updatedepartment(data);
                console.log('deparment..', response);
                if (response?.success) {
                    getDepartment();
                } else {
                    ToastAndroid.show(response?.message, ToastAndroid.TOP);
                }
            } catch (errors) {
                console.log(errors);
            }
        } else {
            ToastAndroid.show('Department can not be empty', ToastAndroid.TOP);
        }
    }

    const getDepartment = async () => {
        try {
            setprogressVisible(true);
            const cId = await LocalStorage.GetData("companyId");
            setCompanyId(cId);
            await GetDepartmentByCompanyId(cId)
                .then(res => {
                    if (res !== null) {
                        if (res?.length > 0) {
                            const depList = [];
                            res?.forEach(function (item) {
                                const ob = {
                                    'Text': item.DepartmentName,
                                    'Value': item.Id
                                }
                                depList.push(ob);
                            });
                            setdepartmentList(depList);
                        }
                        setprogressVisible(false);
                    } else {
                        setdepartmentList([]);
                        setprogressVisible(false);
                    }
                })
                .catch(() => {
                    setprogressVisible(false);
                    console.log("error occured");
                });
        } catch (error) {
            setprogressVisible(false);
            console.log(error);
        }
    }
    return (
        <View style={DepartmentSetupStyle.container}>
            <StatusBarPlaceHolder />
            <Header
                title={'Department Setup'}
                onPress={() => { navigation.goBack() }}
                goBack={true}
                btnAction={() => setopenModal6(true)}
                btnTitle='NEW'
                btnContainerStyle={NoticeStyle.ApplyTextButtonforNotice}
                btnStyle={NoticeStyle.plusButtonforCompany}
            />
            <View style={DepartmentSetupStyle.FlatListContainer}>
                {progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, justifyContent: 'center', alignContent: 'center', }} />) : null}
                <FlatList
                    data={departmentList}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) =>
                        <View style={DepartmentSetupStyle.flatlistLeftItemcontainer}>
                            <View style={DepartmentSetupStyle.DepartmentNameTextCon}>
                                <Text style={DepartmentSetupStyle.DepartmentText}>{item.Text}</Text>
                            </View>
                            <TouchableOpacity onPress={() => _EditDept(item)}>
                                <View style={DepartmentSetupStyle.EditContainer}>
                                    <Image style={DepartmentSetupStyle.EditImage} source={require('../../../../assets/images/edit.png')}></Image>
                                    <Text style={DepartmentSetupStyle.EditText}>Edit</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
            <Modal style={[DepartmentSetupStyle.modalforDept]} position={"center"} isOpen={openModal6}
                backdropPressToClose={false}
            >
                <View style={DepartmentSetupStyle.modalheaderContainer}>
                    <View style={DepartmentSetupStyle.Leftheader}></View>
                    <View style={DepartmentSetupStyle.RightHeader}>
                        <TouchableOpacity onPress={() => setopenModal6(false)} style={DepartmentSetupStyle.MenuBackTouch}>
                            <Image resizeMode="contain" style={DepartmentSetupStyle.modalCloseImage} source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={DepartmentSetupStyle.modelContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                        Add Department
                    </Text>
                </View>
                <View style={{ alignSelf: "center" }}>
                    <TextInput style={DepartmentSetupStyle.TextInputStyle} placeholder="Department Name"
                        placeholderTextColor="#cbcbcb"
                        returnKeyType="next" autoCorrect={false}
                        onChangeText={(ename) => {
                            setDept({ DepartmentName: ename });
                        }}
                    />
                    <TouchableOpacity style={DepartmentSetupStyle.AddTouch} onPress={() => closeModal6()} >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal style={DepartmentSetupStyle.ModalUpContainer}
                position={"center"}
                isOpen={modalupdate}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <View style={DepartmentSetupStyle.modalheaderContainer}>
                    <View style={DepartmentSetupStyle.Leftheader}>
                    </View>
                    <View style={DepartmentSetupStyle.RightHeader}>
                        <TouchableOpacity onPress={() => setmodalupdate(false)}
                            style={DepartmentSetupStyle.MenuBackTouch}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginLeft: 0, marginTop: 15 }}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={DepartmentSetupStyle.Deptlable}>
                    <View style={{}}>
                        <Text
                            style={DepartmentSetupStyle.DeptlableText}>
                            Department Name:
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            style={DepartmentSetupStyle.Editinput}
                            value={DeptName}
                            onChangeText={(txt) => setDeptName(txt)}
                        />
                    </View>
                </View>
                <TouchableOpacity style={DepartmentSetupStyle.addPeopleBtn}
                    onPress={() => closemodalForupdate()} >
                    <Text
                        style={DepartmentSetupStyle.SaveText}>
                        Save
                    </Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

export default DepartmentSetupScreen;
