import { createSelector } from 'reselect';

const filters = {
  user: (auth, value) =>  ({type: "user", uid: value}),
  complete: (auth, value) => ({type: "complete"}),
  unassigned: (auth, value) => ({type: "unassigned"}),
  unassignedWithArtAndCamps: (auth, value) => ({type: "unassignedWithArtAndCamps"}),
  taskType: (auth, value) => ({type: "taskType", text: value}),
  label: (auth, value) => ({type: "label", text: value}),
  mine: (auth, value) => ({type: "user", uid: auth.id})
}

export function buildFilter(auth, type, value) {
  return filters[type](auth, value);
}

//=====================================
//  MEMOIZED SELECTORS
//-------------------------------------
export const taskFilters = {
  complete: (tasks, filter) => {
    return tasks.filter(task => task.completed)
  },

  // Unassigned is free tasks which are not camps nor art
  unassigned: (tasks, filter) => {
    return tasks.filter(task => !task.assignee &&
      task.type != 3 && task.type != 4);
  },

    // Unassigned is free tasks which are not camps nor art
  unassignedWithArtAndCamps: (tasks, filter) => {
    return tasks.filter(task => !task.assignee);
  },

  label: (tasks, filter) => {
    return tasks.filter(task => {
      return task.label && task.label[filter.text];
    });
  },

  taskType: (tasks, filter) => {
    return tasks.filter(task => {
      return task.type && task.type == filter.text;
    });
  },

  user: (tasks, filter) => {
    const auth = filter.uid;
    return tasks.filter(task =>
      {
        return ((task.assignee && (task.assignee.id === auth)) ||
          (task.creator && task.creator.id === auth));
      });
  }
}
