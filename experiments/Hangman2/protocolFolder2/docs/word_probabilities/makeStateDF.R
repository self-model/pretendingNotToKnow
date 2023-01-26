library(tidyverse)

state_list <- read.csv('word_lists/states.csv')%>%
  pull(state) %>%
  unique()

word_df <- data.frame(word = tolower(state_list)) %>%
  mutate(prior=1/length(state_list))

word_df %>%
  write.csv('word_lists/USstates.csv')
