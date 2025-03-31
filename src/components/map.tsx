'use client';

import { useEffect, useState } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

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

    return (
        <MapComponent
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
                height: '100vh',
                width: '100vw'
            }}
        >
            {
                currentLocation && (
                    <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                        <Feature coordinates={currentLocation} />
                    </Layer>
                )
            }
        </MapComponent>
    );
}

export default Map;