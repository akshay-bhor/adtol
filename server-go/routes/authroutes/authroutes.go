package authroutes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(server *gin.Engine) {
	auth := server.Group("/auth")

	auth.POST("/register", register)
}

func register(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"Hello": "World",
	})
}
