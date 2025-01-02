
export const toolsEndpoints =  {
getAll : "tool",
categories : "category/all"
}

export const authEndpoints =
{
    signup:"user/create",
    getProfile:"user/profile",
    googleAuth:"auth/google",
    facebookAuth:"auth/facebook",
    loginbyApi:"auth/login",
   
    
} 


export const orderApi = {
    getAll:"order/list",
}
export const userApi = {
    getAll:"user/list",
}
export const categoriesApi = {
    getAll:"category/list",
    create:"category/create",
    getbyId:"category/",
}