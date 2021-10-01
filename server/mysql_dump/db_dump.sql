-- MySQL dump 10.13  Distrib 8.0.26, for Linux (x86_64)
--
-- Host: localhost    Database: adtol
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ads`
--

DROP TABLE IF EXISTS `ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `type` tinyint(1) NOT NULL,
  `match_hash` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`) USING BTREE,
  KEY `match_hash` (`match_hash`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ads`
--

LOCK TABLES `ads` WRITE;
/*!40000 ALTER TABLE `ads` DISABLE KEYS */;
/*!40000 ALTER TABLE `ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banner_sizes`
--

DROP TABLE IF EXISTS `banner_sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner_sizes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `size` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banner_sizes`
--

LOCK TABLES `banner_sizes` WRITE;
/*!40000 ALTER TABLE `banner_sizes` DISABLE KEYS */;
INSERT INTO `banner_sizes` VALUES (1,'300x50'),(2,'320x50'),(3,'250x250'),(4,'300x250'),(5,'728x90'),(6,'970x250'),(7,'120x600'),(8,'160x600'),(9,'336x280'),(10,'300x600'),(11,'300x150');
/*!40000 ALTER TABLE `banner_sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `banner_id` int NOT NULL,
  `size` int NOT NULL,
  `src` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`) USING BTREE,
  KEY `size` (`size`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `browsers`
--

DROP TABLE IF EXISTS `browsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `browsers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `browsers`
--

LOCK TABLES `browsers` WRITE;
/*!40000 ALTER TABLE `browsers` DISABLE KEYS */;
INSERT INTO `browsers` VALUES (1,'Android Browser'),(2,'Chrome'),(3,'Chromium'),(4,'Edge'),(5,'Firefox'),(6,'Brave'),(7,'KaiOS'),(8,'Maxthon'),(9,'Mozilla'),(10,'Opera'),(11,'Tesla'),(12,'QQ Browser'),(13,'Safari'),(14,'Samsung Browser'),(15,'Tizen Browser'),(16,'UC Browser'),(17,'Whale Browser'),(18,'Yandex Browser'),(19,'Vivaldi'),(20,'360 Browser');
/*!40000 ALTER TABLE `browsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `btns`
--

DROP TABLE IF EXISTS `btns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `btns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `btns`
--

LOCK TABLES `btns` WRITE;
/*!40000 ALTER TABLE `btns` DISABLE KEYS */;
INSERT INTO `btns` VALUES (1,'Click Here'),(2,'Book Now'),(3,'Buy Now'),(4,'Call Now'),(5,'Contact Us'),(6,'Download'),(7,'Donate'),(8,'Follow'),(9,'Get Offer'),(10,'Install'),(11,'Join Now'),(12,'Learn More'),(13,'Play Game'),(14,'Register'),(15,'Send Email'),(16,'Sign Up'),(17,'Share'),(18,'Try Now'),(19,'Watch Video'),(20,'Use App');
/*!40000 ALTER TABLE `btns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_types`
--

DROP TABLE IF EXISTS `campaign_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `icon` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_types`
--

LOCK TABLES `campaign_types` WRITE;
/*!40000 ALTER TABLE `campaign_types` DISABLE KEYS */;
INSERT INTO `campaign_types` VALUES (1,'Traffic','traffic');
/*!40000 ALTER TABLE `campaign_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_title` varchar(60) NOT NULL,
  `campaign_type` int NOT NULL DEFAULT '0',
  `uid` int NOT NULL,
  `title` varchar(60) NOT NULL,
  `desc` varchar(300) NOT NULL,
  `url` varchar(255) NOT NULL,
  `domain_hash` varchar(12) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT '0',
  `country` varchar(500) NOT NULL DEFAULT '0',
  `device` varchar(10) NOT NULL DEFAULT '0',
  `os` varchar(200) NOT NULL DEFAULT '0',
  `browser` varchar(50) NOT NULL DEFAULT '0',
  `language` varchar(60) NOT NULL DEFAULT '0',
  `day` varchar(25) NOT NULL DEFAULT '0',
  `timezone` varchar(255) NOT NULL DEFAULT 'Asia/Kolkata',
  `rel` int NOT NULL DEFAULT '1',
  `btn` int NOT NULL DEFAULT '0',
  `bot` int NOT NULL DEFAULT '0',
  `cpc` float(10,5) NOT NULL DEFAULT '0.02000',
  `views` bigint NOT NULL DEFAULT '0',
  `clicks` bigint NOT NULL DEFAULT '0',
  `pops` bigint NOT NULL DEFAULT '0',
  `budget` float(15,5) NOT NULL,
  `budget_rem` float(15,5) NOT NULL,
  `today_budget` float(15,5) NOT NULL,
  `today_budget_rem` float(15,5) NOT NULL,
  `spent` float(15,5) NOT NULL,
  `adult` tinyint(1) NOT NULL DEFAULT '0',
  `run` tinyint(1) NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '2',
  `pro` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `domain_hash` (`domain_hash`) USING BTREE,
  KEY `today_budget_rem` (`today_budget_rem`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Ad Network'),(2,'Adult'),(3,'Apps'),(4,'Arts & Hobbies'),(5,'Blog'),(6,'Business'),(7,'Chat'),(8,'Children'),(9,'Classifieds'),(10,'Community'),(11,'Computers'),(12,'Dating'),(13,'Downloads'),(14,'Education'),(15,'Entertainment'),(16,'Family'),(17,'Finance'),(18,'Fitness'),(19,'Food'),(20,'Forum'),(21,'Gambling'),(22,'Games'),(23,'Health'),(24,'Hosting'),(25,'Images'),(26,'Jobs'),(27,'Lifestyle'),(28,'Men'),(29,'Music'),(30,'News'),(31,'Other'),(32,'Pets'),(33,'Real Estate'),(34,'Religion & Spirituality'),(35,'Science & Technology'),(36,'Search'),(37,'Shopping'),(38,'Social Networking'),(39,'Software'),(40,'Sports'),(41,'Travel'),(42,'Vehicles'),(43,'Videos'),(44,'Webmasters'),(45,'Women');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clicks`
--

DROP TABLE IF EXISTS `clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clicks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `ad_uid` int NOT NULL,
  `pub_uid` int NOT NULL,
  `ad_id` int NOT NULL,
  `site_id` int NOT NULL,
  `ad_url` varchar(500) NOT NULL,
  `ad_url_tiny` varchar(7) NOT NULL,
  `pub_url` varchar(500) NOT NULL,
  `pub_url_tiny` varchar(7) NOT NULL,
  `ad_type` tinyint(1) NOT NULL,
  `category` int NOT NULL DEFAULT '0',
  `device` tinyint(1) NOT NULL DEFAULT '0',
  `os` int NOT NULL DEFAULT '0',
  `browser` int NOT NULL DEFAULT '0',
  `country` int NOT NULL DEFAULT '0',
  `language` int NOT NULL DEFAULT '0',
  `ip` varchar(45) NOT NULL DEFAULT '0',
  `ip_tiny` varchar(7) NOT NULL,
  `ad_cpc` float(10,5) NOT NULL,
  `pub_cpc` float(10,5) NOT NULL,
  `day_unix` bigint NOT NULL DEFAULT '0',
  `time_unix` bigint NOT NULL DEFAULT '0',
  `valid` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `iptiny` (`ip_tiny`) USING BTREE,
  KEY `day_unix` (`day_unix`) USING BTREE,
  KEY `ad_id` (`ad_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clicks`
--

LOCK TABLES `clicks` WRITE;
/*!40000 ALTER TABLE `clicks` DISABLE KEYS */;
/*!40000 ALTER TABLE `clicks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int DEFAULT NULL,
  `dial_code` int DEFAULT NULL,
  `code` text,
  `name` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,93,'AF','Afghanistan'),(2,355,'AL','Albania'),(3,213,'DZ','Algeria'),(4,1684,'AS','American Samoa'),(5,376,'AD','Andorra'),(6,244,'AO','Angola'),(7,1264,'AI','Anguilla'),(8,0,'AQ','Antarctica'),(9,1268,'AG','Antigua and Barbuda'),(10,54,'AR','Argentina'),(11,374,'AM','Armenia'),(12,297,'AW','Aruba'),(13,61,'AU','Australia'),(14,43,'AT','Austria'),(15,994,'AZ','Azerbaijan'),(16,1242,'BS','Bahamas'),(17,973,'BH','Bahrain'),(18,880,'BD','Bangladesh'),(19,1246,'BB','Barbados'),(20,375,'BY','Belarus'),(21,32,'BE','Belgium'),(22,501,'BZ','Belize'),(23,229,'BJ','Benin'),(24,1441,'BM','Bermuda'),(25,975,'BT','Bhutan'),(26,591,'BO','Bolivia'),(27,387,'BA','Bosnia and Herzegovina'),(28,267,'BW','Botswana'),(29,0,'BV','Bouvet Island'),(30,55,'BR','Brazil'),(31,246,'IO','British Indian Ocean Territory'),(32,673,'BN','Brunei Darussalam'),(33,359,'BG','Bulgaria'),(34,226,'BF','Burkina Faso'),(35,257,'BI','Burundi'),(36,855,'KH','Cambodia'),(37,237,'CM','Cameroon'),(38,1,'CA','Canada'),(39,238,'CV','Cape Verde'),(40,1345,'KY','Cayman Islands'),(41,236,'CF','Central African Republic'),(42,235,'TD','Chad'),(43,56,'CL','Chile'),(44,86,'CN','China'),(45,61,'CX','Christmas Island'),(46,672,'CC','Cocos (Keeling) Islands'),(47,57,'CO','Colombia'),(48,269,'KM','Comoros'),(49,242,'CG','Congo'),(50,242,'CD','Congo, the Democratic Republic of the'),(51,682,'CK','Cook Islands'),(52,506,'CR','Costa Rica'),(53,225,'CI','Cote D\'Ivoire'),(54,385,'HR','Croatia'),(55,53,'CU','Cuba'),(56,357,'CY','Cyprus'),(57,420,'CZ','Czech Republic'),(58,45,'DK','Denmark'),(59,253,'DJ','Djibouti'),(60,1767,'DM','Dominica'),(61,1809,'DO','Dominican Republic'),(62,593,'EC','Ecuador'),(63,20,'EG','Egypt'),(64,503,'SV','El Salvador'),(65,240,'GQ','Equatorial Guinea'),(66,291,'ER','Eritrea'),(67,372,'EE','Estonia'),(68,251,'ET','Ethiopia'),(69,500,'FK','Falkland Islands (Malvinas)'),(70,298,'FO','Faroe Islands'),(71,679,'FJ','Fiji'),(72,358,'FI','Finland'),(73,33,'FR','France'),(74,594,'GF','French Guiana'),(75,689,'PF','French Polynesia'),(76,0,'TF','French Southern Territories'),(77,241,'GA','Gabon'),(78,220,'GM','Gambia'),(79,995,'GE','Georgia'),(80,49,'DE','Germany'),(81,233,'GH','Ghana'),(82,350,'GI','Gibraltar'),(83,30,'GR','Greece'),(84,299,'GL','Greenland'),(85,1473,'GD','Grenada'),(86,590,'GP','Guadeloupe'),(87,1671,'GU','Guam'),(88,502,'GT','Guatemala'),(89,224,'GN','Guinea'),(90,245,'GW','Guinea-Bissau'),(91,592,'GY','Guyana'),(92,509,'HT','Haiti'),(93,0,'HM','Heard Island and Mcdonald Islands'),(94,39,'VA','Holy See (Vatican City State)'),(95,504,'HN','Honduras'),(96,852,'HK','Hong Kong'),(97,36,'HU','Hungary'),(98,354,'IS','Iceland'),(99,91,'IN','India'),(100,62,'ID','Indonesia'),(101,98,'IR','Iran, Islamic Republic of'),(102,964,'IQ','Iraq'),(103,353,'IE','Ireland'),(104,972,'IL','Israel'),(105,39,'IT','Italy'),(106,1876,'JM','Jamaica'),(107,81,'JP','Japan'),(108,962,'JO','Jordan'),(109,7,'KZ','Kazakhstan'),(110,254,'KE','Kenya'),(111,686,'KI','Kiribati'),(112,850,'KP','Korea, Democratic People\'s Republic of'),(113,82,'KR','Korea, Republic of'),(114,965,'KW','Kuwait'),(115,996,'KG','Kyrgyzstan'),(116,856,'LA','Lao People\'s Democratic Republic'),(117,371,'LV','Latvia'),(118,961,'LB','Lebanon'),(119,266,'LS','Lesotho'),(120,231,'LR','Liberia'),(121,218,'LY','Libyan Arab Jamahiriya'),(122,423,'LI','Liechtenstein'),(123,370,'LT','Lithuania'),(124,352,'LU','Luxembourg'),(125,853,'MO','Macao'),(126,389,'MK','Macedonia, the Former Yugoslav Republic of'),(127,261,'MG','Madagascar'),(128,265,'MW','Malawi'),(129,60,'MY','Malaysia'),(130,960,'MV','Maldives'),(131,223,'ML','Mali'),(132,356,'MT','Malta'),(133,692,'MH','Marshall Islands'),(134,596,'MQ','Martinique'),(135,222,'MR','Mauritania'),(136,230,'MU','Mauritius'),(137,269,'YT','Mayotte'),(138,52,'MX','Mexico'),(139,691,'FM','Micronesia, Federated States of'),(140,373,'MD','Moldova, Republic of'),(141,377,'MC','Monaco'),(142,976,'MN','Mongolia'),(143,1664,'MS','Montserrat'),(144,212,'MA','Morocco'),(145,258,'MZ','Mozambique'),(146,95,'MM','Myanmar'),(147,264,'NA','Namibia'),(148,674,'NR','Nauru'),(149,977,'NP','Nepal'),(150,31,'NL','Netherlands'),(151,599,'AN','Netherlands Antilles'),(152,687,'NC','New Caledonia'),(153,64,'NZ','New Zealand'),(154,505,'NI','Nicaragua'),(155,227,'NE','Niger'),(156,234,'NG','Nigeria'),(157,683,'NU','Niue'),(158,672,'NF','Norfolk Island'),(159,1670,'MP','Northern Mariana Islands'),(160,47,'NO','Norway'),(161,968,'OM','Oman'),(162,92,'PK','Pakistan'),(163,680,'PW','Palau'),(164,970,'PS','Palestinian Territory, Occupied'),(165,507,'PA','Panama'),(166,675,'PG','Papua New Guinea'),(167,595,'PY','Paraguay'),(168,51,'PE','Peru'),(169,63,'PH','Philippines'),(170,0,'PN','Pitcairn'),(171,48,'PL','Poland'),(172,351,'PT','Portugal'),(173,1787,'PR','Puerto Rico'),(174,974,'QA','Qatar'),(175,262,'RE','Reunion'),(176,40,'RO','Romania'),(177,70,'RU','Russian Federation'),(178,250,'RW','Rwanda'),(179,290,'SH','Saint Helena'),(180,1869,'KN','Saint Kitts and Nevis'),(181,1758,'LC','Saint Lucia'),(182,508,'PM','Saint Pierre and Miquelon'),(183,1784,'VC','Saint Vincent and the Grenadines'),(184,684,'WS','Samoa'),(185,378,'SM','San Marino'),(186,239,'ST','Sao Tome and Principe'),(187,966,'SA','Saudi Arabia'),(188,221,'SN','Senegal'),(189,381,'CS','Serbia and Montenegro'),(190,248,'SC','Seychelles'),(191,232,'SL','Sierra Leone'),(192,65,'SG','Singapore'),(193,421,'SK','Slovakia'),(194,386,'SI','Slovenia'),(195,677,'SB','Solomon Islands'),(196,252,'SO','Somalia'),(197,27,'ZA','South Africa'),(198,0,'GS','South Georgia and the South Sandwich Islands'),(199,34,'ES','Spain'),(200,94,'LK','Sri Lanka'),(201,249,'SD','Sudan'),(202,597,'SR','Suriname'),(203,47,'SJ','Svalbard and Jan Mayen'),(204,268,'SZ','Swaziland'),(205,46,'SE','Sweden'),(206,41,'CH','Switzerland'),(207,963,'SY','Syrian Arab Republic'),(208,886,'TW','Taiwan, Province of China'),(209,992,'TJ','Tajikistan'),(210,255,'TZ','Tanzania, United Republic of'),(211,66,'TH','Thailand'),(212,670,'TL','Timor-Leste'),(213,228,'TG','Togo'),(214,690,'TK','Tokelau'),(215,676,'TO','Tonga'),(216,1868,'TT','Trinidad and Tobago'),(217,216,'TN','Tunisia'),(218,90,'TR','Turkey'),(219,7370,'TM','Turkmenistan'),(220,1649,'TC','Turks and Caicos Islands'),(221,688,'TV','Tuvalu'),(222,256,'UG','Uganda'),(223,380,'UA','Ukraine'),(224,971,'AE','United Arab Emirates'),(225,44,'GB','United Kingdom'),(226,1,'US','United States'),(227,1,'UM','United States Minor Outlying Islands'),(228,598,'UY','Uruguay'),(229,998,'UZ','Uzbekistan'),(230,678,'VU','Vanuatu'),(231,58,'VE','Venezuela'),(232,84,'VN','Viet Nam'),(233,1284,'VG','Virgin Islands, British'),(234,1340,'VI','Virgin Islands, U.s.'),(235,681,'WF','Wallis and Futuna'),(236,212,'EH','Western Sahara'),(237,967,'YE','Yemen'),(238,260,'ZM','Zambia'),(239,263,'ZW','Zimbabwe');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'Desktop'),(2,'Mobile'),(3,'Tablet');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issued_tokens`
--

DROP TABLE IF EXISTS `issued_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issued_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `exp` bigint NOT NULL,
  `blacklisted` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issued_tokens`
--

LOCK TABLES `issued_tokens` WRITE;
/*!40000 ALTER TABLE `issued_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `issued_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'Arabic'),(2,'Bengali'),(3,'Chinese'),(4,'English'),(5,'French'),(6,'German'),(7,'Gujarati'),(8,'Hindi'),(9,'Italian'),(10,'Japanese'),(11,'Kannada'),(12,'Korean'),(13,'Malayalam'),(14,'Mandarin'),(15,'Marathi'),(16,'Persian'),(17,'Portuguese'),(18,'Punjabi'),(19,'Russian'),(20,'Spanish'),(21,'Tamil'),(22,'Telugu'),(23,'Turkish'),(24,'Urdu'),(25,'Vietnamese');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `os`
--

DROP TABLE IF EXISTS `os`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `os` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `version` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `os`
--

LOCK TABLES `os` WRITE;
/*!40000 ALTER TABLE `os` DISABLE KEYS */;
INSERT INTO `os` VALUES (1,'AIX',0),(2,'Amiga OS',0),(3,'Android',0),(4,'Android',4),(5,'Android',5),(6,'Android',6),(7,'Android',7),(8,'Android',8),(9,'Android',9),(10,'Android',10),(11,'Android',11),(12,'Android',12),(13,'Arch',0),(14,'Bada',0),(15,'BlackBerry',0),(16,'CentOS',0),(17,'Chrome OS',0),(18,'Chromium OS',0),(19,'Debian',0),(20,'DragonFly',0),(21,'Fedora',0),(22,'FreeBSD',0),(23,'Fuchsia',0),(24,'GNU',0),(25,'Gentoo',0),(26,'Haiku',0),(27,'iOS',0),(28,'iOS',6),(29,'iOS',7),(30,'iOS',8),(31,'iOS',9),(32,'iOS',10),(33,'iOS',11),(34,'iOS',12),(35,'iOS',13),(36,'iOS',14),(37,'iOS',15),(38,'KaiOS',0),(39,'Linpus',0),(40,'Linux',0),(41,'Mac OS',0),(42,'Mac OS X',0),(43,'Mac OS X',10),(44,'Mac OS X',11),(45,'Mageia',0),(46,'Mandriva',0),(47,'MeeGo',0),(48,'Minix',0),(49,'Mint',0),(50,'Morph OS',0),(51,'NetBSD',0),(52,'Nintendo',0),(53,'OpenBSD',0),(54,'OpenVMS',0),(55,'PCLinuxOS',0),(56,'Palm',0),(57,'Plan9',0),(58,'PlayStation',0),(59,'QNX',0),(60,'RIM Tablet OS',0),(61,'RISC OS',0),(62,'Raspbian',0),(63,'RedHat',0),(64,'SUSE',0),(65,'Sailfish',0),(66,'Slackware',0),(67,'Solaris',0),(68,'Tizen',0),(69,'Ubuntu',0),(70,'Unix',0),(71,'VectorLinux',0),(72,'WebOS',0),(73,'Windows',0),(74,'Windows',10),(75,'Windows',11),(76,'Windows',7),(77,'Windows',8),(78,'Windows Phone',0),(79,'Zenwalk',0);
/*!40000 ALTER TABLE `os` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `mtx` varchar(14) NOT NULL,
  `rzr_order_id` varchar(25) DEFAULT NULL,
  `rzr_payment_id` varchar(25) DEFAULT NULL,
  `amount` float(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `status` varchar(10) NOT NULL DEFAULT 'created',
  `processor` tinyint(1) NOT NULL,
  `time_unix` bigint NOT NULL,
  `rzr_signature` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mtx` (`mtx`),
  UNIQUE KEY `rzr_order_id` (`rzr_order_id`),
  UNIQUE KEY `rzr_payment_id` (`rzr_payment_id`),
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pops`
--

DROP TABLE IF EXISTS `pops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pops` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `ad_uid` int NOT NULL,
  `pub_uid` int NOT NULL,
  `ad_id` int NOT NULL,
  `site_id` int NOT NULL,
  `ad_url` varchar(500) NOT NULL,
  `ad_url_tiny` varchar(7) NOT NULL,
  `pub_url` varchar(500) NOT NULL,
  `pub_url_tiny` varchar(7) NOT NULL,
  `category` int NOT NULL DEFAULT '0',
  `device` tinyint(1) NOT NULL DEFAULT '0',
  `os` int NOT NULL DEFAULT '0',
  `browser` int NOT NULL DEFAULT '0',
  `country` int NOT NULL DEFAULT '0',
  `language` int NOT NULL DEFAULT '0',
  `ip` varchar(45) NOT NULL DEFAULT '0',
  `ip_tiny` varchar(7) NOT NULL,
  `ad_cpc` float(10,5) NOT NULL,
  `pub_cpc` float(10,5) NOT NULL,
  `day_unix` bigint NOT NULL DEFAULT '0',
  `time_unix` bigint NOT NULL DEFAULT '0',
  `valid` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `iptiny_dayunix` (`ip_tiny`,`day_unix`) USING BTREE,
  KEY `ad_id` (`ad_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pops`
--

LOCK TABLES `pops` WRITE;
/*!40000 ALTER TABLE `pops` DISABLE KEYS */;
/*!40000 ALTER TABLE `pops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pub_sites`
--

DROP TABLE IF EXISTS `pub_sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pub_sites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `domain` varchar(100) NOT NULL,
  `hash` varchar(12) NOT NULL,
  `category` int NOT NULL,
  `language` int NOT NULL,
  `traffic` int NOT NULL,
  `adult` int NOT NULL DEFAULT '0',
  `views` bigint NOT NULL DEFAULT '0',
  `clicks` bigint NOT NULL DEFAULT '0',
  `pops` bigint NOT NULL DEFAULT '0',
  `earned` float(15,5) NOT NULL DEFAULT '0.00000',
  `status` tinyint(1) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`),
  KEY `uid` (`uid`) USING BTREE,
  KEY `domain_hash` (`hash`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pub_sites`
--

LOCK TABLES `pub_sites` WRITE;
/*!40000 ALTER TABLE `pub_sites` DISABLE KEYS */;
/*!40000 ALTER TABLE `pub_sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_stats`
--

DROP TABLE IF EXISTS `ref_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ref_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_uid` int NOT NULL,
  `earned` float(15,5) NOT NULL DEFAULT '0.00000',
  `day_unix` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ref_uid` (`ref_uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_stats`
--

LOCK TABLES `ref_stats` WRITE;
/*!40000 ALTER TABLE `ref_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `ref_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `min_deposit` float(10,2) NOT NULL DEFAULT '1.00',
  `max_deposit` float(10,2) NOT NULL DEFAULT '5000.00',
  `min_withdraw` float(10,2) NOT NULL DEFAULT '10.00',
  `withdraw_fee` float(6,2) NOT NULL DEFAULT '0.00',
  `ref_commision` float(4,2) NOT NULL DEFAULT '0.10',
  `min_cpc` float(10,5) NOT NULL DEFAULT '0.02000',
  `min_budget` float(15,5) NOT NULL DEFAULT '1.00000',
  `min_daily_budget` float(15,5) NOT NULL DEFAULT '1.00000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,1.00,5000.00,100.00,2.00,10.00,0.01000,1.00000,1.00000);
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `summary_browser`
--

DROP TABLE IF EXISTS `summary_browser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `summary_browser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ad_uid` int DEFAULT NULL,
  `pub_uid` int DEFAULT NULL,
  `browser` int NOT NULL,
  `campaign` int DEFAULT NULL,
  `website` int DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `clicks` int NOT NULL DEFAULT '0',
  `pops` int NOT NULL DEFAULT '0',
  `cost` float(15,5) NOT NULL DEFAULT '0.00000',
  `day_unix` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `aduid_dayunix` (`ad_uid`,`day_unix`) USING BTREE,
  KEY `pubuid_dayunix` (`pub_uid`,`day_unix`) USING BTREE,
  KEY `website` (`website`) USING BTREE,
  KEY `campaign` (`campaign`) USING BTREE,
  KEY `browser` (`browser`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `summary_browser`
--

LOCK TABLES `summary_browser` WRITE;
/*!40000 ALTER TABLE `summary_browser` DISABLE KEYS */;
/*!40000 ALTER TABLE `summary_browser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `summary_country`
--

DROP TABLE IF EXISTS `summary_country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `summary_country` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ad_uid` int DEFAULT NULL,
  `pub_uid` int DEFAULT NULL,
  `country` int NOT NULL DEFAULT '0',
  `campaign` int DEFAULT NULL,
  `website` int DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `clicks` int NOT NULL DEFAULT '0',
  `pops` int NOT NULL DEFAULT '0',
  `cost` float(15,5) NOT NULL DEFAULT '0.00000',
  `day_unix` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `aduid_dayunix` (`ad_uid`,`day_unix`) USING BTREE,
  KEY `pubuid_dayunix` (`pub_uid`,`day_unix`) USING BTREE,
  KEY `website` (`website`) USING BTREE,
  KEY `campaign` (`campaign`) USING BTREE,
  KEY `country` (`country`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `summary_country`
--

LOCK TABLES `summary_country` WRITE;
/*!40000 ALTER TABLE `summary_country` DISABLE KEYS */;
/*!40000 ALTER TABLE `summary_country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `summary_device`
--

DROP TABLE IF EXISTS `summary_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `summary_device` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ad_uid` int DEFAULT NULL,
  `pub_uid` int DEFAULT NULL,
  `device` int NOT NULL,
  `campaign` int DEFAULT NULL,
  `website` int DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `clicks` int NOT NULL DEFAULT '0',
  `pops` int NOT NULL DEFAULT '0',
  `cost` float(15,5) NOT NULL DEFAULT '0.00000',
  `day_unix` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `aduid_dayunix` (`ad_uid`,`day_unix`) USING BTREE,
  KEY `pubuid_dayunix` (`pub_uid`,`day_unix`) USING BTREE,
  KEY `website` (`website`) USING BTREE,
  KEY `campaign` (`campaign`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `summary_device`
--

LOCK TABLES `summary_device` WRITE;
/*!40000 ALTER TABLE `summary_device` DISABLE KEYS */;
/*!40000 ALTER TABLE `summary_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `summary_os`
--

DROP TABLE IF EXISTS `summary_os`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `summary_os` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ad_uid` int DEFAULT NULL,
  `pub_uid` int DEFAULT NULL,
  `os` int NOT NULL,
  `campaign` int DEFAULT NULL,
  `website` int DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `clicks` int NOT NULL DEFAULT '0',
  `pops` int NOT NULL DEFAULT '0',
  `cost` float(15,5) NOT NULL DEFAULT '0.00000',
  `day_unix` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `aduid_dayunix` (`ad_uid`,`day_unix`) USING BTREE,
  KEY `pubuid_dayunix` (`pub_uid`,`day_unix`) USING BTREE,
  KEY `website` (`website`) USING BTREE,
  KEY `campaign` (`campaign`) USING BTREE,
  KEY `os` (`os`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `summary_os`
--

LOCK TABLES `summary_os` WRITE;
/*!40000 ALTER TABLE `summary_os` DISABLE KEYS */;
/*!40000 ALTER TABLE `summary_os` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timezones`
--

DROP TABLE IF EXISTS `timezones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timezones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timezones`
--

LOCK TABLES `timezones` WRITE;
/*!40000 ALTER TABLE `timezones` DISABLE KEYS */;
INSERT INTO `timezones` VALUES (1,'Europe/Tirane'),(2,'Asia/Yerevan'),(3,'Antarctica/McMurdo'),(4,'Asia/Dubai'),(5,'Asia/Kabul'),(6,'America/Antigua'),(7,'Africa/Luanda'),(8,'Europe/Andorra'),(9,'America/Anguilla'),(10,'Antarctica/Casey'),(11,'Antarctica/Davis'),(12,'Antarctica/DumontDUrville'),(13,'Antarctica/Mawson'),(14,'Antarctica/Palmer'),(15,'Antarctica/Rothera'),(16,'Antarctica/Syowa'),(17,'Antarctica/Troll'),(18,'Antarctica/Vostok'),(19,'America/Argentina/Buenos_Aires'),(20,'America/Argentina/Cordoba'),(21,'America/Argentina/Salta'),(22,'America/Argentina/Jujuy'),(23,'America/Argentina/Catamarca'),(24,'America/Argentina/La_Rioja'),(25,'America/Argentina/San_Juan'),(26,'America/Argentina/Mendoza'),(27,'America/Argentina/San_Luis'),(28,'America/Argentina/Rio_Gallegos'),(29,'America/Argentina/Ushuaia'),(30,'America/Argentina/Tucuman'),(31,'Pacific/Pago_Pago'),(32,'Europe/Vienna'),(33,'Australia/Lord_Howe'),(34,'Antarctica/Macquarie'),(35,'Australia/Hobart'),(36,'Australia/Sydney'),(37,'Australia/Broken_Hill'),(38,'Australia/Melbourne'),(39,'Australia/Brisbane'),(40,'Australia/Lindeman'),(41,'Australia/Adelaide'),(42,'Australia/Darwin'),(43,'Australia/Perth'),(44,'Australia/Eucla'),(45,'America/Aruba'),(46,'Europe/Mariehamn'),(47,'America/Barbados'),(48,'Asia/Dhaka'),(49,'Asia/Baku'),(50,'Europe/Sarajevo'),(51,'Europe/Brussels'),(52,'Africa/Ouagadougou'),(53,'Europe/Sofia'),(54,'Asia/Bahrain'),(55,'Africa/Bujumbura'),(56,'America/St_Barthelemy'),(57,'Atlantic/Bermuda'),(58,'Asia/Brunei'),(59,'America/La_Paz'),(60,'Africa/Porto-Novo'),(61,'America/Kralendijk'),(62,'America/Noronha'),(63,'America/Belem'),(64,'America/Fortaleza'),(65,'America/Recife'),(66,'America/Araguaina'),(67,'America/Maceio'),(68,'America/Bahia'),(69,'America/Sao_Paulo'),(70,'America/Campo_Grande'),(71,'America/Cuiaba'),(72,'America/Santarem'),(73,'America/Porto_Velho'),(74,'America/Boa_Vista'),(75,'America/Manaus'),(76,'America/Eirunepe'),(77,'America/Rio_Branco'),(78,'America/Nassau'),(79,'Asia/Thimphu'),(80,'Africa/Gaborone'),(81,'Europe/Minsk'),(82,'America/Belize'),(83,'America/St_Johns'),(84,'America/Halifax'),(85,'America/Glace_Bay'),(86,'America/Moncton'),(87,'America/Goose_Bay'),(88,'America/Blanc-Sablon'),(89,'America/Toronto'),(90,'America/Nipigon'),(91,'America/Thunder_Bay'),(92,'America/Iqaluit'),(93,'America/Pangnirtung'),(94,'America/Atikokan'),(95,'America/Winnipeg'),(96,'America/Rainy_River'),(97,'America/Resolute'),(98,'America/Rankin_Inlet'),(99,'America/Regina'),(100,'America/Swift_Current'),(101,'America/Edmonton'),(102,'America/Cambridge_Bay'),(103,'America/Yellowknife'),(104,'America/Inuvik'),(105,'America/Creston'),(106,'America/Dawson_Creek'),(107,'America/Fort_Nelson'),(108,'America/Whitehorse'),(109,'America/Dawson'),(110,'America/Vancouver'),(111,'Indian/Cocos'),(112,'Africa/Kinshasa'),(113,'Africa/Lubumbashi'),(114,'Africa/Bangui'),(115,'Africa/Brazzaville'),(116,'Europe/Zurich'),(117,'Africa/Abidjan'),(118,'Pacific/Rarotonga'),(119,'America/Santiago'),(120,'America/Punta_Arenas'),(121,'Pacific/Easter'),(122,'Africa/Douala'),(123,'Asia/Shanghai'),(124,'Asia/Urumqi'),(125,'America/Bogota'),(126,'America/Costa_Rica'),(127,'America/Havana'),(128,'Atlantic/Cape_Verde'),(129,'America/Curacao'),(130,'Indian/Christmas'),(131,'Asia/Nicosia'),(132,'Asia/Famagusta'),(133,'Europe/Prague'),(134,'Europe/Berlin'),(135,'Europe/Busingen'),(136,'Africa/Djibouti'),(137,'Europe/Copenhagen'),(138,'America/Dominica'),(139,'America/Santo_Domingo'),(140,'Africa/Algiers'),(141,'America/Guayaquil'),(142,'Pacific/Galapagos'),(143,'Europe/Tallinn'),(144,'Africa/Cairo'),(145,'Africa/El_Aaiun'),(146,'Africa/Asmara'),(147,'Europe/Madrid'),(148,'Africa/Ceuta'),(149,'Atlantic/Canary'),(150,'Africa/Addis_Ababa'),(151,'Europe/Helsinki'),(152,'Pacific/Fiji'),(153,'Atlantic/Stanley'),(154,'Pacific/Chuuk'),(155,'Pacific/Pohnpei'),(156,'Pacific/Kosrae'),(157,'Atlantic/Faroe'),(158,'Europe/Paris'),(159,'Africa/Libreville'),(160,'Europe/London'),(161,'America/Grenada'),(162,'Asia/Tbilisi'),(163,'America/Cayenne'),(164,'Europe/Guernsey'),(165,'Africa/Accra'),(166,'Europe/Gibraltar'),(167,'America/Nuuk'),(168,'America/Danmarkshavn'),(169,'America/Scoresbysund'),(170,'America/Thule'),(171,'Africa/Banjul'),(172,'Africa/Conakry'),(173,'America/Guadeloupe'),(174,'Africa/Malabo'),(175,'Europe/Athens'),(176,'Atlantic/South_Georgia'),(177,'America/Guatemala'),(178,'Pacific/Guam'),(179,'Africa/Bissau'),(180,'America/Guyana'),(181,'Asia/Hong_Kong'),(182,'America/Tegucigalpa'),(183,'Europe/Zagreb'),(184,'America/Port-au-Prince'),(185,'Europe/Budapest'),(186,'Asia/Jakarta'),(187,'Asia/Pontianak'),(188,'Asia/Makassar'),(189,'Asia/Jayapura'),(190,'Europe/Dublin'),(191,'Asia/Jerusalem'),(192,'Europe/Isle_of_Man'),(193,'Asia/Kolkata'),(194,'Indian/Chagos'),(195,'Asia/Baghdad'),(196,'Asia/Tehran'),(197,'Atlantic/Reykjavik'),(198,'Europe/Rome'),(199,'Europe/Jersey'),(200,'America/Jamaica'),(201,'Asia/Amman'),(202,'Asia/Tokyo'),(203,'Africa/Nairobi'),(204,'Asia/Bishkek'),(205,'Asia/Phnom_Penh'),(206,'Pacific/Enderbury'),(207,'Pacific/Kiritimati'),(208,'Indian/Comoro'),(209,'Pacific/Tarawa'),(210,'America/St_Kitts'),(211,'Asia/Pyongyang'),(212,'Asia/Seoul'),(213,'Asia/Kuwait'),(214,'America/Cayman'),(215,'Asia/Almaty'),(216,'Asia/Qyzylorda'),(217,'Asia/Qostanay'),(218,'Asia/Aqtobe'),(219,'Asia/Aqtau'),(220,'Asia/Atyrau'),(221,'Asia/Oral'),(222,'Asia/Vientiane'),(223,'Asia/Beirut'),(224,'America/St_Lucia'),(225,'Europe/Vaduz'),(226,'Asia/Colombo'),(227,'Africa/Monrovia'),(228,'Africa/Maseru'),(229,'Europe/Vilnius'),(230,'Europe/Luxembourg'),(231,'Europe/Riga'),(232,'Africa/Tripoli'),(233,'Africa/Casablanca'),(234,'Europe/Monaco'),(235,'Europe/Chisinau'),(236,'Europe/Podgorica'),(237,'America/Marigot'),(238,'Indian/Antananarivo'),(239,'Pacific/Majuro'),(240,'Pacific/Kwajalein'),(241,'Europe/Skopje'),(242,'Africa/Bamako'),(243,'Asia/Yangon'),(244,'Asia/Ulaanbaatar'),(245,'Asia/Hovd'),(246,'Asia/Choibalsan'),(247,'Asia/Macau'),(248,'Pacific/Saipan'),(249,'America/Martinique'),(250,'Africa/Nouakchott'),(251,'America/Montserrat'),(252,'Europe/Malta'),(253,'Indian/Mauritius'),(254,'Indian/Maldives'),(255,'Africa/Blantyre'),(256,'America/Mexico_City'),(257,'America/Cancun'),(258,'America/Merida'),(259,'America/Monterrey'),(260,'America/Matamoros'),(261,'America/Mazatlan'),(262,'America/Chihuahua'),(263,'America/Ojinaga'),(264,'America/Hermosillo'),(265,'America/Tijuana'),(266,'America/Bahia_Banderas'),(267,'Asia/Kuala_Lumpur'),(268,'Asia/Kuching'),(269,'Africa/Maputo'),(270,'Africa/Windhoek'),(271,'Pacific/Noumea'),(272,'Africa/Niamey'),(273,'Pacific/Norfolk'),(274,'Africa/Lagos'),(275,'America/Managua'),(276,'Europe/Amsterdam'),(277,'Europe/Oslo'),(278,'Asia/Kathmandu'),(279,'Pacific/Nauru'),(280,'Pacific/Niue'),(281,'Pacific/Auckland'),(282,'Pacific/Chatham'),(283,'Asia/Muscat'),(284,'America/Panama'),(285,'America/Lima'),(286,'Pacific/Tahiti'),(287,'Pacific/Marquesas'),(288,'Pacific/Gambier'),(289,'Pacific/Port_Moresby'),(290,'Pacific/Bougainville'),(291,'Asia/Manila'),(292,'Asia/Karachi'),(293,'Europe/Warsaw'),(294,'America/Miquelon'),(295,'Pacific/Pitcairn'),(296,'America/Puerto_Rico'),(297,'Asia/Gaza'),(298,'Asia/Hebron'),(299,'Europe/Lisbon'),(300,'Atlantic/Madeira'),(301,'Atlantic/Azores'),(302,'Pacific/Palau'),(303,'America/Asuncion'),(304,'Asia/Qatar'),(305,'Indian/Reunion'),(306,'Europe/Bucharest'),(307,'Europe/Belgrade'),(308,'Europe/Kaliningrad'),(309,'Europe/Moscow'),(310,'Europe/Simferopol'),(311,'Europe/Kirov'),(312,'Europe/Volgograd'),(313,'Europe/Astrakhan'),(314,'Europe/Saratov'),(315,'Europe/Ulyanovsk'),(316,'Europe/Samara'),(317,'Asia/Yekaterinburg'),(318,'Asia/Omsk'),(319,'Asia/Novosibirsk'),(320,'Asia/Barnaul'),(321,'Asia/Tomsk'),(322,'Asia/Novokuznetsk'),(323,'Asia/Krasnoyarsk'),(324,'Asia/Irkutsk'),(325,'Asia/Chita'),(326,'Asia/Yakutsk'),(327,'Asia/Khandyga'),(328,'Asia/Vladivostok'),(329,'Asia/Ust-Nera'),(330,'Asia/Magadan'),(331,'Asia/Sakhalin'),(332,'Asia/Srednekolymsk'),(333,'Asia/Kamchatka'),(334,'Asia/Anadyr'),(335,'Africa/Kigali'),(336,'Asia/Riyadh'),(337,'Pacific/Guadalcanal'),(338,'Indian/Mahe'),(339,'Africa/Khartoum'),(340,'Europe/Stockholm'),(341,'Asia/Singapore'),(342,'Atlantic/St_Helena'),(343,'Europe/Ljubljana'),(344,'Arctic/Longyearbyen'),(345,'Europe/Bratislava'),(346,'Africa/Freetown'),(347,'Europe/San_Marino'),(348,'Africa/Dakar'),(349,'Africa/Mogadishu'),(350,'America/Paramaribo'),(351,'Africa/Juba'),(352,'Africa/Sao_Tome'),(353,'America/El_Salvador'),(354,'America/Lower_Princes'),(355,'Asia/Damascus'),(356,'Africa/Mbabane'),(357,'America/Grand_Turk'),(358,'Africa/Ndjamena'),(359,'Indian/Kerguelen'),(360,'Africa/Lome'),(361,'Asia/Bangkok'),(362,'Asia/Dushanbe'),(363,'Pacific/Fakaofo'),(364,'Asia/Dili'),(365,'Asia/Ashgabat'),(366,'Africa/Tunis'),(367,'Pacific/Tongatapu'),(368,'Europe/Istanbul'),(369,'America/Port_of_Spain'),(370,'Pacific/Funafuti'),(371,'Asia/Taipei'),(372,'Africa/Dar_es_Salaam'),(373,'Europe/Kiev'),(374,'Europe/Uzhgorod'),(375,'Europe/Zaporozhye'),(376,'Africa/Kampala'),(377,'Pacific/Midway'),(378,'Pacific/Wake'),(379,'America/New_York'),(380,'America/Detroit'),(381,'America/Kentucky/Louisville'),(382,'America/Kentucky/Monticello'),(383,'America/Indiana/Indianapolis'),(384,'America/Indiana/Vincennes'),(385,'America/Indiana/Winamac'),(386,'America/Indiana/Marengo'),(387,'America/Indiana/Petersburg'),(388,'America/Indiana/Vevay'),(389,'America/Chicago'),(390,'America/Indiana/Tell_City'),(391,'America/Indiana/Knox'),(392,'America/Menominee'),(393,'America/North_Dakota/Center'),(394,'America/North_Dakota/New_Salem'),(395,'America/North_Dakota/Beulah'),(396,'America/Denver'),(397,'America/Boise'),(398,'America/Phoenix'),(399,'America/Los_Angeles'),(400,'America/Anchorage'),(401,'America/Juneau'),(402,'America/Sitka'),(403,'America/Metlakatla'),(404,'America/Yakutat'),(405,'America/Nome'),(406,'America/Adak'),(407,'Pacific/Honolulu'),(408,'America/Montevideo'),(409,'Asia/Samarkand'),(410,'Asia/Tashkent'),(411,'Europe/Vatican'),(412,'America/St_Vincent'),(413,'America/Caracas'),(414,'America/Tortola'),(415,'America/St_Thomas'),(416,'Asia/Ho_Chi_Minh'),(417,'Pacific/Efate'),(418,'Pacific/Wallis'),(419,'Pacific/Apia'),(420,'Asia/Aden'),(421,'Indian/Mayotte'),(422,'Africa/Johannesburg'),(423,'Africa/Lusaka'),(424,'Africa/Harare');
/*!40000 ALTER TABLE `timezones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist`
--

DROP TABLE IF EXISTS `token_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tid` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tid` (`tid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist`
--

LOCK TABLES `token_blacklist` WRITE;
/*!40000 ALTER TABLE `token_blacklist` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_banners`
--

DROP TABLE IF EXISTS `user_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `size` int NOT NULL,
  `src` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_banners`
--

LOCK TABLES `user_banners` WRITE;
/*!40000 ALTER TABLE `user_banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `paypal` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `ac_no` bigint DEFAULT NULL,
  `ifsc` varchar(255) DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `upi` varchar(255) DEFAULT NULL,
  `payoneer` varchar(255) DEFAULT NULL,
  `verify` varchar(12) DEFAULT NULL,
  `verify_exp` bigint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  KEY `verify` (`verify`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(20) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `gid` varchar(21) DEFAULT NULL,
  `pass` varchar(60) DEFAULT NULL,
  `country` int NOT NULL,
  `mobile` bigint NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `surname` varchar(20) DEFAULT NULL,
  `ac_type` tinyint(1) NOT NULL,
  `ref_by` int DEFAULT NULL,
  `company_name` varchar(50) NOT NULL DEFAULT 'NA',
  `pub_earnings` float(15,5) NOT NULL DEFAULT '0.00000',
  `ref_earnings` float(15,5) NOT NULL DEFAULT '0.00000',
  `ad_spending` float(15,5) NOT NULL DEFAULT '0.00000',
  `ad_balance` float(15,5) NOT NULL DEFAULT '0.00000',
  `pub_balance` float(15,5) NOT NULL DEFAULT '0.00000',
  `pub_views` bigint NOT NULL DEFAULT '0',
  `pub_clicks` bigint NOT NULL DEFAULT '0',
  `pub_pops` bigint NOT NULL DEFAULT '0',
  `ad_views` bigint NOT NULL DEFAULT '0',
  `ad_clicks` bigint NOT NULL DEFAULT '0',
  `ad_pops` bigint NOT NULL DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `rank` tinyint(1) DEFAULT '3',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`),
  UNIQUE KEY `mail` (`mail`),
  UNIQUE KEY `gid` (`gid`),
  KEY `mobile` (`mobile`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','adtolcom@gmail.com',NULL,'$2a$12$iQoF8hYqEBNFwymksAcxV.cyoKHkbqkvKj48QsWoJng7aea9.xh5O',99,7385859262,NULL,NULL,2,NULL,'EvilTech Pvt Ltd',0.00000,0.00000,0.00000,0.00000,0.00000,0,0,0,0,0,0,1,1,'2021-09-30 14:10:55','2021-09-30 14:10:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `views`
--

DROP TABLE IF EXISTS `views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `ad_uid` int NOT NULL,
  `pub_uid` int NOT NULL,
  `ad_id` int NOT NULL,
  `site_id` int NOT NULL,
  `ad_url` varchar(500) NOT NULL,
  `ad_url_tiny` varchar(7) NOT NULL,
  `pub_url` varchar(500) NOT NULL,
  `pub_url_tiny` varchar(7) NOT NULL,
  `ad_type` tinyint(1) NOT NULL,
  `category` int NOT NULL DEFAULT '0',
  `device` int NOT NULL DEFAULT '0',
  `os` int NOT NULL DEFAULT '0',
  `browser` int NOT NULL DEFAULT '0',
  `country` int NOT NULL DEFAULT '0',
  `language` int NOT NULL DEFAULT '0',
  `ip` varchar(45) NOT NULL DEFAULT '0',
  `day_unix` bigint NOT NULL DEFAULT '0',
  `time_unix` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `views`
--

LOCK TABLES `views` WRITE;
/*!40000 ALTER TABLE `views` DISABLE KEYS */;
/*!40000 ALTER TABLE `views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdraws`
--

DROP TABLE IF EXISTS `withdraws`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdraws` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `mtx` varchar(14) NOT NULL,
  `amount` float(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `processor` tinyint(1) NOT NULL DEFAULT '2',
  `fee` float(6,2) NOT NULL DEFAULT '0.00',
  `status` tinyint(1) NOT NULL DEFAULT '2',
  `time_unix` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mtx` (`mtx`),
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdraws`
--

LOCK TABLES `withdraws` WRITE;
/*!40000 ALTER TABLE `withdraws` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdraws` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-01 13:14:07
