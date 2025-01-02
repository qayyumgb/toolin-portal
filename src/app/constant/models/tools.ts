export interface toolsDto {
    id: string
    isAvailable: boolean,
    description: string
    isOperatorAvailable: boolean,
    ownerId: string
    createdOn: string
    priceDaily: number,
    mainImageIdx: number,
    priceWeekly: number,
    _geoloc: geoCordinates
    insuranceId: string
    isOwnerApproved: boolean,
    model: string
    brand: string
    category2: string
    category3: string
    images: string[]
    isPublished: boolean,
    category1: string
    marketValue: string
    priceMonthly: number,
    isDeliveryAvailable: boolean,
    streetAddress: string
    availableAfter: number,
    name: string
    availableBefore: number,
    hasInsurance: boolean,
    lowercase_name: string
}

export interface geoCordinates { lng: number, lat: number }
export interface dateTime { _seconds: number, _nanoseconds: number }

export type paginationDto = {
    count: number
    limit: number
    offset: number
    totalPages?: number
}




