package authController

import (
	"errors"
	"net/http"
	"server-go/db"
	authmiddleware "server-go/middlewares/authMiddleware"
	"server-go/utils/logger"

	"server-go/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Register(c *gin.Context) {
	requestBody, _ := c.Get("body")

	username := requestBody.(authmiddleware.RegisterRequest).User
	email := requestBody.(authmiddleware.RegisterRequest).Mail

	// Check if username exist
	var user models.Users
	result := db.DB.Where(&models.Users{User: username}).First(&user)

	if result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Username already exists",
		})
		return
	}

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		logger.Debug("Username not found, proceeding")
	}

	// Check if email exist
	result = db.DB.Where(&models.Users{Mail: email}).First(&user)

	if result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Email already exist",
		})
		return
	}

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		logger.Debug("Email not found, proceeding")
	}

	c.JSON(http.StatusOK, gin.H{
		"countries": "hi",
	})
}

func GetCountries(c *gin.Context) {
	var countries []models.Countries

	db.DB.Find(&countries)

	c.JSON(http.StatusOK, gin.H{
		"countries": countries,
	})
}
