import React, { forwardRef, useEffect, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, startOfMonth, subMonths } from "date-fns";
import { cn } from "@/utils/cn";


const Input = forwardRef(({ 
  className, 
  type = "text",
  inputType,
  error = false,
  multiline = false,
  rows,
  label,
  value,
  onChange,
  ...props 
}, ref) => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const actualType = inputType || type
  const inputId = React.useId();
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white";
  
  const variants = {
    default: "border-gray-300 focus:border-primary focus:ring-primary/20",
    error: "border-error focus:border-error focus:ring-error/20"
};
  
return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
        id={inputId}
        rows={rows}
        className={cn(baseStyles, error ? variants.error : variants.default, className)}
        ref={ref}
        {...props}
      />
    ) : (
<div className="relative">
        <input
          id={inputId}
          type={actualType === "date" ? "text" : actualType}
          value={actualType === "date" && value ? 
            (value instanceof Date ? format(value, 'yyyy-MM-dd') : value) : value || ''
          }
          onChange={actualType === "date" ? (e) => {
            if (onChange) onChange(e)
          } : onChange}
          onFocus={actualType === "date" ? () => setShowCalendar(true) : undefined}
          readOnly={actualType === "date"}
          placeholder={actualType === "date" ? "Select date..." : props.placeholder}
          className={cn(baseStyles, error ? variants.error : variants.default, className)}
          ref={ref}
          {...(actualType === "date" ? {} : props)}
        />
        
        {actualType === "date" && showCalendar && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowCalendar(false)}
            />
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 w-80">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h3 className="text-lg font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                
                <button
                  type="button"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {eachDayOfInterval({
                  start: startOfMonth(currentDate),
                  end: endOfMonth(currentDate)
                }).map(date => {
                  const isSelected = value && isSameDay(date, new Date(value))
                  const isToday = isSameDay(date, new Date())
                  
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => {
                        const formattedDate = format(date, 'yyyy-MM-dd')
                        const event = {
                          target: {
                            name: props.name,
                            value: formattedDate
                          }
                        }
                        if (onChange) onChange(event)
                        setShowCalendar(false)
                      }}
                      className={cn(
                        "w-8 h-8 text-sm rounded flex items-center justify-center hover:bg-gray-100",
                        isSelected && "bg-blue-500 text-white hover:bg-blue-600",
                        isToday && !isSelected && "bg-gray-200 font-semibold",
                        !isSameMonth(date, currentDate) && "text-gray-300"
                      )}
                    >
                      {format(date, 'd')}
                    </button>
                  )
                })}
              </div>
            </div>
</>
        )}
      </div>
    )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;