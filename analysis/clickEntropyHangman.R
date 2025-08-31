
#compute Shannon entropy, but only until the first timepoint at which some gamed ended
entropy <- function(target) {
  if (length(target)<5) {
    return(NaN)
  } else {
    freq <- table(target)/length(target)
    # vectorize
    vec <- as.data.frame(freq)[,2]
    #drop 0 to avoid NaN resulting from log2
    vec<-vec[vec>0]
    #compute entropy
    return(-sum(vec * log2(vec)))
  }
}

E4.click_entropy_by_serial_position <- E4.click_log_with_boards %>%
  mutate(flat_position = which(LETTERS==letter)) %>%
  # filter(click_number<15) %>%
  group_by(subj_id,test_part,click_number)%>%
  summarise(entropy=entropy(flat_position))

E4.click_entropy_by_serial_position_wide <- E4.click_entropy_by_serial_position %>%
  spread(test_part,entropy) %>% 
  mutate(diff=pretend-nonpretend)


E4.click_entropy_by_serial_position_summary <- E4.click_entropy_by_serial_position %>%
  group_by(test_part,click_number) %>%
  summarise(mean_entropy=mean(entropy, na.rm=T),
            se_entropy=se(entropy, na.rm=T)) %>%
  mutate(test_part = factor(test_part, levels=c('nonpretend','pretend','random','optimal')));

p <- E4.click_entropy_by_serial_position_summary %>%
  ggplot(aes(x=click_number,y=mean_entropy,color=test_part,group=test_part)) +
  geom_line() +
  geom_ribbon(aes(ymax=mean_entropy+se_entropy,ymin=mean_entropy-se_entropy, fill=test_part),alpha=0.5) +
  scale_fill_manual(values=c("#69b3a2", "#404080", "#FDE725", "black")) +
  scale_color_manual(values=c("#69b3a2", "#404080", "black", "black")) +
  labs(x='click number', y='entropy') +
  theme_classic()

ggsave('../docs/figures/e4_entropy_by_click_nnumber.png',p,width=7,height=5,dpi=300)


E4.entropy_summary <- E4.click_entropy_by_serial_position %>%
  filter(click_number<6) %>%
  group_by(subj_id,test_part) %>%
  summarise(entropy=mean(entropy,na.rm=T))

E4.p_click_summary <- E4.click_log_with_boards %>%
  rbind(E4.click_log_with_boards_random) %>%
  ungroup() %>%
  filter(click_number<6) %>%
  group_by(subj_id,test_part) %>%
  summarise(p_click_rank=mean(p_click_rank))

E4.entropy_cost <- E4.p_click_summary %>%
  merge(E4.entropy_summary)%>%
  group_by(subj_id)%>%
  summarise(p_click_cost = p_click_rank[test_part=='pretend']-
              p_click_rank[test_part=='nonpretend'],
            entropy_cost = entropy[test_part=='pretend']-
              entropy[test_part=='nonpretend'])

E4.entropy_sd <- E4.click_entropy_by_serial_position %>%
  filter(click_number<6) %>%
  group_by(subj_id,test_part) %>%
  summarise(entropy=mean(entropy,na.rm=T)) %>%
  spread(test_part,entropy) %>%
  mutate(diff=pretend-nonpretend) %>% merge(
    E4.sd_num_misses,by='subj_id', suffixes=c('_entropy','_sd'))

