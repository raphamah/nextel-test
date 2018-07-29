const request = require("supertest-as-promised");
const httpStatus = require("http-status");
const chai = require("chai");
const expect = chai.expect;
const app = require("../../server.js");

chai.config.includeStack = true;

describe("## Misc", () => {
	describe("# GET /api/health-check", () => {
		it("should return OK", (done) => {
			request(app)
				.get("/api/health-check")
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.text).to.equal("OK");
					done();
				})
				.catch(done);
		});
	});

	describe("# GET /api/404", () => {
		it("should return 404 status", (done) => {
			request(app)
				.get("/api/404")
				.expect(httpStatus.NOT_FOUND)
				.then(() => {
					done();
				})
				.catch(done);
		});
	});
});
