import Select from 'react-select';

const YearMonthFilter = ({
    
    filteredYear,
    setFilteredYear,
    filteredMonth,
    setFilteredMonth

}: {

    filteredYear: number;
    setFilteredYear: React.Dispatch<React.SetStateAction<number>>;
    filteredMonth: number;
    setFilteredMonth: React.Dispatch<React.SetStateAction<number>>;

}) => {

    const years = Array.from({ length: 5 }, (_, index) => {
        const year = new Date().getFullYear() - index;
        return { value: year, label: `${year}` };
    });
  
    // Function to get the label for each month
    const getMonthLabel = (monthIndex: number) => {
      const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ];
      return monthNames[monthIndex - 1]; // Adjusting index to access month names array
    };
  
    const months = Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1; // Adjusting index to represent actual month numbers (1 to 12)
      return { value: monthIndex, label: getMonthLabel(monthIndex) };
    });

    return (
        <div className="year-month-filter hidden laptop:flex laptop:gap-2">
            <Select 
                id="year"
                options={years}
                placeholder={'Select Year'}
                onChange={(e) => e && setFilteredYear && setFilteredYear(e.value)}
                value={years.filter(year => {
                    return year.value === filteredYear
                })}
                className='react-select-dropdown'
            />
            <Select
                id="month"
                options={months}
                placeholder={'Select Month'}
                onChange={(e) => e && setFilteredMonth && setFilteredMonth(e.value)}
                value={months.filter(month => {
                    return month.value === filteredMonth
                })}
                className='react-select-dropdown'
            />
        </div>
    )
}

export default YearMonthFilter
