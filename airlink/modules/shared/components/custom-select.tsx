"use client"
import Select from "react-select"

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: Option | null
  onChange: (option: Option | null) => void
  onInputChange?: (inputValue: string) => void
  placeholder: string
  name: string
  isDisabled?: boolean
  isLoading?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  className?: string
}

export function CustomSelect({
  options,
  value,
  onChange,
  onInputChange,
  placeholder,
  name,
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  className = "",
}: CustomSelectProps) {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      onInputChange={onInputChange}
      placeholder={placeholder}
      name={name}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      className={className}
      classNames={{
        control: (state) =>
          `border rounded-md shadow-sm ${state.isFocused ? "border-primary ring-1 ring-primary" : "border-input"}`,
        placeholder: () => "text-muted-foreground",
        input: () => "text-foreground",
        option: (state) =>
          `${state.isFocused ? "bg-accent" : "bg-background"} ${state.isSelected ? "bg-primary text-primary-foreground" : ""}`,
        menu: () => "bg-background border rounded-md shadow-md mt-1",
        singleValue: () => "text-foreground",
      }}
    />
  )
}

