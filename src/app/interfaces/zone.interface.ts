export interface Zone {
    id: number 
    name: string
    location: {lat: number, lng: number}
    radius: number
}

export interface ZoneWithoutID {
    name: string
    location: {lat: number, lng: number}
    radius: number
}