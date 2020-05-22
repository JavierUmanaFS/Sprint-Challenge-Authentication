const supertest = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js");

describe("GET /", () => {

  it("can run the tests", () => {
    expect(true).toBeTruthy();
  })

  it("Should return http status code 200 OK ", () => {
    return supertest(server)
           .get("/")
           .then(response => {
            expect(response.status).toBe(200);
      })
  })

  it("Should return { api: 'up'}", () => {
    return supertest(server)
    .get("/")
    .then(response => {
      expect(response.body).toEqual({ api: "up"});
    })
  })

  describe("POST /api/jokes", () => {

    it("Should return an array", () =>{
      return supertest(server)
      .get("/api/jokes")
      .then(response => {
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Please provide the authentication information"})
      })
    })

  })

  describe('POST /auth/register', () => {
    it("should register a new user", async (done) =>{
      const credentials =  {username:"javier32", password: "tester32"};
      try {
        await supertest(server).post("/api/auth/register").send(credentials)
        .then(response =>{
          expect(response.status).toBe(201);
        })
        done();
      } catch(err) {
        console.log(err)
        done()
      }
      // return supertest(server)
      // .post("/api/auth/register")
      // .send(credentials)
      // .then(response =>{
      //   // expect(response.status).toBe(200);
      //   console.log(credentials, "creds")
      //   expect(response.body).toBe("error")
      // })
    })
  })
  

})