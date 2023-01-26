all_possible_boards <- read.csv('../analysis/flat_boards.csv',header=FALSE);

create_board_states <- function(flat_positions,hit) {
  
  board_state = rep(NA,25)
  board_states = c();
  for (p in seq_along(flat_positions)) {
    board_states = c(board_states, paste(board_state,collapse=','));
    board_state[flat_positions[p]]=ifelse(hit[p],1,0);
  }
  
  return(board_states)
};

get_likelihood <- function(board_state) {
  
  board_state = scan(text= board_state, what = numeric(), sep="," , quiet = TRUE);
  
  revealed_positions <- which(!is.na(board_state));
  
  boards_to_remove = c();
  
  for (position in revealed_positions) {
    boards_to_remove = union(boards_to_remove, which(all_possible_boards[,position] != board_state[position]))
  }
  
  survived_boards = setdiff(1:nrow(all_possible_boards), boards_to_remove);
  likelihood = all_possible_boards[survived_boards,]%>%colMeans();
  likelihood[revealed_positions]=NA;
  
  return(paste(likelihood,collapse=','))
  
};



E1.click_log_with_boards <- E1.click_log %>%
  select(subj_id,genuine_first,test_part,grid_number,click_number,i,j,RT,hit_bin) %>% 
  mutate(flat_position = 1+i*5+j) %>%
  group_by(subj_id,genuine_first,test_part,grid_number) %>%
  arrange(click_number) %>%
  summarise(board_state=create_board_states(flat_position,hit_bin),
            flat_position=flat_position,
            i=i,
            j=j,
            RT=RT,
            hit_bin=hit_bin) %>%
  rowwise()%>%
  mutate(likelihood = get_likelihood(board_state));
