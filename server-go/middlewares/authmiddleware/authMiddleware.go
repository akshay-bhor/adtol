package authMiddleware

import (
	"fmt"
	"net/http"
	"os"
	"server-go/utils/logger"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type RegisterRequest struct {
	User         string  `json:"user" binding:"required,alphanum,max=20,min=4"`
	Mail         string  `json:"mail" binding:"required,email"`
	Gid          *string `json:"gid,omitempty"`
	Pass         *string `json:"pass,omitempty" binding:"omitempty,min=8"`
	Country      int     `json:"country" binding:"required,number"`
	Mobile       int     `json:"mobile" binding:"required,number,min=1000,max=9999999999"`
	Name         *string `json:"name,omitempty" binding:"omitempty,alpha"`
	Surname      *string `json:"surname,omitempty" binding:"omitempty,alpha"`
	Ac_type      string  `json:"ac_type" binding:"required,number"`
	Company_name *string `json:"company_name,omitempty" binding:"omitempty,alpha"`
}

func CheckRegistrationDetails(c *gin.Context) {
	var reqBody RegisterRequest

	err := c.Bind(&reqBody)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"msg": "Validation Error!",
			"err": err.Error(),
		})
		return
	}

	c.Set("body", reqBody)

	c.Next()
}

type LoginRequest struct {
	Client string `json:"client" binding:"required"`
	Pass   string `json:"pass" binding:"required"`
}

func CheckLogindetails(c *gin.Context) {
	var requestBody LoginRequest

	err := c.Bind(&requestBody)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"msg": "Validtion Error",
			"err": err.Error(),
		})
		return
	}

	c.Set("body", requestBody)

	c.Next()
}

func IsLoggedIn(c *gin.Context) {
	authHeader := c.Request.Header["Authorization"]
	c.Set("isAuth", false)

	if len(authHeader) > 0 {
		tokenString := strings.Split(authHeader[0], " ")[1]

		_, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(os.Getenv("HMAC_SECRET")), nil
		})
		if err != nil {
			logger.Error(err, "Invalid token")
		} else {
			c.Set("isAuth", true)
		}
	}

	c.Next()
}

func RequireAuth(c *gin.Context) {
	isAuth, exists := c.Get("isAuth")

	if exists && !isAuth.(bool) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"msg": "Unauthorized",
		})
		return
	}

	c.Next()
}
