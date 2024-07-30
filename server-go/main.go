package main

import (
	"server-go/db"
	"server-go/migrations"
	"server-go/routes"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload" // Auto load env file
	xss "github.com/sahilchopra/gin-gonic-xss-middleware"
)

func init() {
	db.InitDB()
	migrations.Migrate()
}

func main() {
	server := gin.Default()

	// XSS middleware
	var xssMdlwr xss.XssMw
	server.Use(xssMdlwr.RemoveXss())

	routes.RegisterAllRoutes(server)

	server.Run(":4000")
}