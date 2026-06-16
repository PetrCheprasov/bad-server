import xss from 'xss'

export const sanitizeString = (value: string): string => xss(value)
