const SortDate = (payload) => {
  payload.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return payload;
};

module.exports = SortDate;
