package authroutes

import (
	authController "server-go/controllers/auth"
	"server-go/middlewares/authMiddleware"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(server *gin.RouterGroup) {
	auth := server.Group("/auth")

	auth.POST("/register", authMiddleware.CheckRegistrationDetails, authController.Register)
	auth.GET("/get-countries", authMiddleware.IsLoggedIn, authMiddleware.RequireAuth, authController.GetCountries)
	auth.POST("/login", authMiddleware.CheckLogindetails, authController.Login)
}
