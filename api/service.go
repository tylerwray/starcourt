package starcourt

import (
	"errors"
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"github.com/plaid/plaid-go/plaid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"context"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
)

type service struct {
	db    *mongo.Client
	plaid *plaid.Client
}

func newService() *service {
	dbOptions := options.Client().ApplyURI(os.Getenv("MONGO_CONNECTION_STRING"))
	db, err := mongo.Connect(context.TODO(), dbOptions)

	if err != nil {
		log.Panic(err)
	}

	// Check that our connection is good
	if err := db.Ping(context.TODO(), nil); err != nil {
		log.Panic(err)
	}

	clientOptions := plaid.ClientOptions{
		ClientID:    os.Getenv("PLAID_CLIENT_ID"),
		Secret:      os.Getenv("PLAID_SECRET"),
		PublicKey:   os.Getenv("PLAID_PUBLIC_KEY"),
		Environment: plaid.Development, // Available environments are Sandbox, Development, and Production
	}

	plaidClient, err := plaid.NewClient(clientOptions)

	if err != nil {
		log.Panic("Couldn't create plaid client")
	}

	return &service{
		db,
		plaidClient,
	}
}

// GenerateAuthToken creates an auth token to use
func (s *service) GenerateAuthToken(userID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
	})

	tokenSecret := os.Getenv("TOKEN_SECRET")

	tokenString, err := token.SignedString([]byte(tokenSecret))

	if err != nil {
		return "", errors.New("Could not generate token")
	}

	return tokenString, nil
}

type tokenClaims struct {
	jwt.StandardClaims
	UserID string `json:"user_id"`
}

// ValidateAuthToken validates an auth token
func (s *service) ValidateAuthToken(token string) (string, error) {
	t, err := jwt.ParseWithClaims(token, &tokenClaims{}, func(t *jwt.Token) (interface{}, error) {
		// Validate the alg is what you expect
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
		}

		tokenSecret := os.Getenv("TOKEN_SECRET")

		return []byte(tokenSecret), nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := t.Claims.(*tokenClaims); ok && t.Valid {
		return claims.UserID, nil
	}

	return "", nil
}

// ComparePasswordHash compares a hash against a string to see if they would match
func (*service) ComparePasswordHash(hash string, s string) error {
	incoming := []byte(s)
	existing := []byte(hash)
	return bcrypt.CompareHashAndPassword(existing, incoming)
}

func generateHash(s string) (string, error) {
	saltedBytes := []byte(s)
	hashedBytes, err := bcrypt.GenerateFromPassword(saltedBytes, bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}

	hash := string(hashedBytes[:])

	return hash, nil
}

// AddBankAccount ...
func (s *service) AddBankAccount(userID, publicToken string) error {
	_, err := s.plaid.ExchangePublicToken(publicToken)

	if err != nil {
		return err
	}

	// if _, err := s.db.Exec("INSERT INTO user_bank_accounts (user_id, plaid_access_token, plaid_item_id) VALUES ($1, $2, $3)", userID, res.AccessToken, res.ItemID); err != nil {
	// 	return err
	// }

	return nil
}

// CreateUser service creates a user
func (s *service) CreateUser(username, password string) error {
	_, err := generateHash(password)

	if err != nil {
		return err
	}

	// if _, err := s.db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", strings.ToLower(username), hash); err != nil {
	// 	return err
	// }

	return nil
}

// User type
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// GetUser returns a user based on their username
func (s *service) GetUser(username string) (User, error) {
	var hash string

	// if err := s.db.QueryRow("SELECT password FROM users WHERE username = $1", username).Scan(&hash); err != nil {
	// 	return User{}, err
	// }

	return User{Username: username, Password: hash}, nil
}
