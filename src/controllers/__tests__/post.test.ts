// importing post query, so it can be mocked
import postQueries from "../../infrastructure/mongodb/queries/post";

// importing post controller functions
import {
  createPost,
  getPosts,
  getPostById,
  editPost,
  deletePost,
  likePost,
  addComment,
} from "../post";

// mocking database query file (real database is not used)
jest.mock("../../infrastructure/mongodb/queries/post");

// converting imported queries into mocked version
const mockedPostQueries = postQueries as jest.Mocked<typeof postQueries>;

// test suite for post controller
describe("post controller", () => {
  // fake model used as post dependency
  const fakePostModel = function () {} as any;

  // fake dependencies
  const dependencies = {
    mongoDbClient: {
      Post: fakePostModel,
    },
  };

  // reset mock calls before every test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST create post
  it("should create a post successfully", async () => {
    // mock db response
    mockedPostQueries.createPost.mockResolvedValue({
      title: "test",
      content: "content",
      author: "karsh",
      authorId: "1",
      likes: 0,
      comments: [],
    } as any);

    const data = {
      title: "test",
      content: "content",
      author: "karsh",
      authorId: "1",
    };

    // call constructor
    const result = await createPost(dependencies)(data);

    // check returned result
    expect(result).toEqual({
      title: "test",
      content: "content",
      author: "karsh",
      authorId: "1",
      likes: 0,
      comments: [],
    });
  });

  // TEST get posts
  it("should get all posts", async () => {
    mockedPostQueries.getPosts.mockResolvedValue([{ title: "post1" }] as any);

    const result = await getPosts(dependencies)();

    expect(result).toEqual([{ title: "post1" }]);
  });

  // TEST get post by id
  it("should get post by id", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      title: "hello",
    } as any);

    const result = await getPostById(dependencies)("1");

    expect(result).toEqual({ _id: "1", title: "hello" });
  });

  // TEST edit post if user is owner
  it("should edit post if user is owner", async () => {
    // post belong to same user
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      authorId: "123",
    } as any);

    // mock update Result
    mockedPostQueries.updatePost.mockResolvedValue({
      _id: "1",
      title: "updated",
      content: "updated content",
    } as any);

    const result = await editPost(dependencies)(
      "1",
      { title: "updated", content: "updated content" },
      { userId: "123", isAdmin: false, role: "user" },
    );

    expect(result).toEqual({
      _id: "1",
      title: "updated",
      content: "updated content",
    });
  });

  // TEST edit post when user is not owner
  it("should throw error when editing someone else's post", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      authorId: "999",
    } as any);

    await expect(
      editPost(dependencies)(
        "1",
        { title: "updated", content: "updated content" },
        { userId: "123", isAdmin: false, role: "user" },
      ),
    ).rejects.toThrow("You can only edit your own post");
  });

  // TEST delete post when user is admin
  it("should soft delete post if user is admin", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      authorId: "123",
      isDeleted: false,
    } as any);

    mockedPostQueries.deletePost.mockResolvedValue({
      _id: "1",
      isDeleted: true,
    } as any);

    const result = await deletePost(dependencies)("1", {
      userId: "555",
      isAdmin: true,
      role: "user",
    });

    expect(result).toEqual({
      _id: "1",
      isDeleted: true,
    });
  });

  // TEST delete post when user is not owner/admin
  it("should throw error when deleting someone else's post", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      authorId: "999",
      isDeleted: false,
    } as any);

    await expect(
      deletePost(dependencies)("1", {
        userId: "123",
        isAdmin: false,
        role: "user",
      }),
    ).rejects.toThrow("You can only delete your own post");
  });

  //TEST like post
  it("should like a post successfully", async () => {
    const fakePost: any = {
      _id: "1",
      likes: 0,
      likedBy: [],
    };

    mockedPostQueries.getPostById.mockResolvedValue(fakePost);
    mockedPostQueries.savePost.mockResolvedValue({
      ...fakePost,
      likes: 1,
      likedBy: ["abc"],
    } as any);

    const result = await likePost(dependencies)("1", { userId: "abc" });

    expect(fakePost.likes).toBe(1);
  });

  // TEST like post with duplicate like
  it("should throw error if user likes twice", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      likes: 1,
      likedBy: ["abc"],
    } as any);

    await expect(
      likePost(dependencies)("1", { userId: "abc" }),
    ).rejects.toThrow("You cannot like twice");
  });

  // TEST add comment
  it("should add comment successfully", async () => {
    const fakePost: any = {
      _id: "1",
      comments: [],
    };

    mockedPostQueries.getPostById.mockResolvedValue(fakePost);
    mockedPostQueries.savePost.mockResolvedValue(fakePost);

    await addComment(dependencies)("1", {
      content: "Nice post",
      author: "navdeep",
    });

    expect(fakePost.comments).toEqual([
      {
        content: "Nice post",
        author: "navdeep",
      },
    ]);
  });
});
