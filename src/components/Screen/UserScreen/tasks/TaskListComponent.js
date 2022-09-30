import React from 'react';
import { View, FlatList, StyleSheet,RefreshControl,Platform,StatusBar } from 'react-native';
import TaskLists from './TaskListRowCompoent';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});




const TaskListComponent = (props) => (

    <View style={styles.container}>
           
        <FlatList
       
            data={props.itemList}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({ item }) => <TaskLists itemData={item} />
            }            
        />

    </View>
);

export default TaskListComponent;
