import { getSiteStats } from "../admin";

describe("admin controller", () => {
  it("should return total users, posts, likes, and comments", async () => {
    const dependencies = {
      mongoDbClient: {
        User: {
          countDocuments: jest.fn().mockResolvedValue(5),
        },
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

    const result = await getSiteStats(dependencies)();

    expect(result).toEqual({
      totalUsers: 5,
      totalPosts: 2,
      totalLikes: 5,
      totalComments: 3,
    });
  });

  it("should handle posts with missing likes or comments", async () => {
    const dependencies = {
      mongoDbClient: {
        User: {
          countDocuments: jest.fn().mockResolvedValue(1),
        },
        Post: {
          countDocuments: jest.fn().mockResolvedValue(2),
          find: jest.fn().mockResolvedValue([
            {},
            {
              likes: 4,
            },
          ]),
        },
      },
    };

    const result = await getSiteStats(dependencies)();

    expect(result).toEqual({
      totalUsers: 1,
      totalPosts: 2,
      totalLikes: 4,
      totalComments: 0,
    });
  });
});
