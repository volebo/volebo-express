/*
ExpressJS for volebo.net

Copyright (C) 2016	Volebo.Net <volebo.net@gmail.com>
Copyright (C) 2016	Koryukov Maksim <maxkoryukov@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

var assert     = require('chai').assert;
var path       = require('path');
const request  = require('supertest');

/* ROOT of the package */
var rt = process.cwd();
var vbexpress = require(rt);

describe('server-middlewares', function(){

	describe('check NOT FOUND', () => {

		var app = vbexpress();

		before( done=> {
			app.start(done);
		});
		after(done => app.close(done));

		it('not found', done => {
			request(app)
				.get('/xxxxxxxxxxxxxx-not-exists')
				.expect(/Not found/i)
				.expect(404, done);
		});
	});

	describe('check "forwardedSecure"', () => {

		var app = vbexpress();

		before( done=> {
			app.get('/forwardedSecure', (req, res, next) => {
				return res.send(req.forwardedSecure).status(200);
				next();
			});

			app.start(done);
		});
		after(done => app.close(done));

		it('forwardedSecure is true for "x-forwarded-proto"', done => {
			request(app)
				.get('/forwardedSecure')
				.set('X-FORWARDED-PROTO', 'HTTPS')
				.expect(200, 'true', done);
		});

		it('forwardedSecure is false for "x-forwarded-proto" http', done => {
			request(app)
				.get('/forwardedSecure')
				.set('X-FORWARDED-PROTO', 'HTTP')
				.expect(200, 'false', done);
		});

		it('forwardedSecure is false for unset "x-forwarded-proto"', done => {
			request(app)
				.get('/forwardedSecure')
				.expect(200, 'false', done);
		});

	});
});