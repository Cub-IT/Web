
export const ajax = (uri, settings) => new Promise((resolve, reject) => {
	const topic = uri.match(/^\w+/)[0];

	const setup = (error) => {
		return $.extend({ }, settings, {
			url: 'api/' + uri,
			headers: { 'Authorization' : `Bearer ${localStorage.getItem('token') || '' }` },
			contentType: settings.data && 'application/json; charset=UTF-8' || false,
			data: settings.data ? JSON.stringify(settings.data) : null,
			dataType: 'json',
			success: (resp) => {
				resolve(resp) 
				// resolve({ data: { [topic]: resp }}) 
			},
			error
		});
	};

	const error = (xhr, textStatus, errorThrown) => {
		if (xhr.responseJSON && xhr.status == 200)
			resolve($.extend({ data: { } }, xhr.responseJSON));
		else
			reject(xhr.responseJSON);
	};

	$.ajax(setup((xhr, textStatus, errorThrown) => {
		if (xhr.status == 401) {

			$.ajax('api/auth/refresh/tokens',
			{
				method: 'GET', 
				headers: {'refresh' : `Bearer ${localStorage.getItem('refreshToken')}`},
				success: (resp) => {
					if(resp.token && resp.token) {
						localStorage.setItem('token', resp.token);
						localStorage.setItem('refreshToken', resp.refreshToken);
					}

					$.ajax(setup(error));
				}
			}).fail(() => {
				if(window.location.pathname != '/') {
					localStorage.clear();
					window.location.assign('/');
				}
			})

			return
		}

		error(xhr, textStatus, errorThrown);
	}));
});

