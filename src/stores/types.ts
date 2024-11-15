export interface Address {
  street?: string
  suite?: string
  city?: string
  zipcode?: string
  geo: {
    lat: string
    lng: string
  }
}

interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export interface Users {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
  showMap: boolean
}

export interface UserForm{
  name:string
  username:string
  email:string
  phone:string
  address:{lat:number, lng:number},
}
