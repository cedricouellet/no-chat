const _GRANTED = "granted";

class BrowserNotifier {
  /**
   * Constructor
   * @param {Window?} win
   */
  constructor(win = undefined) {
    this._win = win;
    this._notification = undefined;
  }

  /**
   *  Notify the user through browser notifications.
   *
   *  It will not attempt to notify if notifications are not supported.
   *
   *  If permissions are not granted, it will ask for them.
   *  Then, If they are still not granted, it will not attempt to notify.
   *
   * @param {string} message The message with which to notify the user.
   */
  notify(message) {
    if (this._win === undefined) return;
    if (!this._isNotificationSupported()) return;

    this._notification = this._win?.Notification
    if (!this._isNotificationPermissionGranted(this._notification.permission)) {
      this._notification.requestPermission().then((permission) => {
        if (!this._isNotificationPermissionGranted(permission)) return;
        this._sendNotification(message);
      });
      return;
    }

    this._sendNotification(message);
  }

  /**
   * Send a notification to the user.
   * @param {string} message The notification message
   * @private
   */
  _sendNotification(message) {
    new Notification(message).close();
  }

  /**
   * If notifications are supported on this browser or not.
   * @returns {boolean} True if notifications are supported on this browser, otherwise false.
   * @private
   */
  _isNotificationSupported() {
    return this._win.Notification !== undefined;
  }

  /**
   * If notification permissions are granted or not.
   * @returns {boolean} True if notification permissions are granted, otherwise false.
   * @private
   */
  _isNotificationPermissionGranted(permission) {
    return permission === _GRANTED;
  }
}