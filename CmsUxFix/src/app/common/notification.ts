export class Notification {
  title: string;
  body: NotificationBody;
}


export class NotificationBody {
  responseId: string;
  notificationType: number; // 0 for targeted // 1 broadcast
  notificationTopic: string; // Todo valid value 1 for project
  cmsOperation: string;
  data: any;
}

