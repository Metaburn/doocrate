import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React, {
    groupByComponent: true,
    collapseComponentGroups: true,
    exclude: [/node_modules/],
    // include: "TaskView"
  });
}
