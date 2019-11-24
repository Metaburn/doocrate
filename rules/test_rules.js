const firebase = require('@firebase/testing');
const fs = require('fs');

/*
 * ============
 *    Setup
 * ============
 */
const projectId = 'firestore-rules-test';
const databaseName = 'doocrate-test';
const firebasePort = require('../firebase.json').emulators.firestore.port;
const port = firebasePort /** Exists? */ ? firebasePort : 8080;
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync('./rules/firestore.rules', 'utf8');

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase
    .initializeTestApp({ projectId, auth, databaseName })
    .firestore();
}

/**
 * Creates a new app with ADMIN authentication data
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function adminApp() {
  return firebase.initializeAdminApp({ projectId, databaseName }).firestore();
}

/**
 * This helps us set a project invites to test invites
 * @param db Firestore db
 * @param projectId project id
 * @param invites array of invites
 */
function initializeInvites(db, projectId, invites) {
  return db
    .collection('projects')
    .doc(projectId)
    .collection('invitation_lists')
    .doc('main')
    .set({
      invites: invites,
    });
}

/**
 * Create a super admin - super admin have more permissions
 * @param db
 * @param superAdminId
 */
function initializeSuperAdmin(db, superAdminId) {
  return db
    .collection('super_admins')
    .doc(superAdminId)
    .set({
      name: 'Super Admin',
    });
}

/*
 * ============
 *  Test Cases
 * ============
 */
beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId });
});

before(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

describe('Doocrate Rules', () => {
  it('require users to log in before creating a profile', async () => {
    const db = authedApp(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.set({ bio: 'My bio' }));
  });

  it('should only let users update their own profile', async () => {
    const db = authedApp({ uid: 'alice' });
    await firebase.assertSucceeds(
      db
        .collection('users')
        .doc('alice')
        .set({
          bio: 'My new bio',
        }),
    );
    await firebase.assertFails(
      db
        .collection('users')
        .doc('bob')
        .set({
          bio: 'Another user bio',
        }),
    );
  });

  it('should not let unauth users to read any profile', async () => {
    const db = authedApp(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.get());
  });

  it('should let auth users to read any profile', async () => {
    const db = authedApp({ uid: 'alice' });
    const profile = db.collection('users').doc('alice');
    await firebase.assertSucceeds(profile.get());
  });

  it('should let anyone create a project', async () => {
    const db = authedApp({ uid: 'alice' });
    const project = db.collection('projects').doc('my_unit_test_project');
    await firebase.assertSucceeds(
      project.set({
        isPublic: true,
        name: 'Unit test project',
        taskTypes: ['test1', 'test2'],
      }),
    );
  });

  it('should let super admin to edit any project', async () => {
    // First we create a super admin
    const superAdminUid = 'super_admin';
    const adminDb = adminApp();
    await initializeSuperAdmin(adminDb, superAdminUid);

    const db = authedApp({ uid: 'super_admin' });
    db.collection('projects')
      .doc('testyoni')
      .set({
        name: 'new title',
      });
  });

  it('should let only project invites to create tasks', async () => {
    // First we create a super admin so we can create the listeners
    const superAdminUid = 'super_admin';
    const adminDb = adminApp();
    await initializeSuperAdmin(adminDb, superAdminUid);

    // Next we add alice to list of invites
    const invites = ['alice@test.com'];
    await initializeInvites(adminDb, 'testyoni', invites);

    // Next check if we can create a task
    const db = authedApp({ uid: 'alice', email: 'alice@test.com' });

    await firebase.assertSucceeds(
      db
        .collection('projects')
        .doc('testyoni')
        .collection('tasks')
        .doc('some_task')
        .set({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          title: 'Task title',
          description: 'Task description',
        }),
    );

    // Next we need to see that another user doesn't have access
    const bobDb = authedApp({ uid: 'bob', email: 'bob@test.com' });
    await firebase.assertFails(
      bobDb
        .collection('projects')
        .doc('testyoni')
        .collection('tasks')
        .doc('some_task')
        .set({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          title: 'Task title',
          description: 'Task description',
        }),
    );
  });

  it('should allow anyone to listen to a task', async () => {
    // First we create a super admin so we can create the listeners
    const superAdminUid = 'super_admin';
    const adminDb = adminApp();
    await initializeSuperAdmin(adminDb, superAdminUid);

    // Next we initialize invites
    const invites = ['alice@test.com'];
    await initializeInvites(adminDb, 'testyoni', invites);

    // Next we initialize a task
    await firebase.assertSucceeds(
      adminDb
        .collection('projects')
        .doc('testyoni')
        .collection('tasks')
        .doc('some_task')
        .set({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          title: 'Task title',
          description: 'Task description',
        }),
    );

    // Next we initialize a user without permission to project
    const db = authedApp({ uid: 'bob', email: 'bob@test.com' });
    await firebase.assertSucceeds(
      db
        .collection('projects')
        .doc('testyoni')
        .collection('tasks')
        .doc('some_task')
        .set({
          listeners: ['bob', 'alice@test.com'],
        }),
    );
  });
});
