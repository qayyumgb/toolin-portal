import { paginationDto } from "./tools"

export interface userReturnDto{
    data:userDto[]
    pagination:paginationDto
  }
export interface userDto{

        id:string
        firstName:string
        lastName:string
        uid:string
        createdAt:string
        password:string
        deletedAt:string
        role:string
        address:string
        authMethod:string
        email:string
        updatedAt:string
      
  }
