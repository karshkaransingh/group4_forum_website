// importing validation functions from domain layer
import { validateCreatePost, validateEditPost, validateComment } from "../post";

// test suite for post validation logic
describe("post domain validation", () => {
  // testing validation for creating post
  describe("validateCreatePost", () => {
    // TEST valid input
    it("should return valid post data with default likes and comments", () => {
      // sample data
      const data = {
        title: "My first post",
        content: "This is the content",
        author: "krn",
        authorId: "123",
      };

      // calling function
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

    // TEST error when title missing
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

    // TEST error when content missing
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

    // TEST error when author missing
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

  // testing validation for editing post
  describe("validateEditPost", () => {
    // TEST valid edit input
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

    // TEST error when title missing
    it("should throw error when title is missing", () => {
      const data = {
        content: "Updated content",
      };

      expect(() => validateEditPost(data)).toThrow(
        "title and content are required",
      );
    });

    // TEST error when content missing
    it("should throw error when content is missing", () => {
      const data = {
        title: "Updated title",
      };

      expect(() => validateEditPost(data)).toThrow(
        "title and content are required",
      );
    });
  });

  // TEST validation for comment
  describe("validateComment", () => {
    // TEST valid comment input
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

    // TEST error when content missing
    it("should throw error when content is missing", () => {
      const data = {
        author: "krn",
      };

      expect(() => validateComment(data)).toThrow(
        "content and author are required",
      );
    });

    // TEST error when author missing
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
