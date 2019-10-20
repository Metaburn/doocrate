export const nav = (auth) => [
  {
    path: "/",
    icon: "home",
  },
  {
    path: "/about",
    icon: "help_outline",
  },
  {
    path: "/me",
    icon: "person",
    show: auth && auth.authenticated
  }
];
