package authroutes

import (
	authController "server-go/controllers/auth"
	authmiddleware "server-go/middlewares/authMiddleware"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(server *gin.RouterGroup) {
	auth := server.Group("/auth")

	auth.POST("/register", authmiddleware.CheckRegistrationDetails, authController.Register)
	auth.GET("/get-countries", authController.GetCountries)
}
