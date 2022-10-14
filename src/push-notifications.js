// https://www.udemy.com/course/progressive-web-app-pwa-the-complete-guide/
// https://izaanjahangir.medium.com/setting-schedule-push-notification-using-node-js-and-mongodb-95f73c00fc2e

export function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    if (result === "granted") {
      confirmPushSub();
    }
  });
}

function displayConfirmation() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((serviceWorkerRegister) => {
      serviceWorkerRegister.showNotification("Successfully Subscribed!");
    });
  }
}

function confirmPushSub() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  let register;

  navigator.serviceWorker.ready
    .then((serviceWorkerRegister) => {
      register = serviceWorkerRegister;
      return serviceWorkerRegister.pushManager.getSubscription();
    })
    .then((subscription) => {
      if (subscription === null) {
        const vapidPublic = `${process.env.REACT_APP_VAPID_PUBLICKEY}`;
        const convertedKey = urlBase64ToUint8Array(vapidPublic);

        const options = {
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        };

        return register.pushManager.subscribe(options);
      }
    })
    .then((newSub) => {
      return fetch(
        `${process.env.REACT_APP_FIREBASE_DB_URL}/subscription.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(newSub),
          redirect: "follow",
        }
      );
    })
    .then((res) => {
      if (res.ok) {
        displayConfirmation();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function urlBase64ToUint8Array(base64String) {
  let padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  let base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  let rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
