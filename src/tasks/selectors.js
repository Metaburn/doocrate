import { createSelector } from 'reselect';

const filters = {
  user: (auth, value) => ({ type: 'user', uid: value }),
  userOnlyCreator: (auth, value) => ({ type: 'userOnlyCreator', uid: value }),
  userOnlyAssignee: (auth, value) => ({ type: 'userOnlyAssignee', uid: value }),
  complete: (auth, value) => ({ type: 'complete', text: value }),
  unassigned: (auth, value) => ({ type: 'unassigned' }),
  critical: (auth, value) => ({ type: 'critical' }),
  unassignedWithArtAndCamps: (auth, value) => ({
    type: 'unassignedWithArtAndCamps',
  }),
  taskType: (auth, value) => ({ type: 'taskType', text: value }),
  label: (auth, value) => ({ type: 'label', text: value }),
  mine: (auth, value) => ({ type: 'userOnlyAssignee', uid: auth.id }),
  query: (auth, value) => ({ type: 'query', text: value }),
};

export function buildFilter(auth, type, value) {
  return filters[type](auth, value);
}

export const labelsPoolSelector = ({ tasks }) => tasks.labelsPool;

export const getLabelsPool = createSelector(
  labelsPoolSelector,
  labelsPool => labelsPool,
);

//=====================================
//  MEMOIZED SELECTORS
//-------------------------------------
export const taskFilters = {
  complete: (tasks, filter) => {
    // Show all
    if (!filter.text) {
      return tasks;
    }
    // Show completed tasks
    if (filter.text === 'true') {
      return tasks.filter(task => task.isDone);
    }
    // Show in-completed tasks
    if (filter.text === 'false') {
      return tasks.filter(task => !task.isDone);
    }
  },

  // Unassigned is free tasks which are not camps nor art
  unassigned: tasks => {
    return tasks.filter(
      task =>
        !task.assignee &&
        task.type &&
        task.type.value !== 3 &&
        task.type &&
        task.type.value !== 4,
    );
  },

  // Unassigned is free tasks which are not camps nor art
  unassignedWithArtAndCamps: tasks => {
    return tasks.filter(task => !task.assignee);
  },

  label: (tasks, filter) => {
    return tasks.filter(task => {
      return (
        task.label &&
        ((!Array.isArray(filter.text) && task.label[filter.text]) ||
          (Array.isArray(filter.text) &&
            filter.text.filter(x => task.label[x]).length > 0))
      );
    });
  },

  taskType: (tasks, filter) => {
    return tasks.filter(task => {
      return task.type && task.type.value === parseInt(filter.text, 10);
    });
  },

  user: (tasks, filter) => {
    const auth = filter.uid;
    return tasks.filter(task => {
      return (
        (task.assignee && task.assignee.id === auth) ||
        (task.creator && task.creator.id === auth)
      );
    });
  },

  userOnlyCreator: (tasks, filter) => {
    const auth = filter.uid;
    return tasks.filter(task => {
      return task.creator && task.creator.id === auth;
    });
  },

  userOnlyAssignee: (tasks, filter) => {
    const auth = filter.uid;
    return tasks.filter(task => {
      return task.assignee && task.assignee.id === auth;
    });
  },

  critical: (tasks, filter) => {
    return tasks.filter(task => {
      return task.isCritical === true;
    });
  },

  query: (tasks, filter) => {
    if (!filter.text) {
      return tasks;
    }
    return tasks.filter(task => {
      const filterText = filter.text.toLowerCase();
      const taskTitle = task.title.toLowerCase();
      const taskDescription = task.description.toLowerCase();
      const creatorName =
        task.creator && task.creator.name
          ? task.creator.name.toLowerCase()
          : null;
      const assigneeName = task.assignee ? task.assignee.name : null;

      return (
        taskTitle.includes(filterText) ||
        taskDescription.includes(filterText) ||
        (creatorName && creatorName.includes(filterText)) ||
        (assigneeName && assigneeName.includes(filterText))
      );
    });
  },
};
