library(groundhog)
groundhog.library(c('tidyverse'),
                  "2022-12-01")
numbers = c('zero')

one_to_nine = c('one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine');

numbers = c(numbers, one_to_nine);

numbers = c(numbers, c(
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen'
))

tens = c('twenty',
         'thirty',
         'forty',
         'fifty',
         'sixty',
         'seventy',
         'eighty',
         'ninety')

for (ten in tens) {
  numbers = c(numbers, ten)
  for (digit in one_to_nine) {
    numbers = c(numbers, paste(ten,digit, sep= ' '))
  }
}

numbers = c(numbers,'hundred','thousand', 'million', 'billion', 'dozen', 'googol')

word_df <- data.frame(word = numbers) %>%
  mutate(prior=1/length(numbers))

word_df %>%
  write.csv('word_lists/numbers.csv')
