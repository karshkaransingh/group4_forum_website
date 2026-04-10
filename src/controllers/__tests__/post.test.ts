import postQueries from "../../infrastructure/mongodb/queries/post";
import {
  createPost,
  getPosts,
  getPostById,
  editPost,
  deletePost,
  likePost,
  addComment,
} from "../post";

jest.mock("../../infrastructure/mongodb/queries/post");

const mockedPostQueries = postQueries as jest.Mocked<typeof postQueries>;

describe("post controller", () => {
  const fakePostModel = function () {} as any;

  const dependencies = {
    mongoDbClient: {
      Post: fakePostModel,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a post successfully", async () => {
    mockedPostQueries.createPost.mockResolvedValue({
      title: "test",
      content: "content",
      author: "krn",
      authorId: "1",
      likes: 0,
      comments: [],
    } as any);

    const data = {
      title: "test",
      content: "content",
      author: "krn",
      authorId: "1",
    };

    const result = await createPost(dependencies)(data);

    expect(mockedPostQueries.createPost).toHaveBeenCalledWith(fakePostModel, {
      title: "test",
      content: "content",
      author: "krn",
      authorId: "1",
      likes: 0,
      comments: [],
    });

    expect(result).toEqual({
      title: "test",
      content: "content",
      author: "krn",
      authorId: "1",
      likes: 0,
      comments: [],
    });
  });

  it("should get all posts", async () => {
    mockedPostQueries.getPosts.mockResolvedValue([{ title: "post1" }] as any);

    const result = await getPosts(dependencies)();

    expect(mockedPostQueries.getPosts).toHaveBeenCalledWith(fakePostModel);
    expect(result).toEqual([{ title: "post1" }]);
  });

  it("should get post by id", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      title: "hello",
    } as any);

    const result = await getPostById(dependencies)("1");

    expect(mockedPostQueries.getPostById).toHaveBeenCalledWith(
      fakePostModel,
      "1",
    );
    expect(result).toEqual({ _id: "1", title: "hello" });
  });

  it("should edit post if user is owner", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      authorId: "123",
    } as any);

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

    expect(mockedPostQueries.updatePost).toHaveBeenCalledWith(
      fakePostModel,
      "1",
      {
        title: "updated",
        content: "updated content",
      },
    );

    expect(result).toEqual({
      _id: "1",
      title: "updated",
      content: "updated content",
    });
  });

  it("should throw error when post not found during edit", async () => {
    mockedPostQueries.getPostById.mockResolvedValue(null as any);

    await expect(
      editPost(dependencies)(
        "1",
        { title: "updated", content: "updated content" },
        { userId: "123", isAdmin: false, role: "user" },
      ),
    ).rejects.toThrow("Post not found");
  });

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

  it("should delete post if user is admin", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      authorId: "123",
    } as any);

    mockedPostQueries.deletePost.mockResolvedValue({ _id: "1" } as any);

    const result = await deletePost(dependencies)("1", {
      userId: "555",
      isAdmin: true,
      role: "user",
    });

    expect(mockedPostQueries.deletePost).toHaveBeenCalledWith(fakePostModel, "1");
    expect(result).toEqual({ _id: "1" });
  });

  it("should throw error when deleting someone else's post", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      authorId: "999",
    } as any);

    await expect(
      deletePost(dependencies)("1", {
        userId: "123",
        isAdmin: false,
        role: "user",
      }),
    ).rejects.toThrow("You can only delete your own post");
  });

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
    expect(fakePost.likedBy).toContain("abc");
    expect(mockedPostQueries.savePost).toHaveBeenCalledWith(fakePost);
    expect(result.likes).toBe(1);
  });

  it("should throw error if user likes twice", async () => {
    mockedPostQueries.getPostById.mockResolvedValue({
      _id: "1",
      likes: 1,
      likedBy: ["abc"],
    } as any);

    await expect(likePost(dependencies)("1", { userId: "abc" })).rejects.toThrow(
      "You cannot like twice",
    );
  });

  it("should add comment successfully", async () => {
    const fakePost: any = {
      _id: "1",
      comments: [],
    };

    mockedPostQueries.getPostById.mockResolvedValue(fakePost);
    mockedPostQueries.savePost.mockResolvedValue(fakePost);

    await addComment(dependencies)("1", {
      content: "Nice post",
      author: "krn",
    });

    expect(fakePost.comments).toEqual([
      {
        content: "Nice post",
        author: "krn",
      },
    ]);

    expect(mockedPostQueries.savePost).toHaveBeenCalledWith(fakePost);
  });

  it("should throw error when commenting on missing post", async () => {
    mockedPostQueries.getPostById.mockResolvedValue(null as any);

    await expect(
      addComment(dependencies)("1", {
        content: "Nice post",
        author: "krn",
      }),
    ).rejects.toThrow("Post not found");
  });
});