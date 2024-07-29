package main

import (
	"server-go/db"
	"server-go/migrations"
	"server-go/routes"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload" // Auto load env file
)

func init() {
	db.InitDB()
	migrations.Migrate()
}

func main() {
	server := gin.Default()

	routes.RegisterAllRoutes(server)

	server.Run(":4000")
}
