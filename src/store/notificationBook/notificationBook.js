import { createSelector } from "reselect";

export const selectNotificationBook = (state) => state.notificationBook.books;

export const selectBookById = createSelector(
  [selectNotificationBook, (state, originalId) => originalId],
  (books, originalId) => books[originalId] || {}
);