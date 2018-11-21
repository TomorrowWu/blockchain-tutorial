const routes = require('next-routes')();

// The former is the url, the latter is the page
routes
	.add('/projects/create', '/projects/create')
	.add('/projects/:address', 'projects/detail')
	.add('/projects/:address/payments/create', 'projects/payments/create');

module.exports = routes;
