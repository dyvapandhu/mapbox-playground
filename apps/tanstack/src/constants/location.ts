import type { Location } from '#/types/map'

export const CITIES: Location[] = [
  {
    label: 'Indonesia (Default)',
    longitude: 118.0149,
    latitude: -2.5489,
    zoom: 4.2,
    pitch: 0,
    bearing: 0,
  },
  {
    label: 'Jakarta',
    longitude: 106.829764,
    latitude: -6.175488,
    zoom: 16, // Zoom in closer to see buildings
    pitch: 60, // Better angle for 3D buildings
    bearing: -20, // Angled view
  },
  {
    label: 'Surabaya',
    longitude: 112.7378749,
    latitude: -7.2457773,
    zoom: 16,
    pitch: 60,
    bearing: -20,
  },
]
