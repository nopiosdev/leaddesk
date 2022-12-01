import { View, Text, Image, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
const TaskBottomTabs = ({ navigation }) => {
    const [active, setActive] = useState('Pending');
    const [userActive, setUserActive] = useState('Assigned');
    const user = useSelector((state) => state.user.currentUser);
    const isFocused = useIsFocused();
    const route = useRoute();
    // useEffect(() => {
    //   setActive('Pending')
    // }, [isFocused])
    
    return (
        <View style={{ borderTopWidth: 0.5, flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
            {user?.UserType == 'admin' ?
                <>
                    <Pressable onPress={() => { setActive('Pending'); navigation.navigate('TaskListScreen') }} style={{ zIndex: 1, width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {active === 'Pending' ? <Image source={require('../../assets/images/list_s.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image> : <Image source={require('../../assets/images/list_a.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                        }
                        <Text style={{ marginTop: 10, color: active === 'Pending' ? 'purple' : 'black', marginLeft: 10 }}>Pending</Text>
                    </Pressable>

                    <Pressable onPress={() => { setActive('Completed'); navigation.navigate('CompleteTaskFilter') }} style={{ zIndex: 1, width: '50%', flexDirection: 'row', alignItems: 'center' }}>
                        {active === 'Completed' ? <Image source={require('../../assets/images/com.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                            : <Image source={require('../../assets/images/com_a.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15, marginLeft: 5, }}></Image>
                        }
                        <Text style={{ marginTop: 10, color: active === 'Completed' ? 'purple' : 'black', marginLeft: 10 }}>Completed</Text>
                    </Pressable>
                </>
                :
                <>
                    <Pressable onPress={() => { setUserActive('Assigned'); navigation.navigate('TaskListScreen') }} style={{ zIndex: 1, width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name="account-arrow-left" size={23} color={userActive === 'Assigned' ? "#2c82a1" : "#4a535b"} style={{ marginTop: 10 }} />
                        <Text style={{ marginTop: 10, color: userActive === 'Assigned' ? 'purple' : 'black', marginLeft: 10 }}>Assigned To Me</Text>
                    </Pressable>

                    <Pressable onPress={() => { setUserActive('Created'); navigation.navigate('CompleteTaskFilter') }} style={{ zIndex: 1, width: '50%', flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="card-bulleted-outline" size={30} color={userActive === 'Created' ? "#2c82a1" : "#4a535b"} style={{ marginTop: 10 }} />
                        <Text style={{ marginTop: 10, color: userActive === 'Created' ? 'purple' : 'black', marginLeft: 10 }}>Created By Me</Text>
                    </Pressable>
                </>
            }
        </View>
    );
}

export default TaskBottomTabs;