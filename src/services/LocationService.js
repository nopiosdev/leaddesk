import * as Location from 'expo-location';

export const getLocation = async (currentLatitude, currentLongitude) => {
    console.log(currentLatitude, currentLongitude)
    var pos = {
        latitude: parseFloat(currentLatitude),
        longitude: parseFloat(currentLongitude),
    };
    let location = null;
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let { status2 } = await Location.requestBackgroundPermissionsAsync();
        if (status === 'granted') {
            await Location.reverseGeocodeAsync(pos).then(res => {
                console.log('reverseGeocodeAsync', res)
                let addressformate = (res[0].street ? (res[0].street + ", ") : "") + (res[0].city ? (res[0].city + ", ") : "") + (res[0].country && (res[0].country));
                location = addressformate;
            })
        }
    } catch (error) {
        console.error(error);
    }
    return location;
}