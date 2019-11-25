const firebase = require('@firebase/testing');
const fs = require('fs');

/*
 * ============
 *    Setup
 * ============
 */
const firebaseProjectId = 'firestore-rules-test';
const databaseName = 'doocrate-test';
const firebasePort = require('../firebase.json').emulators.firestore.port;
const port = firebasePort /** Exists? */ ? firebasePort : 8080;
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${firebaseProjectId}:ruleCoverage.html`;

const rules = fs.readFileSync('./rules/firestore.rules', 'utf8');

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase
    .initializeTestApp({ projectId: firebaseProjectId, auth, databaseName })
    .firestore();
}

/**
 * Creates a new app with ADMIN authentication data
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function adminApp() {
  return firebase
    .initializeAdminApp({ projectId: firebaseProjectId, databaseName })
    .firestore();
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
  await firebase.clearFirestoreData({ projectId: firebaseProjectId });
});

before(async () => {
  await firebase.loadFirestoreRules({ projectId: firebaseProjectId, rules });
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

describe('## Doocrate Rules', () => {
  describe('## Users', async () => {
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

    it('should let super admin to edit any profile', async () => {
      // First we create a super admin
      const superAdminUid = 'super_admin';
      const adminDb = adminApp();
      await initializeSuperAdmin(adminDb, superAdminUid);

      const db = authedApp({ uid: 'super_admin' });

      db.collection('users')
        .doc('testyoni')
        .set({
          bio: 'new bio',
        });
    });
  });

  describe('## projects', async () => {
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

    it('should not let unauth users to create a project', async () => {
      const db = authedApp(null);
      const project = db.collection('projects').doc('my_unit_test_project');
      await firebase.assertFails(
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

      const db = authedApp({ uid: superAdminUid });
      db.collection('projects')
        .doc('testyoni')
        .set({
          name: 'new title',
        });
    });

    it('should let only authed creator to edit a project', async () => {
      const db = authedApp({ uid: 'alice' });

      const proj1 = 'my_unit_test_project';
      const project = db.collection('projects').doc(proj1);

      await project.set({
        isPublic: true,
        name: 'Unit test project',
        taskTypes: ['test1', 'test2'],
      });

      await firebase.assertFails(
        authedApp({ uid: 'guy' })
          .collection('projects')
          .doc(proj1)
          .set({
            isPublic: false,
          }),
      );
    });
  });

  describe('### tasks', async () => {
    const projectDocId = 'testyoni';
    const taskId = 'some_task';
    let adminDb = null;
    const aliceTaskCreator = {
      email: 'alice@test.com',
      db: null,
      uid: 'alice',
    };

    const guyTaskParticipant = {
      email: 'guy@test.com',
      uid: 'guy',
      db: null,
    };

    beforeEach(async () => {
      // First we create a super admin so we can create the listeners
      const superAdminUid = 'super_admin';
      adminDb = adminApp();
      await initializeSuperAdmin(adminDb, superAdminUid);

      // Next we add alice to list of invites
      const invites = [aliceTaskCreator.email, guyTaskParticipant.email];
      await initializeInvites(adminDb, projectDocId, invites);

      // have 1 task
      aliceTaskCreator.db = authedApp({
        uid: aliceTaskCreator.uid,
        email: aliceTaskCreator.email,
      });
      await firebase.assertSucceeds(
        aliceTaskCreator.db
          .collection('projects')
          .doc(projectDocId)
          .collection('tasks')
          .doc(taskId)
          .set({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            title: 'Task title',
            description: 'Task description',
            creator: {
              email: aliceTaskCreator.email,
              id: aliceTaskCreator.uid,
              data: {
                id: aliceTaskCreator.uid,
              },
            },
          }),
      );
    });

    it('admin should be able to create update delete tasks', async () => {
      const someonesDoc = adminDb
        .collection('projects')
        .doc(projectDocId)
        .collection('tasks')
        .doc('taskID');
      await firebase.assertSucceeds(someonesDoc.get());
      await firebase.assertSucceeds(someonesDoc.set({ title: '' }));
    });

    it('should let only project invites to create tasks', async () => {
      // We need to see that another user doesn't have access
      const notInvitedDb = authedApp({ uid: 'bob', email: 'bob@test.com' });
      // exist task doc
      await firebase.assertFails(
        notInvitedDb
          .collection('projects')
          .doc(projectDocId)
          .collection('tasks')
          .doc(taskId)
          .set({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            title: 'Task title',
            description: 'Task description',
          }),
      );

      // Same check for a new task doc
      await firebase.assertFails(
        notInvitedDb
          .collection('projects')
          .doc(projectDocId)
          .collection('tasks')
          .doc('newTask')
          .set({
            created: firebase.firestore.FieldValue.serverTimestamp(),
            title: 'Task title',
            description: 'Task description',
          }),
      );
    });

    it('should allow full update for invited creator', async () => {
      await firebase.assertSucceeds(
        aliceTaskCreator.db
          .collection('projects')
          .doc(projectDocId)
          .collection('tasks')
          .doc(taskId)
          .set({
            title: '',
            description: 'Task description',
          }),
      );
    });

    it('should allow self assign non-assigned task for invited', async () => {
      const anotherInvitedDb = authedApp({
        uid: guyTaskParticipant.uid,
        email: guyTaskParticipant.email,
      });
      const documentReference = anotherInvitedDb
        .collection('projects')
        .doc(projectDocId)
        .collection('tasks')
        .doc(taskId);

      // update non-assigned task without assigning it
      await firebase.assertFails(
        documentReference.set({
          title: '',
          description: 'Task description',
        }),
      );

      // assign it
      await firebase.assertSucceeds(
        documentReference.set({
          assignee: {
            email: guyTaskParticipant.email,
            id: guyTaskParticipant.uid,
          },
        }),
      );
    });

    it('should allow full update for invited assigned user', async () => {
      const anotherInvitedDb = authedApp({
        uid: guyTaskParticipant.uid,
        email: guyTaskParticipant.email,
      });
      const documentReference = anotherInvitedDb
        .collection('projects')
        .doc(projectDocId)
        .collection('tasks')
        .doc(taskId);

      // assign it
      await firebase.assertSucceeds(
        documentReference.set({
          assignee: {
            email: guyTaskParticipant.email,
            id: guyTaskParticipant.uid,
          },
        }),
      );

      await firebase.assertSucceeds(
        documentReference.set({
          title: 'abc',
        }),
      );
    });

    it('should allow anyone (non invited) to listen to a task', async () => {
      // Next we initialize a user without permission to project
      const db = authedApp({ uid: 'bob', email: 'bob@test.com' });
      const task = db
        .collection('projects')
        .doc(projectDocId)
        .collection('tasks')
        .doc(taskId);
      await firebase.assertSucceeds(
        task.set({
          listeners: ['bob', 'alice@test.com'],
        }),
      );

      // 1 field which is not listener
      await firebase.assertFails(
        task.set({
          title: 'no title',
        }),
      );

      // 2 fields including listeners
      await firebase.assertFails(
        task.set({
          listeners: ['bob', 'alice@test.com'],
          title: 'no title',
        }),
      );
    });
  });
});
