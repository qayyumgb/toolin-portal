import { Routes } from '@angular/router';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { OrderComponent } from './core/pages/order/order.component';
import { OrderDetailComponent } from './core/components/order-detail/order-detail.component';
import { OrderListComponent } from './core/components/order-list/order-list.component';
import { AddToolComponent } from './core/components/add-tool/add-tool.component';
import { ToolComponent } from './core/pages/tool/tool.component';
import { ToolListComponent } from './core/components/tool-list/tool-list.component';
import { ToolDetailComponent } from './core/components/tool-detail/tool-detail.component';
import { CategoryComponent } from './core/pages/category/category.component';
import { UserComponent } from './core/pages/user/user.component';
import { AuthComponent } from './core/auth/auth.component';
import { LoginComponent } from './core/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout.component';
import { authGuard, isNotLogin } from './constant/auth.guard';
import { CategoryListComponent } from './core/pages/category/category-list/category-list.component';
import { AddCategoryComponent } from './core/pages/category/add-category/add-category.component';

export const routes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        canActivate:[authGuard],
        children:[
            {
                path: "order",
                component: OrderComponent,
                children: [
                    {
                        path: "",
                        component: OrderListComponent
                    },
                    {
                        path: "details",
                        component: OrderDetailComponent,
                    },
                ]
            },
           
            {
                path: "tools",
                component: ToolComponent,
                children: [
                    {
                        path: "",
                        component: ToolListComponent
                    },
                    {
                        path: "details/:id",
                        component: ToolDetailComponent,
                    },
                    {
                        path: "add",
                        component: AddToolComponent,
                    },
                    {
                        path: "edit/:id",
                        component: AddToolComponent,
                    },
                ]
            },
            {
                path: "cateogry",
                component: CategoryComponent,
                children:[
                    {
                        path:"",
                        component:CategoryListComponent
                    },
                    {
                        path:"new",
                        component:AddCategoryComponent
                    },
                ]
                
            },
            {
                path: "user",
                component: UserComponent,
                
            },
            {
                path: "",
                component: DashboardComponent,
                pathMatch: 'full',
            },
           
        ]
    },
    {
        path: "auth",
        component: AuthComponent,
        canActivate:[isNotLogin],
        children: [
            {
                path: "",
                component: LoginComponent
            },
           
        ]
    },
    
];
