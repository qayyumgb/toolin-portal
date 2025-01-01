import { dateTime, geoCordinates,paginationDto } from "./tools"

export interface orderDto {
    availableAfter: number
    availableBefore: number
    brand: string
    category1: string
    category2: string
    category3: string
    createdOn: dateTime
    description: string
    hasInsurance: boolean
    id: string
    images: string[]
    insuranceId: string
    isAvailable: boolean
    isDeliveryAvailable: boolean
    isOperatorAvailable: boolean
    isOwnerApproved: boolean
    isPublished: boolean
    lowercase_name: string
    mainImageIdx: number
    marketValue: string
    model: string
    name: string
    ownerId: string
    priceDaily: number
    priceMonthly: number
    priceWeekly: number
    streetAddress: string
    updatedOn: dateTime
    _geoloc: geoCordinates
}

export interface orderReturnDto {
    pagination:paginationDto,
    data:orderDto[]
} 