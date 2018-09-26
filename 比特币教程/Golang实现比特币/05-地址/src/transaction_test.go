package main

import "testing"

func TestTransaction_TrimmedCopy(t *testing.T) {
	tx1 := Transaction{
		ID: []byte("ID123"),
		Vin: []TXInput{TXInput{
			Txid:      []byte("txid123"),
			Vout:      0,
			Signature: []byte("sig123"),
			PubKey:    []byte("pubkey123"),
		}},
		Vout: nil,
	}

	txCopy := tx1.TrimmedCopy()

	txCopy.ID = []byte("ID456")
}
