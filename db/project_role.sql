CREATE TABLE `project_role` (
  `project_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `user_role` tinyint(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
