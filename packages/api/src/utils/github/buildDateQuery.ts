

export const buildDateQuery = (startDate: Date, endDate: Date) => {
    const locale = 'en-US';
    const startYear = startDate.getFullYear();
    const paddedStartMonth = (startDate.getMonth() + 1).toLocaleString(locale,{ minimumIntegerDigits: 2 })
    const paddedStartDay = startDate.getDate().toLocaleString(locale, { minimumIntegerDigits: 2 })

    const endYear = endDate.getFullYear();
    const paddedEndMonth = (endDate.getMonth() + 1).toLocaleString(locale,{ minimumIntegerDigits: 2 })
    const paddedEndDay = endDate.getDate().toLocaleString(locale, { minimumIntegerDigits: 2 })

    const queryString = `${startYear}-${paddedStartMonth}-${paddedStartDay}..${endYear}-${paddedEndMonth}-${paddedEndDay}`;
    return queryString;
};
  