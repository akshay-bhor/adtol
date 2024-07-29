package models

type Users struct {
	Id           uint    `gorm:"primaryKey;autoIncrement;unique;not null:true"`
	User         string  `gorm:"unique;not null:true;size:20"`
	Mail         string  `gorm:"unique,not null:true;size:50"`
	Gid          string  `gorm:"unique,not null:true;size:21"`
	Pass         string  `gorm:"unique,not null:false;size:60"`
	Country      uint    `gorm:"not null:true;size:3"`
	Mobile       uint    `gorm:"not null:true;size:12;index:,type:btree"`
	Name         string  `gorm:"not null:true;size:20"`
	Surname      string  `gorm:"not null:true;size:20"`
	Ac_type      uint    `gorm:"not null:true;size:1"`
	Ref_by       uint    `gorm:"not null:false"`
	Company_name string  `gorm:"default:NA;not null:true"`
	Pub_earnings float64 `gorm:"type:float(15,5);default:0;not null:true"`
	Ref_earnings float64 `gorm:"type:float(15,5);default:0;not null:true"`
	Ad_spending  float64 `gorm:"type:float(15,5);default:0;not null:true"`
	Ad_balance   float64 `gorm:"type:float(15,5);default:0;not null:true"`
	Pub_balance  float64 `gorm:"type:float(15,5);default:0;not null:true"`
	Pub_views    uint64  `gorm:"type:bigint(15);default:0;not null:true"`
	Pub_clicks   uint64  `gorm:"type:bigint(15);default:0;not null:true"`
	Pub_pops     uint64  `gorm:"type:bigint(15);default:0;not null:true"`
	Ad_views     uint64  `gorm:"type:bigint(15);default:0;not null:true"`
	Ad_clicks    uint64  `gorm:"type:bigint(15);default:0;not null:true"`
	Ad_pops      uint64  `gorm:"type:bigint(15);default:0;not null:true"`
	Status       uint    `gorm:"type:tinyint(1);default:0;not null:true"`
	Rank         uint    `gorm:"type:tinyint(1);default:3;not null:true"`
}
