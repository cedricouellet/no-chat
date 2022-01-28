/**
 * Displays notification updates in the browser window by:
 * - changing the title to the unseen notification count
 * - changing the icon to represent that there are unseen notifications
 *
 * Operations:
 * - Add a notification
 * - Clear notifications
 */
class NotificationDisplayer {

  /**
   * Constructor
   * @param {HTMLLinkElement} faviconElement The favicon holder containing the default app favicon.
   * @param {string} newFaviconHref The path to the icon representing unread browser notifications.
   */
  constructor(faviconElement, newFaviconHref) {
    this._isSetup = true;
    this._count = 0;

    this._faviconHolder = faviconElement;
    this._oldFavicon = faviconElement.href;
    this._newFavicon = newFaviconHref;
    this._oldTitle = document.title;
  }

  /**
   * Add a notification, updating the app favicon and adds to the title.
   */
  addNotification() {
    if (this._isSetup === false) return;

    this._count++;

    this._changeTitle();
    this._changeFavicon();
  }

  /**
   * Clear the notifications, update the title and change the icon to the default one.
   */
  clearNotifications() {
    this._count = 0;

    this._changeTitle();
    this._changeFavicon();
  }

  /**
   * Update the favicon based on the unseen notification count.
   * @private
   */
  _changeFavicon() {
    let favicon;

    if (this._count === 0) {
      favicon = this._oldFavicon;
    } else {
      favicon = this._newFavicon;
    }

    document.getElementById(this._faviconHolder.id).href = favicon;
  }

  /**
   * Update the title based on the unseen notification count.
   * @private
   */
  _changeTitle() {
    let title;

    if (this._count === 0) {
      title = this._oldTitle;
    } else {
      title = `(${this._count}) ` + this._oldTitle;
    }

    document.title = title;
  }
}