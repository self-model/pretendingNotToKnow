

1.  "subject_identifier":  serial number, numeric.
2.  "trial_type": JsPsych trial type, string.
3.  "trial_index": trial index in the jsPsych experiment tree, numeric.
4.  "time_elapsed": time from the beginning of the experiment, in ms.
5.  "internal_node_id": internal node id in the jsPsych experiment tree, numeric.
6.  "protocol_sum": the SHA256 of the protocol folder, used to time-lock data collection to pre-registration, string
7.  "subject_sum": the SHA256 of the concatenation of the protocol sum with the subject identifier, used for time-locking, a numeric array.
8.  "genuine_first": true if non-pretend games were played before pretend games, logical.
9. "choose_pretender": true if, in judge trials, the player was asked to click on the pretender, logical.
10. "total_points": total points earned by the player across all game parts, numeric.
11. "pretend_instructions": the number of times the participant had to read the instructions for the pretend trials, before passing the comprehension check, numeric.
12. "nonpretend_instructions": the number of times the participant had to read the instructions for the non-pretend trials, before passing the comprehension check, numeric.
13. "rt":  reaction time, in milliseconds, numeric.
14. "responses": answers to the debrief and worker comments questions, string.
15. "correct": accuracy of multiple-choice comprehension checks and judge trials, numeric (0/1).
16. "test_part": test part, string.
17. "grid": the game grid. 0 is sea, A, B, and C are the three ships. a 2d array of strings, 2d array.
18. "click_log": the sequence of clicks in json format:

    *   i: row number, a numeric array.
    *   j: column number: a numeric array.
    *   t: time in milliseconds: a numeric array.
    *   hit: 0/A/B/C, an array of strings.
19. "final_grid_state": grid state at the end of the game, a 2d array of strings.
20. "num_clicks": the number of guesses needed to complete the game, numeric.
21. "points": number of poitns awarded for a game (25-num_clicks), numeric.
22. "cheat": 1 in pretend games and pretend half-games, 0 in non-pretend games and non-pretend half-games, numeric (0/1).
23. "grid number": grid number, between 1 and 9, numeric.
24. "replay log": the sequence of replays in judge trials before participants made up their minds, an array of strings ('right' or 'left' for the two players).
25. "decision": the participant the judge thought was the pretender, string ("right" or "left").
26. "genuine_player": the subject_identifier of the non-pretender in the judge trial, numeric.
27. "cheat_player": the subject_identifier of the pretender, numeric.
28. "cheater": the position of the pretender, string ("right" or "left").
29. "noncheater": the position of the non-pretender, string ("right" or "left").

