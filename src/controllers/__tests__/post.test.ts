import {
  createPost,
  getPosts,
  getPostById,
  editPost,
  deletePost,
  likePost,
  addComment,
} from "../post";

describe("post controller", () => {
  const mockPostQueries = {
    createPost: jest.fn(),
    getPosts: jest.fn(),
    getPostById: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    savePost: jest.fn(),
  };

  const dependencies: any = {
    mongoDbClient: {
      Post: {},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a post", async () => {
    mockPostQueries.createPost.mockResolvedValue({
      title: "test",
      content: "test content",
    });

    const result = await createPost({
      ...dependencies,
      mongoDbClient: { Post: {} },
      postQueries: mockPostQueries,
    })({
      title: "test",
      content: "test content",
      author: "krn",
      authorId: "1",
    });

    expect(result.title).toBe("test");
  });

  it("should get all posts", async () => {
    mockPostQueries.getPosts.mockResolvedValue([{ title: "post1" }]);

    const result = await getPosts({
      mongoDbClient: {
        Post: {
          find: jest.fn().mockResolvedValue([{ title: "post1" }]),
        },
      },
    })();

    expect(result.length).toBe(1);
  });

  it("should get post by id", async () => {
    const fakePost = { _id: "1", title: "hello" };

    const result = await getPostById({
      mongoDbClient: {
        Post: {
          findById: jest.fn().mockResolvedValue(fakePost),
        },
      },
    })("1");

    expect(result.title).toBe("hello");
  });

  it("should edit post if owner", async () => {
    const fakePost = {
      _id: "1",
      authorId: "123",
    };

    const dependencies = {
      mongoDbClient: {
        Post: {
          findById: jest.fn().mockResolvedValue(fakePost),
          findByIdAndUpdate: jest
            .fn()
            .mockResolvedValue({ title: "updated" }),
        },
      },
    };

    const result = await editPost(dependencies)(
      "1",
      { title: "updated", content: "updated" },
      { userId: "123", isAdmin: false },
    );

    expect(result.title).toBe("updated");
  });

  it("should delete post if admin", async () => {
    const fakePost = {
      _id: "1",
      authorId: "123",
    };

    const dependencies = {
      mongoDbClient: {
        Post: {
          findById: jest.fn().mockResolvedValue(fakePost),
          findByIdAndDelete: jest.fn().mockResolvedValue(true),
        },
      },
    };

    const result = await deletePost(dependencies)("1", {
      userId: "999",
      isAdmin: true,
    });

    expect(result).toBeTruthy();
  });

  it("should like post", async () => {
    const fakePost: any = {
      likes: 0,
      likedBy: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const dependencies = {
      mongoDbClient: {
        Post: {
          findById: jest.fn().mockResolvedValue(fakePost),
        },
      },
    };

    const result = await likePost(dependencies)("1", {
      userId: "abc",
    });

    expect(fakePost.likes).toBe(1);
    expect(fakePost.likedBy.includes("abc")).toBe(true);
  });

  it("should add comment", async () => {
    const fakePost: any = {
      comments: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const dependencies = {
      mongoDbClient: {
        Post: {
          findById: jest.fn().mockResolvedValue(fakePost),
        },
      },
    };

    await addComment(dependencies)("1", {
      content: "nice",
      author: "krn",
    });

    expect(fakePost.comments.length).toBe(1);
  });
});