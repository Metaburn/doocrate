export const nav = (auth, projectUrl) => [
  {
    path: "/" + projectUrl + '/task/1',
    pathIncludes: "/" + projectUrl, //To support only being active with /project/test/anything?anyquery
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
