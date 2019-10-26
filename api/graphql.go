package starcourt

import (
	"log"

	"github.com/graphql-go/graphql"
)

func newSchema(s *service) graphql.Schema {
	resolvers := newResolvers(s)

	var queryType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"hello": &graphql.Field{
				Type: graphql.String,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return "world", nil
				},
			},
		},
	})

	var linkBankAccount = graphql.Field{
		Type: exchangeType,
		Args: graphql.FieldConfigArgument{
			"publicToken": &graphql.ArgumentConfig{
				Description: "The public token given back from link",
				Type:        graphql.String,
			},
		},
		Description: "Link a bank account by exchanging a plaid public token for an access token and item id",
		Resolve:     resolvers.linkBankAccount,
	}

	var createUser = graphql.Field{
		Type: userType,
		Args: graphql.FieldConfigArgument{
			"username": &graphql.ArgumentConfig{
				Description: "The username of the user.",
				Type:        graphql.String,
			},
			"password": &graphql.ArgumentConfig{
				Description: "The password of the user.",
				Type:        graphql.String,
			},
		},
		Description: "Create a user.",
		Resolve:     resolvers.createUser,
	}

	var mutationType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"linkBankAccount": &linkBankAccount,
			"createUser":      &createUser,
		},
	})

	schema, err := graphql.NewSchema(
		graphql.SchemaConfig{
			Query:    queryType,
			Mutation: mutationType,
		},
	)

	if err != nil {
		log.Panic(err)
	}

	return schema
}

type resolver struct {
	s *service
}

func newResolvers(s *service) *resolver {
	return &resolver{s}
}

type userBankAccount struct {
	ItemID      string `json:"itemId"`
	AccessToken string `json:"accessToken"`
}

func (r *resolver) linkBankAccount(p graphql.ResolveParams) (interface{}, error) {
	var userID = "12"
	publicToken := p.Args["publicToken"]

	err := r.s.AddBankAccount(userID, publicToken.(string))

	if err != nil {
		return false, err
	}

	return true, nil
}

type user struct {
	Username string `json:"username"`
}

func (r *resolver) createUser(p graphql.ResolveParams) (interface{}, error) {
	username := p.Args["username"].(string)
	password := p.Args["password"].(string)

	if err := r.s.CreateUser(username, password); err != nil {
		return nil, err
	}

	return user{username}, nil
}

var exchangeType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Exchange",
		Fields: graphql.Fields{
			"itemId": &graphql.Field{
				Type: graphql.String,
			},
			"accessToken": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

var userType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"username": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)
