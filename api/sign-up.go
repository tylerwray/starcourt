package starcourt

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type signUpBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// SignUpHandler to take sign-up requests
func SignUpHandler(w http.ResponseWriter, r *http.Request) {

	// Validate HTTP Method
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error": "Must POST to /sign-up."}`))
		return
	}

	// Set response content-type
	w.Header().Set("Content-Type", "application/json")

	// Parse body
	decoder := json.NewDecoder(r.Body)

	var body signUpBody

	if err := decoder.Decode(&body); err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)
		w.Write([]byte(`{"error": "JSON body could not be read."}`))
		return
	}

	s := newService()

	err := s.CreateUser(body.Username, body.Password)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error": "Failed to create user."}`))
		return
	}

	// Respond with Token
	userID := getUserID(r.Context())

	token, err := s.GenerateAuthToken(userID)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error": "Could not generate token"}`))
		return
	}

	w.Write([]byte(fmt.Sprintf(`{"data":{"token": "%s"}}`, token)))
}
