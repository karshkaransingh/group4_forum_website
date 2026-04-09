import { validateCreatePost, validateEditPost, validateComment } from "../post";

describe("post domain validation", () => {
  describe("validateCreatePost", () => {
    it("should return valid post data with default likes and comments", () => {
      const data = {
        title: "My first post",
        content: "This is the content",
        author: "krn",
        authorId: "123",
      };

      const result = validateCreatePost(data);

      expect(result).toEqual({
        title: "My first post",
        content: "This is the content",
        author: "krn",
        authorId: "123",
        likes: 0,
        comments: [],
      });
    });

    it("should throw error when title is missing", () => {
      const data = {
        content: "This is the content",
        author: "krn",
        authorId: "123",
      };

      expect(() => validateCreatePost(data)).toThrow(
        "title, content and author are required",
      );
    });

    it("should throw error when content is missing", () => {
      const data = {
        title: "My first post",
        author: "krn",
        authorId: "123",
      };

      expect(() => validateCreatePost(data)).toThrow(
        "title, content and author are required",
      );
    });

    it("should throw error when author is missing", () => {
      const data = {
        title: "My first post",
        content: "This is the content",
        authorId: "123",
      };

      expect(() => validateCreatePost(data)).toThrow(
        "title, content and author are required",
      );
    });
  });

  describe("validateEditPost", () => {
    it("should return valid edited post data", () => {
      const data = {
        title: "Updated title",
        content: "Updated content",
      };

      const result = validateEditPost(data);

      expect(result).toEqual({
        title: "Updated title",
        content: "Updated content",
      });
    });

    it("should throw error when title is missing", () => {
      const data = {
        content: "Updated content",
      };

      expect(() => validateEditPost(data)).toThrow(
        "title and content are required",
      );
    });

    it("should throw error when content is missing", () => {
      const data = {
        title: "Updated title",
      };

      expect(() => validateEditPost(data)).toThrow(
        "title and content are required",
      );
    });
  });

  describe("validateComment", () => {
    it("should return valid comment data", () => {
      const data = {
        content: "Nice post",
        author: "krn",
      };

      const result = validateComment(data);

      expect(result).toEqual({
        content: "Nice post",
        author: "krn",
      });
    });

    it("should throw error when content is missing", () => {
      const data = {
        author: "krn",
      };

      expect(() => validateComment(data)).toThrow(
        "content and author are required",
      );
    });

    it("should throw error when author is missing", () => {
      const data = {
        content: "Nice post",
      };

      expect(() => validateComment(data)).toThrow(
        "content and author are required",
      );
    });
  });
});
