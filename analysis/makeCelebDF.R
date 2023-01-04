library(tidyverse)
library(httr)
library(jsonlite)
library(stringr)
library(groundhog)

groundhog.library(c('tidyverse',
                    'httr',
                    'jsonlite',
                    'stringr'),
                  "2022-12-01")

celebs <- read.csv('word_lists/celebs.csv')%>%
  pull(name) %>%
  unique()

# using the Wikimedia API to get page view counts
getWikiPageViewCounts <- function(name,first_date,last_date) {

  #convert the name to the Right_Format
  formatted_name <- str_to_title(name) %>%
    str_replace_all(' ', '_')

  query <- paste('https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/all-agents/',
                formatted_name,
                '/monthly/',
                as.character(first_date),
                '/',
                as.character(last_date),
                sep='');

  res <- httr::GET(query);

  data <- fromJSON(rawToChar(res$content))
  return(data$items$views%>%sum())

}

word_df <- data.frame(word = tolower(celebs)) %>%
  rowwise()%>%
  mutate(views= getWikiPageViewCounts(word,20210101,20211231))%>%
  ungroup() %>%
  filter(views>0) %>%
  arrange(desc(views)) %>%
  mutate(i = row_number(),
         score=ceiling(i/100),
         score=ifelse(score>7,7,score),
         invscore=1/score,
         prior=invscore/sum(invscore)) %>%
  select(word, views, prior)


word_df %>%
  write.csv('word_lists/celebrities.csv')

