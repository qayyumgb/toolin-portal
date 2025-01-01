export interface loginDto {
    message: string
    profile: profileDto
}

export interface profileDto {
    address: string
    authMethod: string
    createdAt: string
    deletedAt: string
    email: string
    firstName: string
    lastName: string
    password: string
    role: string
    uid: string
    updatedAt: string
}