import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Products API", () => {

    describe("GET /api/products", () => {

        it("should return a list of products with status 200", async () => {

            const { statusCode, body } = await requester.get("/api/products");

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("products");
            expect(body.products).to.be.an("array");

            body.products.forEach(product => {

                expect(product).to.have.property("title");
                expect(product).to.have.property("description");
                expect(product).to.have.property("price");
                expect(product).to.have.property("code");
                expect(product).to.have.property("stock");
                expect(product).to.have.property("category");

            });

        });

    });

    describe("GET /api/products/:pid", () => {

        it("should return a product by ID with status 200", async () => {
    
            const productId = '6664a52e9c8d1c4aad0d1b50';
            const { statusCode, body } = await requester.get(`/api/products/${productId}`);
    
            expect(statusCode).to.equal(200);
            console.log(body);
            expect(body).to.be.an("object");
            expect(body).to.have.property("id").eql(productId);
            expect(body).to.have.property("title");
            expect(body).to.have.property("description");
            expect(body).to.have.property("price");
            expect(body).to.have.property("code");
            expect(body).to.have.property("stock");
            expect(body).to.have.property("category");
    
        });
    
    });

    describe("Products Authorization", () => {

        it("should not allow adding a product without authorization", async () => {
    
            const res = await requester.post("/api/products")
                .send({
                    title: "unauthorized test",
                    description: "attempt to add product without authorization",
                    price: 50,
                    code: "unauth001",
                    stock: 5,
                    thumbnail: "",
                    category: "unauthorized"
                });
    
            expect(res.statusCode).to.be.oneOf([401, 403]);
    
        });
    
        it("should not allow deleting a product without authorization", async () => {
    
            const productId = 'fakeProductId'; 
            const res = await requester.delete(`/api/products/${productId}`);
            expect(res.statusCode).to.be.oneOf([401, 403]);
    
        });
    
    });

});