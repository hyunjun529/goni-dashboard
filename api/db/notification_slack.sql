CREATE TABLE `notification_slack` (
  `project_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `slack_user_id` varchar(22) NOT NULL DEFAULT '',
  `access_token` text NOT NULL,
  `team_name` text NOT NULL,
  `team_id` varchar(22) NOT NULL DEFAULT '',
  `channel` varchar(22) NOT NULL DEFAULT '',
  `channel_id` varchar(22) NOT NULL DEFAULT '',
  `configuration_url` text NOT NULL,
  `url` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
