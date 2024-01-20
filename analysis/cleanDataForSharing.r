library(dplyr)
library(tidyverse)

Battleship_df <- read.csv('../experiments/Battleships2/data/batch1/jatos_results_batch1.csv',na.strings=c(""," ","NA")) %>%
  mutate(subj_id = paste(as.character(participant_number),substr(PROLIFIC_PID,1,4),sep='')) %>%
  # the dash is breaking r
  mutate(test_part = ifelse(test_part=='non-pretend','nonpretend',test_part)) %>%
  mutate(genuine_first=genuine_first=='True') %>%
  dplyr::select("subject_identifier", "subj_id","trial_type", "trial_index", "time_elapsed", "internal_node_id",
                "protocol_sum", "subject_sum",
                "genuine_first", "choose_pretender", "total_points",
                "pretend_instructions", "nonpretend_instructions","rt", "responses","correct",
                "test_part","grid", "click_log", "final_grid_state","num_clicks", "points",
                "cheat", "grid_number", "replay_log","decision", "genuine_player",
                "cheat_player", "cheater", "noncheater")

write.table(Battleship_df, file="../experiments/Battleships2/data/batch1/Battleship_for_sharing.csv",quote=TRUE,sep=', ', row.names=FALSE,col.names=TRUE)

Hangman_df <- read.csv('..\\experiments\\Hangman2\\data\\jatos_results_batch2.csv',na.strings=c(""," ","NA")) %>%
  rbind(read.csv('..\\experiments\\Hangman2\\data\\jatos_results_batch1.csv',na.strings=c(""," ","NA"))) %>%
  mutate(subj_id = paste(as.character(participant_number),substr(PROLIFIC_PID,1,5),sep='')) %>%
  mutate(subj_id = factor(subj_id)) %>%
  # the dash is breaking r
  mutate(test_part = ifelse(test_part=='non-pretend','nonpretend',test_part)) %>%
  filter(PROLIFIC_PID != '5ec4a156bc5aac3819ac52f2' & #reported some of the letters not showing up on their screen
           PROLIFIC_PID != '58211fc787f6b90001f13f9' & #reported some of the letters not showing up on their screen
           PROLIFIC_PID != '6149256f6335b06ade3723e0' &  # due a PROLFIIC bug, participated twice
           PROLIFIC_PID != '615ddab1e4f013092538b6c5') %>%# due a PROLFIIC bug, participated twice
  dplyr::select("subject_identifier", "subj_id","trial_type", "trial_index", "time_elapsed", "internal_node_id",
                "protocol_sum", "subject_sum",
                "genuine_first", "total_points",
                "pretend_instructions", "nonpretend_instructions",
                "pretend_hg_word", "nonpretend_hg_word","rt", "responses","correct",
                "test_part","word", "click_log", "final_keyboard_state","num_clicks", "points",
                "cheat", "category", "pretend", "correct_response", "player", "key_press")

write.table(Hangman_df, file="../experiments/Hangman2/data/Hangman_for_sharing.csv",quote=TRUE,sep=', ', row.names=FALSE,col.names=TRUE)
