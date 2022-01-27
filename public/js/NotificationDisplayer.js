class NotificationDisplayer {
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
   *
   * Note: `setup` method must be called beforehand.
   */
  addNotification() {
    if (this._isSetup === false) return;

    this._count++;

    this._changeTitle();
    this._changeFavicon();
  }

  /**
   * Clear the notifications, update the title and change the icon to the default one.
   * Note: `setup` method must be called beforehand.
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