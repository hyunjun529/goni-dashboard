create database if not exists goni_saas;
use goni_saas;

# notification_slack.sql
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

# project_role.sql
CREATE TABLE `project_role` (
  `project_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `user_role` tinyint(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# project.sql
CREATE TABLE `project` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `is_plus` tinyint(1) DEFAULT NULL,
  `apikey` varchar(64) NOT NULL DEFAULT '',
  `admin_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

# user_token.sql
CREATE TABLE `user_token` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL DEFAULT '',
  `user_id` int(11) unsigned NOT NULL,
  `expired_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# user.sql
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL DEFAULT '',
  `username` varchar(16) DEFAULT NULL,
  `password` varchar(64) NOT NULL DEFAULT '',
  `salt` varchar(32) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
