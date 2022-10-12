import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SearchBar } from 'react-native-elements';

const Searchbar = ({ searchFilterFunction }) => {

    const [search, setsearch] = useState('');

    return (
        <>
            <SearchBar
                placeholder="Type Here..."
                lightTheme
                containerStyle={{ backgroundColor: '#f6f7f9', }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                round
                onChangeText={text => { setsearch(text); searchFilterFunction(text) }}
                autoCorrect={false}
                value={search}
            />
        </>
    )
}

export default Searchbar