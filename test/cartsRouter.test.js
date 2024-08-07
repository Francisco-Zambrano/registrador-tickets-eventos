import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Carts API", () => {

    describe("GET /api/carts/:pid", () => {

        it("should return a cart by ID with status 200", async () => {
            const cartId = '665cc99d6fcf0d95f0772e79';
            const { statusCode, body } = await requester.get(`/api/carts/${cartId}`);

            expect(statusCode).to.equal(200);
            expect(body).to.be.an("object");
            console.log(body);
        });

    });

    describe("PUT /api/carts/:cid/products/:pid", () => {

        it("should update a cart product quantity", async () => {
            const productId = '6637a29a72cd4d753e85a631';
            const cartId = '665cc99d6fcf0d95f0772e79';
            const updatedProduct = {
                quantity: 3
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
            const productId = '6637a53aa6b68aabca0a9c7f';
            const cartId = '665cc99d6fcf0d95f0772e79';

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