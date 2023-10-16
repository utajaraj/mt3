import { notification } from 'antd';
import type { NotificationPlacement, IconType } from 'antd/es/notification/interface';

export const Notify = (type: IconType, title: string, description?: any, placement?: NotificationPlacement) => {
    notification[type]({
        message: title,
        description: description,
        placement: placement || "top"
    })
}