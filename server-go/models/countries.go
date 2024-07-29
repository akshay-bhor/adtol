package models

type Countries struct {
	Id        uint   `gorm:"primaryKey;autoIncrement;unique;not null:true" json:"id"`
	Dial_code uint   `gorm:"not null:true" json:"dial_code"`
	Code      string `gorm:"not null:true" json:"code"`
	Name      string `gorm:"not null:true" json:"name"`
}
