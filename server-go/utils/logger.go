package logger

import (
	"fmt"
	"runtime/debug"
	"time"
)

func Debug(err error, v ...interface{}) {
	currentTime := time.Now().String()
	stack := debug.Stack()
	fmt.Printf("{level: DEBUG, time: %v, error: %v, message: %v, stack: %v}", currentTime, err, v, string(stack))
}

func Info(err error, v ...interface{}) {
	currentTime := time.Now().String()
	stack := debug.Stack()
	fmt.Printf("{level: INFO, time: %v, error: %v, message: %v, stack: %v}", currentTime, err, v, string(stack))
}

func Warn(err error, v ...interface{}) {
	currentTime := time.Now().String()
	stack := debug.Stack()
	fmt.Printf("{level: WARN, time: %v, error: %v, message: %v, stack: %v}", currentTime, err, v, string(stack))
}

func Error(err error, v ...interface{}) {
	currentTime := time.Now().String()
	stack := debug.Stack()
	fmt.Printf("{level: ERROR, time: %v, error: %v, message: %v, stack: %v}", currentTime, err, v, string(stack))
}
