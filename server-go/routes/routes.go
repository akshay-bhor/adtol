package routes

import (
	"server-go/routes/authroutes"

	"github.com/gin-gonic/gin"
)

func RegisterAllRoutes(server *gin.Engine) {
	apiRoutes := server.Group("/api")

	authroutes.RegisterAuthRoutes(apiRoutes)
}
