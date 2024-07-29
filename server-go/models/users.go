package models

type Users struct {
	Id           uint    `gorm:"primaryKey;autoIncrement;unique;not null:true" json:"id"`
	User         string  `gorm:"unique;not null:true;size:20" json:"user"`
	Mail         string  `gorm:"unique,not null:true;size:50" json:"mail"`
	Gid          string  `gorm:"unique,not null:true;size:21" json:"gid"`
	Pass         string  `gorm:"unique,not null:false;size:60" json:"pass"`
	Country      uint    `gorm:"not null:true;size:3" json:"country"`
	Mobile       uint    `gorm:"not null:true;size:12;index:,type:btree" json:"mobile"`
	Name         string  `gorm:"not null:true;size:20" json:"name"`
	Surname      string  `gorm:"not null:true;size:20" json:"surname"`
	Ac_type      uint    `gorm:"not null:true;size:1" json:"ac_type"`
	Ref_by       uint    `gorm:"not null:false" json:"ref_by"`
	Company_name string  `gorm:"default:NA;not null:true" json:"company_name"`
	Pub_earnings float64 `gorm:"type:float(15,5);default:0;not null:true" json:"pub_earnings"`
	Ref_earnings float64 `gorm:"type:float(15,5);default:0;not null:true" json:"ref_earnings"`
	Ad_spending  float64 `gorm:"type:float(15,5);default:0;not null:true" json:"ad_spending"`
	Ad_balance   float64 `gorm:"type:float(15,5);default:0;not null:true" json:"ad_balance"`
	Pub_balance  float64 `gorm:"type:float(15,5);default:0;not null:true" json:"pub_balance"`
	Pub_views    uint64  `gorm:"type:bigint(15);default:0;not null:true" json:"pub_views"`
	Pub_clicks   uint64  `gorm:"type:bigint(15);default:0;not null:true" json:"pub_clicks"`
	Pub_pops     uint64  `gorm:"type:bigint(15);default:0;not null:true" json:"pub_pops"`
	Ad_views     uint64  `gorm:"type:bigint(15);default:0;not null:true" json:"ad_views"`
	Ad_clicks    uint64  `gorm:"type:bigint(15);default:0;not null:true" json:"ad_clicks"`
	Ad_pops      uint64  `gorm:"type:bigint(15);default:0;not null:true" json:"ad_pops"`
	Status       uint    `gorm:"type:tinyint(1);default:0;not null:true" json:"status"`
	Rank         uint    `gorm:"type:tinyint(1);default:3;not null:true" json:"rank"`
}
