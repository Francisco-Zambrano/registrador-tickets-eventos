import { describe, it, before } from "mocha";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Sessions API", () => {

    it("should not register an already registered user", async () => {
        const res = await requester.post("/api/sessions/register")
            .send({
                first_name: "test-name",
                last_name: "test-last-name",
                age: "30",
                email: "test001@test.com",
                password: "123"
            });
    
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.have.property("error").that.equals("Email already exists");
    });

    it("should login with a registered user", async () => {

        const res = await requester.post("/api/sessions/login")
            .send({
                email: "test001@test.com",
                password: "123"
            });

        expect(res.statusCode).to.equal(200);

        const cookies = res.headers["set-cookie"];
        expect(cookies).to.not.be.undefined;
        expect(cookies[0]).to.include("token");
    });

    it("should logout successfully", async () => {
      
        const loginRes = await requester.post("/api/sessions/login")
            .send({
                email: "test001@test.com",
                password: "123"
            });

        const cookies = loginRes.headers["set-cookie"];

        const res = await requester.get("/api/sessions/logout")
            .set("Cookie", cookies);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property("payload").that.equals("successful logout");
    });

});