const NewReply = require('../NewReply');

describe('NewReply', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLIE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLIE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah replie',
    };

    // Action
    const { content } = new NewReply(payload);

    //Assert
    expect(content).toEqual(payload.content);
  });
});
