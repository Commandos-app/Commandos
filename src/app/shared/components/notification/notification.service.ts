import { Injectable } from '@angular/core';
import { AlertStatusTypes } from '@cds/core/alert';

type Notification = { type: AlertStatusTypes; message: string };

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    notifications = new Set<Notification>();

    constructor() {}

    // add a notification with a status and a message
    addNotification(status: AlertStatusTypes, message: string, timer: number = 5000) {
        const notification: Notification = { type: status, message: message };

        this.notifications.add(notification);

        if (timer) {
            setTimeout(() => {
                this.notifications.delete(notification);
            }, timer);
        }
    }

    removeNotification(notification: Notification) {
        this.notifications.delete(notification);
    }
}
