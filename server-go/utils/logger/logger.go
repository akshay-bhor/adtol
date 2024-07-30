package logger

import (
	"fmt"
	"runtime/debug"
	"time"
)

func Debug(v ...interface{}) {
	currentTime := time.Now().String()
	fmt.Printf("\n{level: DEBUG, time: %v, error: %v, message: %v}", currentTime, "", v)
}

func Info(v ...interface{}) {
	currentTime := time.Now().String()
	fmt.Printf("\n{level: INFO, time: %v, error: %v, message: %v}", currentTime, "", v)
}

func Warn(err error, v ...interface{}) {
	currentTime := time.Now().String()
	stack := debug.Stack()
	fmt.Printf("\n{level: WARN, time: %v, error: %v, message: %v, stack: %v}", currentTime, err, v, string(stack))
}

func Error(err error, v ...interface{}) {
	currentTime := time.Now().String()
	stack := debug.Stack()
	fmt.Printf("\n{level: ERROR, time: %v, error: %v, message: %v, stack: %v}", currentTime, err, v, string(stack))
}
