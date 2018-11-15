'use strict';

// Max number of tasks per creator
const MAX_TASK_PER_CREATOR = 80;

const taskIsDeletedOrMalformedTask = task => !task || !task.creator || !task.creator.id;

const userTasksQuotaReached = snapshot => !!snapshot && snapshot.size >= MAX_TASK_PER_CREATOR;

module.exports = {taskIsDeletedOrMalformedTask, userTasksQuotaReached};
