import { dateTime, geoCordinates, paginationDto } from "./tools"

export interface orderdetail {
    grandTotal:number
    id:string
    isActive: boolean,
    isPaid: boolean
    items: itemsDto[]
    orderBy: orderDto
    shippingCharges:number
    status:string,
    subTotal:number
    tax:number
}
export interface orderReturnDto {
    pagination: paginationDto,
    data: orderDto[]
}
export interface orderDto {
    role:string
    firstName:string
    lastName:string
    email:string
    password:string
    address:string
    uid:string
    createdAt:string
    updatedAt:string
    deletedAt:boolean
    authMethod:string
}
export interface itemsDto {
    toolId: string,
    fromTimestamp: number,
    toTimestamp: number,
    totalPrice: number,
    unitPrice: number,
    tool: tooDto
}
export interface tooDto {
    isAvailable: boolean,
    description: string
    isOperatorAvailable: boolean,
    ownerId: string
    createdOn: dateTime
    priceDaily: 18400,
    mainImageIdx: 0,
    priceWeekly: 16560,
    _geoloc: geoCordinates
    insuranceId: string
    isOwnerApproved: boolean,
    model: string
    brand: string
    category2: string
    category3: string
    images: string[],
    isPublished: boolean,
    category1: string
    marketValue: string
    priceMonthly: 14720,
    isDeliveryAvailable: boolean,
    streetAddress: string
    availableAfter: 1619364022,
    name: string
    availableBefore: 1619277622,
    hasInsurance: boolean,
    lowercase_name: string

} 