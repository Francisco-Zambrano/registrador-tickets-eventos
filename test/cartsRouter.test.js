import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Carts API", () => {

    describe("GET /api/carts/:pid", () => {

        it("should return a cart by ID with status 200", async () => {
            const cartId = '66d4fd08868c8b3580a474bf';
            const { statusCode, body } = await requester.get(`/api/carts/${cartId}`);

            expect(statusCode).to.equal(200);
            expect(body).to.be.an("object");
            console.log(body);
        });

    });

    describe("PUT /api/carts/:cid/products/:pid", () => {

        it("should update a cart product quantity", async () => {
            const productId = '6676217872ea2c2e9458758f';
            const cartId = '66d4fed74e7c8f1b6198646b';
            const updatedProduct = {
                quantity: 2
            };

            const { statusCode, body } = await requester
                .put(`/api/carts/${cartId}/products/${productId}`)
                .send(updatedProduct);

            expect(statusCode).to.equal(200);
            expect(body).to.be.an("object");
            expect(body).to.have.property("msg").eql("Product quantity updated in cart");
            expect(body).to.have.property("cart").that.is.an("object");
            expect(body.cart).to.have.property("id").eql(cartId);
            expect(body.cart).to.have.property("products").that.is.an("array");

            const productInCart = body.cart.products.find(p => p.id === productId);
            expect(productInCart).to.exist;
            expect(productInCart).to.have.property("quantity").eql(updatedProduct.quantity);
        });

    });

    describe("DELETE /api/carts/:cid/products/:pid", () => {

        it("should delete an existing product from a cart and confirm deletion", async () => {
            const productId = '6664a52e9c8d1c4aad0d1b50';
            const cartId = '66d4fd08868c8b3580a474bf';

            const deleteResponse = await requester
                .delete(`/api/carts/${cartId}/products/${productId}`);

            expect(deleteResponse.statusCode).to.equal(200);

            const getResponse = await requester.get(`/api/carts/${cartId}`);
            expect(getResponse.statusCode).to.equal(200);
            const productInCart = getResponse.body.cart.products.find(p => p.id === productId);
            expect(productInCart).to.not.exist;
        });
        
    });

});