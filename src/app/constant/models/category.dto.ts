import { dateTime } from "./tools"

export interface categoryDto {
    createdOn: dateTime
    description: string
    id: string
    image: string
    name: string
    updatedOn: dateTime
}