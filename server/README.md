# takebot
Slack TakeBot - TBD


## TODO

- [x] Persist configured apps!!
- [x] Have a single API endpoint for all slack commands
- [x] Have a way to handle auth (slack token)
- [x] Have a way to handle auth on the REST API
- [x] Keep REST API endpoints so other integrations can be done
- [x] Create endpoints for app statuses
- [x] Create endpoints to manage available apps
- [x] Better format for messages (with emojis and all)
- [ ] Restore reminders after crash (aka persist reminders)

## Possible endpoints:

REST:

- `GET /status` - responds with a simple OK?
- `GET /apps/list` - list all apps
- `GET /apps/status` - all tracked apps statuses {free/taken}
- `GET /apps/{APP_NAME}/status` - app status
- `PUT /apps/{APP_NAME}/take` - take app
- `PUT /apps/{APP_NAME}/return` - return app
- `PUT /apps/{APP_NAME}` - creates a new app
- `DELETE /app/{APP_NAME}` - deletes an app

SLACK POST endpoint: `POST /slack`  
It should be able to handle:

- `/takebot list`
- `/takebot status`
- `/takebot status APP_NAME`
- `/takebot take APP_NAME`
- `/takebot return APP_NAME`
- `/takebot add APP_NAME`
- `/takebot remove APP_NAME --confirm APP_NAME`
