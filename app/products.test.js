/**
 * https://www.npmjs.com/package/supertest
 */
 const request = require('supertest');
 const app     = require('./app');
 
 describe('GET /api/v1/products', () => {
 
   // Moking Product.find method
   let productSpy;
   // Moking Product.findById method
   let productSpyFindById;
 
   beforeAll( () => {
     const Product = require('./models/product');
     productSpy = jest.spyOn(Product, 'find').mockImplementation((criterias) => {
       return [{
         id: 1010,
         name: 'Felpa',
         description: 'Una bella felpa',
         price: 10,
         category: 'Abbigliamento',
         tags: "Abbigliamento, Felpe",
       }];
     });
     productSpyFindById = jest.spyOn(Product, 'findById').mockImplementation((id) => {
       if (id==1010)
         return {
            id: 1010,
            name: 'Felpa',
            description: 'Una bella felpa',
            price: 10,
            category: 'Abbigliamento',
            tags: "Abbigliamento, Felpe",
         };
       else
         return {};
     });
   });
 
   afterAll(async () => {
     productSpy.mockRestore();
     productSpyFindById.mockRestore();
   });
   
   test('GET /api/v1/products should respond with an array of products', async () => {
     return request(app)
       .get('/api/v1/products')
       .expect('Content-Type', /json/)
       .expect(200)
       .then( (res) => {
         if(res.body && res.body[0]) {
           expect(res.body[0]).toEqual({
             self: '/api/v1/products/1010',
             id: 1010,
             name: 'Felpa',
             description: 'Una bella felpa',
             price: 10,
             category: 'Abbigliamento',
             tags: "Abbigliamento, Felpe",
           });
         }
       });
   });
 
   
   test('GET /api/v1/products/:id should respond with json', async () => {
     return request(app)
       .get('/api/v1/products/1010')
       .expect('Content-Type', /json/)
       .expect(200, {
           self: '/api/v1/products/1010',
           id: 1010,
           name: 'Felpa',
           description: 'Una bella felpa',
           price: 10,
           category: 'Abbigliamento',
           tags: "Abbigliamento, Felpe",
         });
   });
 
 });
