package authroutes

import (
	authController "server-go/controllers/auth"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(server *gin.RouterGroup) {
	auth := server.Group("/auth")

	auth.POST("/register", authController.Register)
	auth.GET("/get-countries", authController.GetCountries)
}
