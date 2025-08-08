import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  initialStartDate = subDays(new Date(), 30),
  initialEndDate = new Date(),
}) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const presetRanges = [
    {
      label: 'Last 7 days',
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
    },
    {
      label: 'Last 30 days',
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
    },
    {
      label: 'Last 90 days',
      startDate: subDays(new Date(), 90),
      endDate: new Date(),
    },
    {
      label: 'This month',
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    },
    {
      label: 'Last month',
      startDate: startOfMonth(subMonths(new Date(), 1)),
      endDate: endOfMonth(subMonths(new Date(), 1)),
    },
  ];

  const handlePresetSelect = (preset: { startDate: Date; endDate: Date; label: string }) => {
    const newRange = {
      startDate: preset.startDate,
      endDate: preset.endDate,
    };
    setDateRange(newRange);
    onDateRangeChange(
      format(newRange.startDate, 'yyyy-MM-dd'),
      format(newRange.endDate, 'yyyy-MM-dd')
    );
    setShowDropdown(false);
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newDate = new Date(value);
    const newRange = {
      ...dateRange,
      [field]: newDate,
    };
    
    // Ensure start date is not after end date
    if (field === 'startDate' && newRange.startDate > newRange.endDate) {
      newRange.endDate = newRange.startDate;
    }
    if (field === 'endDate' && newRange.endDate < newRange.startDate) {
      newRange.startDate = newRange.endDate;
    }

    setDateRange(newRange);
    onDateRangeChange(
      format(newRange.startDate, 'yyyy-MM-dd'),
      format(newRange.endDate, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="relative inline-block w-full max-w-md">
      <div
        className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-sm font-medium">
            {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Select</h4>
              <div className="space-y-1">
                {presetRanges.map((preset, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Custom Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={format(dateRange.startDate, 'yyyy-MM-dd')}
                    onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={format(dateRange.endDate, 'yyyy-MM-dd')}
                    onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-3 border-t">
              <button
                onClick={() => setShowDropdown(false)}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;