export function initializeApp() {
  checkIfNeedsRefresh();
}

// Since we don't know how to solve firebase cache issues
// we manually refresh the page every 1 hours like it's the 90's
const checkIfNeedsRefresh = () => {
  const oneDay = 60 * 60 * 1000 * 1;
  try {
    const storage = window.localStorage;
    const lastRefreshStorage = storage.getItem('lastRefresh');
    if (!lastRefreshStorage) {
      storage.setItem('lastRefresh', new Date().toUTCString());
    } else {
      const now = new Date();
      const lastRefresh = new Date(lastRefreshStorage);
      const isMoreThenOneHours = (now - lastRefresh) >= oneDay;
      if (isMoreThenOneHours) {
        storage.setItem('lastRefresh', now.toUTCString());
        refreshPage();
      }
    }
  } catch (e) {
    console.log({e});
  }
};

const refreshPage = () => {
  window.location.reload(true);
};
