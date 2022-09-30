import * as Location from 'expo-location';

export const getLocation = async (currentLatitude, currentLongitude) => {
    var pos = {
        latitude: parseFloat(currentLatitude),
        longitude: parseFloat(currentLongitude),
    };
    let location = null;
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            await Location.reverseGeocodeAsync(pos).then(res => {
                let addressformate = res[0].street + ", " + res[0].city + ", " + res[0].country
                location = addressformate;
            })
        }
    } catch (error) {
        console.error(error);
    }
    return location;
}