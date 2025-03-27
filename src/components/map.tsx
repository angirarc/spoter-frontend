'use client';

import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
let x = {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '',
}
console.log(x);

const MapComponent = ReactMapboxGl(x);

const Map = () => (
    <MapComponent
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
            height: '100vh',
            width: '100vw'
        }}
    >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
    </MapComponent>
);

export default Map;