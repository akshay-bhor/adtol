package jwttoken

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJwtToken(data jwt.MapClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, data)

	return token.SignedString([]byte(os.Getenv("HMAC_SECRET")))
}
