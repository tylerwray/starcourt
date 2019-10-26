package starcourt

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/graphql-go/graphql"
)

type userIDContextKeyType struct{}

var userIDContextKey *userIDContextKeyType

func getUserID(ctx context.Context) string {
	return ctx.Value(userIDContextKey).(string)
}

// GraphQLHandler ..
func GraphQLHandler(w http.ResponseWriter, r *http.Request) {
	userIDContextKey = &userIDContextKeyType{}

	s := newService()
	token := strings.Split(r.Header.Get("Authorization"), " ")[1]

	userID, err := s.ValidateAuthToken(token)
	schema := newSchema(s)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error":"Invalid token"}`))
		return
	}

	query := `
		{
			hello
		}
	`

	params := graphql.Params{
		Schema:        schema,
		RequestString: query,
		Context:       context.WithValue(r.Context(), userIDContextKey, userID),
	}

	g := graphql.Do(params)

	if len(g.Errors) > 0 {
		log.Fatalf("failed to execute graphql operation, errors: %+v", g.Errors)
	}

	gJSON, _ := json.Marshal(g)

	fmt.Fprintf(w, "%s \n", gJSON) // {“data”:{“hello”:”world”}}
}

// func createUser() {

// if err != nil {
// log.Fatal(err)
// }

// collection := client.Database("starcourt").Collection("users")

// ruan := User{"Ruan", 34, "Cape Town"}

// insertResult, err := collection.InsertOne(context.TODO(), ruan)

// if err != nil {
// log.Fatal(err)
// }

// return insertResult.InsertedID
// }
