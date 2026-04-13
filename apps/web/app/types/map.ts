export interface Location {
  label: string
  longitude: number
  latitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

export interface DataLayer {
  label: string
  tilesetId: string
  sourceLayer: string
}
export interface WaybackConfigEntry {
  itemID: string
  itemTitle: string
  itemURL: string
  metadataLayerUrl: string
  metadataLayerItemID: string
  layerIdentifier: string
}

export type WaybackConfigRaw = Record<string, WaybackConfigEntry>

export interface WaybackItem extends WaybackConfigEntry {
  releaseNum: number
  dateLabel: string
}

export interface Marker {
  longitude: number
  latitude: number
}

export type ResourceType = 'palm' | 'wheat' | 'corn' | 'coconut'

export interface Cluster {
  id: number
  longitude: number
  latitude: number
  resources: ResourceType[]
}

export interface IconGroupProps {
  resources: ResourceType[]
  zoom: number
  overlap?: 'sm' | 'md' | 'lg'
}

export interface IconProps {
  size?: number
}
