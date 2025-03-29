'use client';

import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';

const MapComponent = ReactMapboxGl({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '',
});

const Map = () => {
    const [currentLocation, setCurrentLocation] = useState<[number, number]>();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCurrentLocation([pos.coords.latitude, pos.coords.longitude])
            });
        }
    }, []);
    console.log({currentLocation})

    return (
        <MapComponent
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
                height: '100vh',
                width: '100vw'
            }}
        >
            <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                <Feature coordinates={currentLocation ? currentLocation : [-0.481747846041145, 51.3233379650232]} />
            </Layer>
        </MapComponent>
    );
}

export default Map;