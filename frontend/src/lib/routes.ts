export const routes = {
    dashboard: {
        base: "/dashboard",
        branchManagement: {
            base: "/dashboard/branchmanagement",
            create: "/dashboard/branchmanagement/create",
            edit: (id: string) => `/dashboard/branchmanagement/edit/${id}`,
            view: (id: string) => `/dashboard/branchmanagement/view/${id}`,
        },
        newAssetManagement: {
            base: "/dashboard/newassetmanagement",
            create: "/dashboard/newassetmanagement/create",
            edit: (id: string) => `/dashboard/newassetmanagement/edit/${id}`,
            view: (id: string) => `/dashboard/newassetmanagement/view/${id}`,
        },
        userManagement: {
            base: "/dashboard/usermanagement",
            create: "/dashboard/usermanagement/create",
            edit: (id: string) => `/dashboard/usermanagement/edit/${id}`,
            view: (id: string) => `/dashboard/usermanagement/view/${id}`,
        },
    }
}