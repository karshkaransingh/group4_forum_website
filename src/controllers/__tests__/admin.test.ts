// importing function to test
import { getSiteStats } from "../admin";

// test suite for admin controller
describe("admin controller", () => {
  // test case 1: normal scenario
  it("should return total users, posts, likes, and comments", async () => {
    // mocking database dependencies
    const dependencies = {
      mongoDbClient: {
        // mocking user collection count
        User: {
          countDocuments: jest.fn().mockResolvedValue(5),
        },
        // mocking post collection count and data
        Post: {
          countDocuments: jest.fn().mockResolvedValue(2),
          find: jest.fn().mockResolvedValue([
            {
              likes: 3,
              comments: [{ content: "a" }, { content: "b" }],
            },
            {
              likes: 2,
              comments: [{ content: "c" }],
            },
          ]),
        },
      },
    };

    // calling the function
    const result = await getSiteStats(dependencies)();

    // checking if returned values are correct
    expect(result).toEqual({
      totalUsers: 5,
      totalPosts: 2,
      totalLikes: 5,
      totalComments: 3,
    });
  });
});
