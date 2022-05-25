/**
 * https://www.npmjs.com/package/supertest
 */
 const request = require('supertest');
 const app     = require('./app');
 
 describe('GET /api/v1/carts', () => {
 
   // Moking Product.find method
   let cartSpy;
   // Moking Product.findById method
 
   beforeAll( () => {
     const Cart = require('./models/cart');
     cartSpy = jest.spyOn(Cart, 'findOne').mockImplementation((criterias) => {
        if (id==33)
       return {
        self: "/api/v1/carts/" + cart.id,
        user: '33',
        items: 'Felpa',
        subTotal: 10,
       };
       else
       return {};
     });
    });
 
   afterAll(async () => {
     cartSpy.mockRestore();
   });
      
   test('GET /api/v1/carts/:id should respond with json', async () => {
     return request(app)
       .get('/api/v1/carts/33')
       .expect('Content-Type', /json/)
       .expect(200, {
        self: "/api/v1/carts/" + cart.id,
        user: '33',
        items: 'Felpa',
        subTotal: 10,
         });
   });
 
 });
