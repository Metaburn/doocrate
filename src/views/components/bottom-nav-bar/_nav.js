export const nav = (auth, projectUrl) => [
  {
    path: "/" + projectUrl + "/task/1",
    pathIncludes: "/" + projectUrl + "/task/", //To support only being active with /project/test/anything?anyquery
    icon: "home",
  },
  {
    path: "/about",
    icon: "help_outline",
  },
  {
    path: "/" + projectUrl + "/me",
    dataTour: "four",
    icon: "person",
    show: auth && auth.authenticated
  }
];
