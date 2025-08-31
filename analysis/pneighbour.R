# Define the list of 5x5 matrices (9 grids)
grids <- list(
  matrix(c(
    '0','0','0','0','0',
    '0','0','0','0','A',
    'b','B','B','b','A',
    '0','0','0','0','A',
    'C','C','c','0','0'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    'C','C','c','0','0',
    '0','0','0','0','0',
    'B','B','b','A','0',
    '0','0','0','A','0',
    '0','0','0','A','0'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    'B','B','b','0','0',
    '0','0','0','0','0',
    'A','A','A','0','0',
    '0','0','0','0','0',
    '0','0','c','C','C'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    '0','0','0','0','B',
    '0','0','0','0','B',
    '0','A','A','A','b',
    '0','0','0','0','0',
    '0','c','C','C','c'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    '0','0','0','0','B',
    'A','A','A','c','B',
    '0','0','0','C','b',
    '0','0','0','C','0',
    '0','0','0','c','0'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    '0','0','0','0','0',
    'c','0','0','0','0',
    'C','0','b','0','A',
    'C','0','B','0','A',
    'c','0','B','0','A'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    '0','0','0','B','0',
    '0','0','0','B','0',
    'C','C','c','b','A',
    '0','0','0','0','A',
    '0','0','0','0','A'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    '0','0','0','C','0',
    '0','0','0','C','0',
    '0','0','0','c','0',
    'A','A','A','0','0',
    '0','0','b','B','B'
  ), nrow=5, byrow=TRUE),
  
  matrix(c(
    '0','A','0','0','0',
    '0','A','b','B','B',
    '0','A','c','0','0',
    '0','0','C','0','0',
    '0','0','C','0','0'
  ), nrow=5, byrow=TRUE)
)

get_hit_number <- function(hit) {
  
  num_A <- 0;
  num_B <- 0;
  num_C <- 0;
  
  hit_number <- c();
  
  for (i in seq(length(hit))) {
    if (hit[i]==0) {
      hit_number = c(hit_number,NaN)
    } else if (hit[i]=='A') {
      num_A = num_A + 1;
      hit_number = c(hit_number,num_A)
    } else if (hit[i]=='B') {
      num_B = num_B + 1;
      hit_number = c(hit_number,num_B)
    } else if (hit[i]=='C') {
      num_C = num_C + 1;
      hit_number = c(hit_number,num_C)
    }
  }
  
  return(hit_number)
}

revealed_three <- function(hit_number) {
  
  revealed_three <- c();
  three = FALSE;
  
  for (i in seq(length(hit_number))) {
    revealed_three = c(revealed_three, three);
    if (!(is.na(hit_number[i])) & hit_number[i]==3) {
      three = TRUE
    } 
  }
  
  return(revealed_three)
}


get_grid_value <- function(grid_number, i, j) {
  # Convert JavaScript's 0-based indexing to R's 1-based indexing
  i <- i + 1
  j <- j + 1
  grid_number <- grid_number + 1
  
  # Check if indices are within valid range
  if (grid_number < 1 || grid_number > length(grids)) stop("Invalid grid_number")
  if (i < 1 || i > 5 || j < 1 || j > 5) stop("Invalid i or j index")
  
  # Return the value
  return(grids[[grid_number]][i, j])
}

# Example usage:
get_grid_value(0, 2, 1) # Fetch from first grid, row=3, col=2

E2.hit_order <- E2.click_log %>%
  group_by(genuine_first,subj_id,test_part,grid_number) %>%
  summarise(click_number = click_number,
            hit = hit,
            RT = RT,
            i=i,
            j=j,
            hit_number = get_hit_number(hit),
            revealed_three = revealed_three(hit_number),
            hit_type = ifelse(hit_number==1, 'first',
                              ifelse(hit_number==2 & !revealed_three, 'second',
                                     ifelse(hit_number==2 & revealed_three, 'secondlast',
                                            ifelse(hit_number==3,'thirdlast','sea'))))) %>%
  mutate(prev_hit_type = lag(hit_type),
         prev_hit = lag(hit),
         physical_distance_from_last_click = sqrt((i-lag(i))**2+(j-lag(j))**2))

E2.pneighbour <- E2.hit_order %>% 
  rowwise()%>% 
  filter(prev_hit!='A' & prev_hit_type %in%c('second','secondlast'))%>%
  mutate(hit = get_grid_value(as.numeric(grid_number),i,j)) %>%
  group_by(subj_id,genuine_first,test_part,prev_hit_type) %>%
  summarise(pneighbour=mean(hit==tolower(prev_hit)))

E2.pneighbour_pretend <- E2.pneighbour %>%
  filter(test_part=='pretend') %>%
  spread(prev_hit_type,pneighbour) %>%
  mutate(diff=second-secondlast)

E2.pneighbour_nonpretend <- E2.pneighbour %>%
  filter(test_part=='nonpretend') %>%
  spread(prev_hit_type,pneighbour) %>%
  mutate(diff=second-secondlast)

E2.pneighbour_wide <- merge(E2.pneighbour_pretend,
                            E2.pneighbour_nonpretend, 
                            by='subj_id', suffixes = c('_pretend','_nonpretend')) %>%
  mutate(diff_second = second_pretend-second_nonpretend)

printnum(E2.pneighbour_nonpretend$second%>%mean(na.rm=T))
printnum(E2.pneighbour_nonpretend$secondlast%>%mean(na.rm=T))
apa_print(t.test(E2.pneighbour_nonpretend$diff))$statistic
printnum(cohensD(E2.pneighbour_nonpretend$diff))

printnum(E2.pneighbour_pretend$second%>%mean(na.rm=T))
apa_print(E2.pneighbour_wide$diff_second%>%t.test())$statistic
printnum(E2.pneighbour_wide$diff_second%>%cohensD)

printnum(E2.pneighbour_pretend$secondlast%>%mean(na.rm=T))
apa_print(t.test(E2.pneighbour_pretend$diff))$statistic
printnum(cohensD(E2.pneighbour_pretend$diff))

E2.RT_by_hit_order_non_neighbour_boats_only <- E2.hit_order %>% 
  rowwise()%>% 
  filter(prev_hit!='A' & prev_hit_type %in%c('second','secondlast'))%>%
  mutate(hit = get_grid_value(as.numeric(grid_number),i,j)) %>%
  group_by(subj_id,genuine_first,test_part,prev_hit_type) %>%
  filter(hit!=tolower(prev_hit))%>%
  group_by(genuine_first,subj_id,test_part,prev_hit_type) %>%
  summarise(RT=median(RT))