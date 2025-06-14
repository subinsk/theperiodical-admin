export const paths = {
  dashboard: {
    gists: {
      create: "/dashboard/gists/create",
      edit: (slug: string) => `/dashboard/gists/${slug}`,
      list: "/dashboard/gists",
      page: "/dashboard/gists",
    },
    organization:{
      edit: (slug: string) => `/dashboard/settings/organization/${slug}`,
    },
    layout: "/dashboard",
  },
  home: "/",
  login: "/login",
  register: "/register",
  verify: "/verify",
};
