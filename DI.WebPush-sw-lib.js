const applicationKey = '14911:FTjBtIivqW2D6dFKWW9qLrphY9CrY0jO';

self.addEventListener('push', e =>
{
	if (e && e.data)
	{
		e.waitUntil(showNotification(e.data.json()));
	}
});

function showNotification(payload)
{
	if (!payload.data || payload.data.PushSource !== "DI")
		return;

	var notificationTitle = payload.data.Title || 'Notification';
	var notificationOptions = {
	};

	if (payload.data.Body)
		notificationOptions.body = payload.data.Body;
	if (payload.data.Title)
		notificationOptions.title = payload.data.Title;
	if (payload.data.URLRedirection)
	{
		if (!notificationOptions.data)
			notificationOptions.data = {};
		notificationOptions.data['url'] = payload.data.URLRedirection;
	}
	if (payload.data.Icon)
		notificationOptions.icon = payload.data.Icon;
	if (payload.data.Image)
		notificationOptions.image = payload.data.Image;
	if (payload.data.Direction)
		notificationOptions.direction = payload.data.Direction;
	if (payload.data.Sound)
	{
		notificationOptions.silent = false;
		notificationOptions.sound = payload.data.Sound;
	}
	if (payload.data.Action1_Title)
	{
		if (!notificationOptions.data)
			notificationOptions.data = {};
		notificationOptions.actions = [];
		var action1 = { action: 0, title: payload.data.Action1_Title };
		if (payload.data.Action1_Icon)
			action1['icon'] = payload.data.Action1_Icon;
		notificationOptions.actions.push(action1);
		if (payload.data.Action1_URL)
			notificationOptions.data['action0_url'] = payload.data.Action1_URL;
	}
	if (payload.data.Action2_Title)
	{
		if (!notificationOptions.data)
			notificationOptions.data = {};
		if (!notificationOptions.actions)
			notificationOptions.actions = [];
		var action2 = { action: 1, title: payload.data.Action2_Title };
		if (payload.data.Action2_Icon)
			action2['icon'] = payload.data.Action2_Icon;
		notificationOptions.actions.push(action2);
		if (payload.data.Action2_URL)
			notificationOptions.data['action1_url'] = payload.data.Action2_URL;
	}

	if (payload.data.OFSYSReceptionID)
	{
		var data = {
			"ApplicationId": applicationKey,
			"PushId": payload.data.OFSYSReceptionID
		};
		var keys = applicationKey.split(':');

		corsAjax({
			"url": 'https://jfc.ofsys.com/T/OFC4/WPR/' + keys[0] + '/' + keys[1],
			"data": JSON.stringify(data)
		});
	}

	return self.registration.showNotification(notificationTitle, notificationOptions);
}

function corsAjax(options)
{
	var headers = new Headers({ "Content-Type": "text/plain" });
	var body = options.data;
	fetch(options.url, { mode: 'cors', method: 'POST', headers: headers, body: body }).then(function (response)
	{
		
	});
}

self.addEventListener('notificationclick', function (event) 
{
	var url = event.notification.data.url;
	if (event.action != null && event.action != '')
	{
		url = event.notification.data['action' + event.action + '_url'];
	}

	event.notification.close();
	event.waitUntil(clients.openWindow(url));
});

self.addEventListener('message', function (evt)
{
	if (typeof evt.data.showNotification !== 'undefined')
	{
		showNotification(evt.data.showNotification);
	}
});