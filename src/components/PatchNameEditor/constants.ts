export const tooltipText =
  'Patch name must be 1-4 characters long and contain only uppercase letters, numbers or spaces. Optionally, you can add a period between any two characters. The name cannot contain 2 or more periods in a row. The name cannot start with a period. The name can end with a period only if there are 4 or less characters in front of it.'

export const validationRegex = /^[A-Z 0-9]((\.){0,1}[A-Z 0-9]){0,2}(\.){0,1}[A-Z 0-9]?$/
