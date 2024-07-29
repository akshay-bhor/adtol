package migrations

import (
	"server-go/db"
	"server-go/models"
)

func Migrate() {
	db.DB.AutoMigrate(&models.Users{})
}
