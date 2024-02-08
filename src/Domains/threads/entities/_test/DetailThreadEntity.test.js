const DetailThreadEntity = require("../DetailThreadEntity");
const DetailCommentEntity = require("../DetailCommentEntity");

describe("DetailThread Entity", () => {
  it("should return error when not contain needed property", () => {
    const payloadThread = {
      id: "thread-id",
      title: "title-thread",
      body: "body-thread",
      date: {},
      username: "owner-thread",
    };

    expect(() => new DetailThreadEntity(payloadThread)).toThrowError(
      "DETAIL_THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should return error when not meet data type spesification", () => {
    const payloadThread = {
      id: "thread-id",
      title: "title-thread",
      body: "body-thread",
      date: {},
      username: 12345,
      comments: [],
    };
    expect(() => new DetailThreadEntity(payloadThread)).toThrowError(
      "DETAIL_THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });
  it("should create DetailThreadEntity properly", () => {
    const payloadComments = [
      {
        id: "comment-123",
        content: "content-comment",
        date: {},
        is_delete: false,
        username: "user-comment",
      },
      {
        id: "comment-1234",
        content: "content-comment-1234",
        date: {},
        is_delete: false,
        username: "user-comment-1234",
      },
    ];
    const payloadThread = {
      id: "thread-id",
      title: "title-thread",
      body: "body-thread",
      date: {},
      username: "owner-thread",
      comments: [
        new DetailCommentEntity(payloadComments[0]),
        new DetailCommentEntity(payloadComments[1]),
      ],
    };

    const detailThreadEntity = new DetailThreadEntity(payloadThread);

    expect(detailThreadEntity.id).toEqual(payloadThread.id);
    expect(detailThreadEntity.body).toEqual(payloadThread.body);
    expect(detailThreadEntity.date).toEqual(payloadThread.date);
    expect(detailThreadEntity.comments).toEqual(payloadThread.comments);
  });
});
