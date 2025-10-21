
1.  "subject_identifier":  serial number, numeric.
2.  "subj_id": a unique identifier of participants, because some participants got the same subject-identifier by mistake, string.
3.  "trial_type": JsPsych trial type, string.
4.  "trial_index": trial index in the jsPsych experiment tree, numeric.
5.  "time_elapsed": time from the beginning of the experiment, in ms.
6.  "internal_node_id": internal node id in the jsPsych experiment tree, numeric.
7.  "protocol_sum": the SHA256 of the protocol folder, used to time-lock data collection to pre-registration, string
8.  "subject_sum": the SHA256 of the concatenation of the protocol sum with the subject identifier, used for time-locking, a numeric array.
9.  "genuine_first": true if non-pretend games were played before pretend games, logical.
10. "total_points": total points earned by the player across all game parts, numeric.
11. "pretend_instructions": the number of times the participant had to read the instructions for the pretend trials, before passing the comprehension check, numeric.
12. "nonpretend_instructions": the number of times the participant had to read the instructions for the non-pretend trials, before passing the comprehension check, numeric.
13. "pretend_hg_word": word used in pretend half game, string
14. "nonpretend_hg_word": word used in non-pretend half game, string
15. "rt":  reaction time, in milliseconds, numeric.
16. "responses": answers to the debrief and worker comments questions, string.
17. "correct": accuracy of multiple-choice comprehension checks and judge trials, numeric (0/1).
18. "test_part": test part, string.
19. "word": the target word, string.
20. "click_log": the sequence of clicks in json format:

    *   letter: an array of strings
    *   t: time in milliseconds: a numeric array.
    *   hit: 0/1, a nueric array.
    *   asked: all letters asked so far, an array of strings.
    *   word_state: the state of the word *after* asking, string.
21. "final_keyboard_state": all letters guessed by the end of the game, an array of strings.
22. "num_clicks": the number of guesses needed to complete the game, numeric.
23. "points": number of poitns awarded for a game (15-num_misses), numeric.
24. "cheat": 1 in pretend games and pretend half-games, 0 in non-pretend games and non-pretend half-games, numeric (0/1).
25. "category": the category of the target word, string
26. "pretend": was the replay a replay of a pretend game? numeric (0/1)
27. "correct_response": P if pretend==1, N if pretend==0, string
28. "player": the subject_identifier of the player in the judge trial, numeric.
29. "key_press": decision in the judge trial: 80 for P, pretend, 79 for N, non-pretend
