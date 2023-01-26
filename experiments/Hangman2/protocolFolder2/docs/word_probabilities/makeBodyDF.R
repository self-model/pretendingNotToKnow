library(tidyverse)

five_letter_bodyparts <- strsplit('belly, spine, skull, scalp, thigh, torso, thumb, wrist, blood, bones, cheek, elbow, spine, skull, scalp, thigh, torso, thumb, wrist, waist', 'penis',', ')[[1]] %>%tolower()%>%unique()
five_letter_bodyparts_plural <- c('veins')
four_letter_bodyparts <- strsplit('Neck, Back, Head, Foot, Hand, Nose, Bone, Iris, Brow, Face, Chin, Skin, Lung, Hair, Vein, Butt, Anus, Lung, Shin, Palm, Calf, Nail, Vein, Lash, Brow', ', ')[[1]]%>%tolower()%>%unique()

word = c(five_letter_bodyparts,four_letter_bodyparts,five_letter_bodyparts_plural)

basic_list <- data.frame(word) %>% mutate(score=ifelse(word=='veins', 100,7))

word_df <- read.csv('word_lists/bodypart_proto.csv')%>%
  rbind(basic_list)%>%
  group_by(word) %>%
  summarise(score=min(score)) %>%
  mutate(invscore=1/score) %>%
  ungroup()%>%
  mutate(prior=invscore/sum(invscore)) %>%
  dplyr::select(word, score, prior)


word_df %>%
  write.csv('word_lists/bodypart.csv')
