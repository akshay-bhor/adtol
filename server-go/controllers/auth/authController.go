package authController

import (
	"errors"
	"net/http"
	"server-go/db"
	"server-go/middlewares/authMiddleware"
	"server-go/utils/jwttoken"
	"server-go/utils/logger"
	"strconv"

	"server-go/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Register(c *gin.Context) {
	requestBody, _ := c.Get("body")

	username := requestBody.(authMiddleware.RegisterRequest).User
	email := requestBody.(authMiddleware.RegisterRequest).Mail
	name := requestBody.(authMiddleware.RegisterRequest).Name
	surname := requestBody.(authMiddleware.RegisterRequest).Surname
	gid := requestBody.(authMiddleware.RegisterRequest).Gid
	pass := requestBody.(authMiddleware.RegisterRequest).Pass
	ac_type, err := strconv.Atoi(requestBody.(authMiddleware.RegisterRequest).Ac_type)
	mobile := strconv.Itoa(requestBody.(authMiddleware.RegisterRequest).Mobile)

	if err != nil {
		return
	}

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

	var hashedPass *string
	if pass != nil {
		// Hash password
		bytes, err := bcrypt.GenerateFromPassword([]byte(*pass), 14)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"msg": "Error hashing password",
			})
			return
		}
		stringBytes := string(bytes)

		hashedPass = &stringBytes
	}

	newUser := models.Users{
		User:         username,
		Mail:         email,
		Name:         name,
		Surname:      surname,
		Gid:          gid,
		Pass:         hashedPass,
		Country:      uint(requestBody.(authMiddleware.RegisterRequest).Country),
		Mobile:       mobile,
		Ac_type:      uint(ac_type),
		Company_name: requestBody.(authMiddleware.RegisterRequest).Company_name,
	}

	result = db.DB.Create(&newUser)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "Error creating user",
		})
		return
	}

	token, err := jwttoken.GenerateJwtToken(jwt.MapClaims{
		"id":     newUser.Id,
		"user":   username,
		"mail":   email,
		"status": newUser.Status,
		"rank":   newUser.Rank,
		"role":   "access",
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "Error creating token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg":       "success",
		"token":     token,
		"expiresIn": "90",
	})
}

func GetCountries(c *gin.Context) {
	var countries []models.Countries

	db.DB.Find(&countries)

	c.JSON(http.StatusOK, gin.H{
		"countries": countries,
	})
}
