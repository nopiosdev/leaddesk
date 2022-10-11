import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TaskLists from './TaskListRowCompoent';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});




const TaskListComponent = (props) => (

    <View style={styles.container}>
        <FlatList
            keyboardShouldPersistTaps='always'
            data={props.itemList}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({ item }) => <TaskLists navigation={props?.navigation} itemData={item} />}
            refreshControl={props?.refreshControl}
        />

    </View>
);

export default TaskListComponent;
