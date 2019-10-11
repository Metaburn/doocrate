const filters = {
  user: (auth, value) =>  ({type: "user", uid: value}),
  complete: (auth, value) => ({type: "complete", text: value}),
  unassigned: (auth, value) => ({type: "unassigned"}),
  unassignedWithArtAndCamps: (auth, value) => ({type: "unassignedWithArtAndCamps"}),
  taskType: (auth, value) => ({type: "taskType", text: value}),
  label: (auth, value) => ({type: "label", text: value}),
  mine: (auth, value) => ({type: "user", uid: auth.id}),
  query: (auth, value) => ({type: "query", text: value}),
};

export function buildFilter(auth, type, value) {
  return filters[type](auth, value);
}


//=====================================
//  MEMOIZED SELECTORS
//-------------------------------------
export const taskFilters = {
  complete: (tasks, filter) => {
    // Show all
    if(!filter.text) {
      return tasks;
    }
    // Show completed tasks
    if(filter.text === "true") {
      return tasks.filter(task => task.isDone)
    }
    // Show in-completed tasks
    if(filter.text === "false") {
      return tasks.filter(task => !task.isDone)
    }
  },

  // Unassigned is free tasks which are not camps nor art
  unassigned: (tasks) => {
    return tasks.filter(task => !task.assignee &&
      (task.type && task.type.value !== 3) && (task.type && task.type.value !== 4));
  },

  // Unassigned is free tasks which are not camps nor art
  unassignedWithArtAndCamps: (tasks) => {
    return tasks.filter(task => !task.assignee);
  },

  label: (tasks, filter) => {
    return tasks.filter(task => {
      return task.label && task.label[filter.text];
    });
  },

  taskType: (tasks, filter) => {
    return tasks.filter(task => {
      return task.type && task.type.value === parseInt(filter.text, 10);
    });
  },

  user: (tasks, filter) => {
    const auth = filter.uid;
    return tasks.filter(task =>
      {
        return ((task.assignee && (task.assignee.id === auth)) ||
          (task.creator && task.creator.id === auth));
      });
  },

  query: (tasks, filter) => {
    if(!filter.text){
      return tasks;
    }
    return tasks.filter(task =>
    {
      return (task.title && task.title.includes(filter.text)) || (task.description && task.description.includes(filter.text))
    });
  },

};
