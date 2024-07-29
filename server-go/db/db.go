package db

import (
	"os"
	logger "server-go/utils"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	dsn := os.Getenv("DB_STRING")
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		logger.Error(err, "Failed to connect to database")
	}
}
