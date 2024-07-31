package authMiddleware

import (
	"net/http"
	"server-go/utils/logger"

	"github.com/gin-gonic/gin"
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
	logger.Debug(reqBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Validation Error!",
			"err": err.Error(),
		})
		return
	}

	c.Set("body", reqBody)

	c.Next()
}
