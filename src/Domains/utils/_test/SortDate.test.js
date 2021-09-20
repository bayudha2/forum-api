const SortDate = require('../SortDate');

describe('SortDate function', () => {
  it('should sort date ascending correctly', async () => {
    // Arrange
    const payload = [
      {
        id: '111',
        date: '2021-09-09T08:41:18.428Z',
        owner: 'user-HLor6dPzny5LMaaXNZ1r6',
      },
      {
        id: '222',
        date: '2021-09-09T08:41:18.429Z',
        owner: 'user-ZhodLsVRpFUuBbtpROx9C',
      },
    ];

    // Action
    const resultDate = SortDate(payload);

    // Assert
    const date_one = new Date(resultDate[0].date).getTime();
    const date_two = new Date(resultDate[1].date).getTime();
    expect(date_one).toBeLessThan(date_two);
  });
});
