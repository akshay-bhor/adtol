package authController

import (
	"net/http"
	"server-go/db"
	"server-go/models"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"Hello": "World",
	})
}

func GetCountries(c *gin.Context) {
	var countries []models.Countries

	db.DB.Find(&countries)

	c.JSON(http.StatusOK, gin.H{
		"countries": countries,
	})
}
