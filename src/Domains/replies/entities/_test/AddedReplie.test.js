const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLIE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 2222,
      content: 'sebuah balasan',
      owner: {},
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLIE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    // Action
    const addedReplie = new AddedReply(payload);

    // Assert
    expect(addedReplie.id).toEqual(payload.id);
    expect(addedReplie.content).toEqual(payload.content);
    expect(addedReplie.owner).toEqual(payload.owner);
  });
});
