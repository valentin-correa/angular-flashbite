export interface Zone {
    id: number 
    name: string
    location: {lat: string, lng: string}
    radius: number
    deliveries: number[]
}

export interface ZoneWithoutID {
    id: number
    name: string
    location: {lat: string, lng: string}
    radius: number
}