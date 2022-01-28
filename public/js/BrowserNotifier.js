/**
 * The value of a granted permission.
 * @private
 */
const _GRANTED = "granted";

/**
 * Sends notification to the operating system from the browser, if supported and allowed.
 *
 * Operations:
 * - notify (send a browser notification)
 */
class BrowserNotifier {
  /**
   * Constructor
   * @param {Window} win The window with which to send notifications
   */
  constructor(win) {
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
    // If notifications are not supported, stop here
    if (this._win === undefined) return;
    if (!this._isNotificationSupported()) return;

    this._notification = this._win?.Notification

    // If permissions are granted
    if (this._isNotificationPermissionGranted(this._notification.permission)) {
      // Send the notification
      this._sendNotification(message);

      // Stop here
      return;
    }

    // Otherwise, ask for them
    this._notification.requestPermission().then((permission) => {
      // If still denied, stop here
      if (!this._isNotificationPermissionGranted(permission)) return;

      // Otherwise send the notification
      this._sendNotification(message);
    });
  }

  /**
   * Send a notification to the user.
   * @param {string} message The notification message
   * @private
   */
  _sendNotification(message) {
    // Create the notification, which will close shortly after being shown
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