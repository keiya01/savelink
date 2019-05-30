import Post, { PostModel } from "../post";

/* eslint-disable no-undef */
describe("Check the SQL syntax for inserting post_urls", () => {
  const date = new Date()
  const tests = [
    {
      description: "Check returning the correct SQL syntax",
      data: {
        post: <PostModel>{
          id: 1,
          comment: "hey",
          created_at: date
        },
        urls: [
          "https://hello.com",
          "https://test.com",
          "https://world.com",
        ]
      },
      result: {
        sql: `
      WITH urls AS (
        INSERT INTO post_urls (
          url,
          post_id,
          created_at
        ) 
        VALUES ($1, $2, $3),($4, $5, $6),($7, $8, $9)
        RETURNING *
      )
      SELECT * from post, urls;
    `,
        values: ["https://hello.com", 1, date, "https://test.com", 1, date, "https://world.com", 1, date]
      },
      isError: false
    },
    {
      description: "Check that the error occurred when the length of URL is 0",
      data: {
        post: <PostModel>{
          id: 1,
          comment: "hey",
          created_at: date
        },
        urls: []
      },
      result: new Error("Can not empty urls"),
      isError: true
    }
  ];

  tests.map(({ description, data, result, isError }) => {
    test(description, () => {
      const p = new Post();

      if (isError) {
        if (!(result instanceof Error)) {
          fail("result in tests object is not Error type");
          return;
        }

        const getThrowError = () => {
          p.getInsertUrls(data.post, data.urls);
        }

        expect(getThrowError)
          .toThrowError(result);
        return;
      }

      expect(p.getInsertUrls(data.post, data.urls))
        .toEqual(result);
    });
  });
});