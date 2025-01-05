export interface toolsDto  {
    id:string,
    brand:string,
    name:string,
    description:string,
    images: string[],
    hasInsurance: boolean,
    isAvailable: boolean,
    isOperatorAvailable: boolean,
    isOwnerApproved: boolean,
    marketValue:string
    model:string
    priceDaily:   string,
    priceMonthly: string,
    priceWeekly:  string,
    streetAddress:string
    isDeliveryAvailable: boolean,
    isPublished: boolean,
    lowercase_name:string
    createdOn: {
        "_seconds": 1735774802,
        "_nanoseconds": 449000000
    },
    deletedAt: any,
    owner: {
        firstName:string
        lastName:string
        email:string
        password:string
        address:string
        uid:string
        createdAt:string
        updatedAt:string
        deletedAt:string
        authMethod:string
        role:string
    },
    _geoloc: geoCordinates,
    categories: categories[]
    updatedOn: dateTime
}

export interface geoCordinates { lng: number, lat: number }
export interface dateTime { _seconds: number, _nanoseconds: number }

export type paginationDto = {
    count: number
    limit: number
    offset: number
    totalPages?: number
}


export interface toollist{
    data: toolsDto[]
    pagination:paginationDto
} 

export interface categories 
    {
        name:string
        image:string
        description:string
        createdBy: {
            firstName:string
            lastName:string
            email:string
            password:string
            address:string
            uid:string
            createdAt:string
            updatedAt:string
            deletedAt:string
            authMethod:string
            role:string
        },
        createdOn: dateTime
        updatedOn: dateTime
    }

