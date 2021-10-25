import fetchMock from 'fetch-mock-jest';
import { repository } from '../../src/api/repository';
import { Repository } from '../../src/entities/Repository';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();
// const mockFetch = jest.fn(fetch);

interface MockRepositoryEntity {
    nodeID: string,
}

interface MockRepositoryDetails {
    url: string;
    name: string;
    stargazer_count: number;
}

const MockRepositoryList: MockRepositoryEntity[] = [{nodeID: "VeryGreatRepo"}, {nodeID: "EvenBetterRepo"}];

const MockRepositoryResults: MockRepositoryDetails[] = [
    {url: "www.github.com/AmericanAirlines/VeryLargePlane", name: "VeryLargePlane", stargazer_count: 12345},
    {url: "www.github.com/AmericanAirlines/EvenBiggerPlane", name: "EvenBiggerPlane", stargazer_count: 54321}
];

const MockBody = {
    query: `
            query ($id: [ID!]!){
              nodes(ids: $id){
                ...on Repository{
                  name
                  url
                  stargazerCount
                }
              }
            }
            `,
    variables: {
        id: MockRepositoryList,
    }
}

describe("Repository GET route", () => {
    beforeEach(async() => {
        jest.clearAllMocks();
        fetchMock.reset();
    })

    it("error on find returns 500 status code", async () => {
        const handler = testHandler(repository);
        handler.entityManager.find.mockRejectedValueOnce(new Error("There was an issue getting the repositories"));

        const { text } = await handler.get('/').expect(500);
        expect(text).toEqual("There was an issue getting the repositories");
        expect(loggerSpy).toBeCalledTimes(1);
    });

    it("Successful fetch from GitHub", async () => {
        const handler = testHandler(repository);
        handler.entityManager.find.mockResolvedValueOnce(MockRepositoryList);
        
        // vvv doesn't work (returns 500 Internal Service Error for line 91)
        // fetchMock.post(
        //     {
        //         url:"https://api.github.com/graphql",
        //         headers:{ 
        //             'Content-Type': 'application/json',
        //             'Authorization': 'bearer RealToken'
        //         },
        //         body: MockBody,
        //     }
        //     , 
        //     {
        //         status:200, 
        //         body: {
        //             data: MockRepositoryResults
        //         }
        //     });

        // const fetchRes = await fetch("https://api.github.com/graphql", {method: "POST", headers:{ 'Content-Type': 'application/json', 'Authorization': 'bearer RealToken'}, body: JSON.stringify(MockBody)});

        // // attempt at tests for ^
        // expect(fetchRes.status).toEqual(200); // how to check status code
        // expect(await fetchRes.json()).toEqual({data: MockRepositoryResults}); // how to check response body
        // expect(fetchMock).toHaveLastFetched("https://api.github.com/graphql"); // How to check what link you're fetching from

        fetchMock.post("https://api.github.com/graphql", MockRepositoryResults); // <- works

        const { body } = await handler.get('/').expect(200);
        expect(body).toEqual(MockRepositoryResults);
        expect(fetchMock).toHaveLastFetched("https://api.github.com/graphql", 'post');
        expect(fetchMock).toHaveFetchedTimes(1);        
    });
});