export const paths = {
  dashboard: {
    gists: {
      create: "/dashboard/gists/create",
      edit: (slug: string) => `/dashboard/gists/edit/${slug}`,
      list: "/dashboard/gists",
      page: "/dashboard/gists",
    },
    layout: "/dashboard",
  },
  home: "/",
  login: "/login",
  register: "/register",
  verify: "/verify",
};
