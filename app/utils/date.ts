const currentDate = new Date();

/*
 * Utility function to get the default date for order details.
 * This function returns a date that is 'n' days from today.
 */
interface FormatDateProps {
  offset?: number; // Number of days to offset from today
  date?: Date; // Optional date to format, defaults to today
}

/*
 * Formats a date by applying an offset in days.
 * @param {FormatDateProps} props - The properties for formatting the date.
 * @returns {Date} - Returns a Date object with the applied offset.
 */
export const formatDate = ({ offset = 0, date }: FormatDateProps): Date => {
  const currentDate = date ?? new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  return currentDate;
};

/* Offset date utility function
 * This function returns a date that is 'n' days from today.
 * @param {number} offset - The number of days to offset from today, defaults to 7.
 * @return {Date} - Returns a Date object with the applied offset.
 */
export const offsetDate = (offset?: number) =>
  new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (offset || 7)
  );
