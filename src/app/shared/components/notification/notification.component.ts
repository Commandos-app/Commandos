import { NotificationService } from './notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'commandos-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
    constructor(public notificationService: NotificationService) {}

    ngOnInit(): void {}
}
